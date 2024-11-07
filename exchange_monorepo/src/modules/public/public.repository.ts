import { Inject, Injectable } from '@nestjs/common';
import { QueryTypes, Sequelize } from 'sequelize';
import { SEQUELIZE } from '../../core/constant';
import { PlayersMatchReturnsQuery, PlayersPriceQuery } from './dto';

@Injectable()
export class PublicRepository {
  constructor(@Inject(SEQUELIZE) private sequelize: Sequelize) {}

  async getPlayersLastTradedPrice(playerIds: string[]) {
    if (!playerIds.length) {
      return {};
    }

    const query = `
      SELECT json_object_agg(instrument, last_traded_price) AS result
      FROM (
        SELECT DISTINCT ON (instrument) instrument, price as last_traded_price
          FROM trade
          WHERE instrument IN (:playerIds)
          ORDER BY instrument, created_at desc
        ) 
      AS subquery;
    `;

    const [playersLastTradedPrice]: {
      result: { [key: string]: number };
    }[] = await this.sequelize.query(query, {
      replacements: { playerIds },
      type: QueryTypes.SELECT,
    });

    return playersLastTradedPrice?.result ?? {};
  }

  async getPlayerPerformances(
    playerId: string,
    gameLimit = 30,
  ): Promise<number[]> {
    const query = `
      SELECT json_agg(fantasy_points) AS performance_points
        FROM (
          SELECT fantasy_points
          FROM player_match_map
          WHERE player_id = :playerId
          ORDER BY player_match_number DESC
          LIMIT :gameLimit
        ) 
      AS games_performance;
    `;

    const [performanceQuery]: { performance_points: number[] }[] =
      await this.sequelize.query(query, {
        replacements: {
          playerId,
          gameLimit,
        },
        type: QueryTypes.SELECT,
      });

    return performanceQuery?.performance_points ?? [];
  }

  async getPlayersPriceQuery(
    playerIds: string[],
  ): Promise<PlayersPriceQuery[]> {
    const query = `
      SELECT
        p.player_id,
        p.price,
        COALESCE(MAX(CASE WHEN row_num = 2 THEN ranked_match_prices.closing_price END), null) AS one_day_price,
        COALESCE(MAX(CASE WHEN row_num = 5 THEN ranked_match_prices.closing_price END), null) AS five_day_price,
        COALESCE(MAX(CASE WHEN row_num = 10 THEN ranked_match_prices.closing_price END), null) AS ten_day_price,
        COALESCE(MAX(CASE WHEN row_num = 20 THEN ranked_match_prices.closing_price END), null) AS twenty_day_price,
        COALESCE(MAX(CASE WHEN row_num = 30 THEN ranked_match_prices.closing_price END), null) AS thirty_day_price
      FROM players p
      LEFT JOIN (
        SELECT
          pm.player_id,
          pm.player_match_number,
          pm.closing_price,
          ROW_NUMBER() OVER (PARTITION BY pm.player_id ORDER BY pm.player_match_number DESC) AS row_num
        FROM player_match_map pm
        WHERE pm.closing_price != 0
        AND pm.player_id IN (:playerIds)
      ) as ranked_match_prices ON p.player_id = ranked_match_prices.player_id
      WHERE p.player_id IN (:playerIds)
      GROUP BY p.player_id, p.price;
    `;
    const playersPriceList: PlayersPriceQuery[] = await this.sequelize.query(
      query,
      {
        replacements: {
          playerIds,
        },
        type: QueryTypes.SELECT,
      },
    );

    return playersPriceList;
  }

  async getPlayersMatchReturns(
    lastMatchNumber: number,
  ): Promise<PlayersMatchReturnsQuery[]> {
    // calculate the returns for each player based on their match opening price
    // returns = (last match opening price - nth match opening price) / nth match opening price * 100
    const query = `
      SELECT
        player_id,
        ROUND(CAST(((MAX(opening_price) FILTER (WHERE rn = 1) - MAX(opening_price) FILTER (WHERE rn = :lastMatchNumber)) / MAX(opening_price) FILTER (WHERE rn = :lastMatchNumber)) * 100 AS numeric), 2) AS returns
      FROM (
        SELECT
            player_id,
            player_match_number,
            opening_price,
            ROW_NUMBER() OVER (PARTITION BY player_id ORDER BY player_match_number DESC) AS rn
        FROM
            player_match_map
      ) AS PlayerMatches
      GROUP BY player_id
      HAVING MAX(opening_price) FILTER (WHERE rn = :lastMatchNumber) IS NOT NULL
      ORDER BY returns DESC;
    `;

    const playersMatchReturns: PlayersMatchReturnsQuery[] =
      await this.sequelize.query(query, {
        replacements: {
          lastMatchNumber,
        },
        type: QueryTypes.SELECT,
      });

    return playersMatchReturns ?? [];
  }

  async getPlayersUnderRiskMetric(
    riskMetric: number,
    selectedPlayers: string[],
  ): Promise<string[]> {
    const playersLastTradedPrice =
      await this.getPlayersLastTradedPrice(selectedPlayers);

    const playersPriceData = selectedPlayers.map((playerId) => [
      playerId,
      playersLastTradedPrice[playerId] ?? 0,
    ]);

    const valuesPlaceholder = playersPriceData.map(() => '(?, ?)').join(', ');

    const query = `
      WITH players_ltp(player_id, player_ltp) AS (
        VALUES ${valuesPlaceholder}
      )
      SELECT p.player_id
      FROM players p
      JOIN players_ltp pl ON p.player_id = pl.player_id
      WHERE ((p.buy_inventory_limit + p.sell_inventory_limit) * 
        (CASE
          WHEN pl.player_ltp = 0 THEN p.price
          ELSE pl.player_ltp
        END)
      ) < ${riskMetric};
    `;

    const [filteredPlayers]: { player_id: string[] }[] =
      await this.sequelize.query(query, {
        replacements: playersPriceData.flat(),
        type: QueryTypes.SELECT,
      });

    return filteredPlayers?.player_id ?? [];
  }
}
