import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';
import { SHBOOKS } from '../../core/config';
import { ERROR_CODES, ERROR_MSG, PLAYER_REPOSITORY } from '../../core/constant';
import { LedgerService } from '../../services/ledger/ledger.service';
import { Player } from '../orders/entities/player.entity';
import {
  GetPlayerDetailsResponse,
  GetPlayersResponse,
  PlayersMatchReturnsQuery,
  PlayersPriceResponse,
  StockAvailability,
  TrendingPlayersResponse,
} from './dto';
import { PublicRepository } from './public.repository';

@Injectable()
export class PublicService {
  private metricInterestLimit: number;
  constructor(
    @Inject(PLAYER_REPOSITORY) private readonly playerRepository: typeof Player,
    private readonly publicRepository: PublicRepository,
    private readonly ledgerService: LedgerService,
    configService: ConfigService,
  ) {
    this.metricInterestLimit = configService.get<number>(
      'PLAYERS_METRIC_INTEREST_LIMIT',
    );
  }

  async getPlayers(): Promise<GetPlayersResponse> {
    const players = await this.playerRepository.findAll();

    if (!players?.length) {
      return null;
    }

    return players.reduce(
      (res, player) => ({
        ...res,
        [player.playerId]: {
          name: player.name,
          role: player.role,
          team: player.team,
        },
      }),
      {},
    ) as GetPlayersResponse;
  }

  private getPerformanceAverage(performancePoints: number[]): number {
    return (
      Math.round(
        (performancePoints.reduce(
          (sum: number, points: number) => sum + points,
          0,
        ) /
          performancePoints.length) *
          100,
      ) / 100
    );
  }

  async getPlayerDetails(
    player_id: string,
    gameLimit = 30,
  ): Promise<GetPlayerDetailsResponse> {
    const player = await this.playerRepository.findByPk(player_id);
    if (!player) {
      throw new NotFoundException({
        message: ERROR_MSG.PLAYER_NOT_FOUND,
        error_code: ERROR_CODES.NOT_FOUND,
      });
    }

    const performancePoints = await this.publicRepository.getPlayerPerformances(
      player.playerId,
      gameLimit,
    );
    // TODO: Finalize the logic for Stock Availability
    const stockAvailability: StockAvailability = {
      buy: 50,
      sell: 50,
    };
    const performanceAverage = this.getPerformanceAverage(performancePoints);

    //  Divide the value by Precision
    //  TODO: Read the precision value from Env
    const bids = player.topPrices.bids.map((bid) => ({
      p: (bid.p /= 100),
      q: bid.q,
    }));

    const asks = player.topPrices.asks.map((ask) => ({
      p: (ask.p /= 100),
      q: ask.q,
    }));

    return {
      playerId: player.playerId,
      isPlaying: player.isPlaying,
      canTrade: player.canTrade,
      price: player.price,
      performancePoints,
      fantasyPoints: player.fantasyPoints,
      performanceAverage,
      stockAvailability,
      marketDepth: {
        bids,
        asks,
      },
    };
  }

  private async getPlayerListAndValidate(
    playerIds: string[],
  ): Promise<string[]> {
    const players = await this.playerRepository.findAll({
      where: {
        ...(playerIds.length
          ? {
              playerId: {
                [Op.in]: playerIds,
              },
            }
          : {
              canTrade: true,
            }),
      },
      attributes: ['player_id'],
    });

    if (!playerIds.length) {
      return players.map((player: any) => player.dataValues.player_id);
    }

    if (players.length !== playerIds.length) {
      throw new BadRequestException({
        message: ERROR_MSG.PLAYER_LIST_INVALID,
        error_code: ERROR_CODES.INVALID_PLAYER_LIST,
      });
    }

    return playerIds;
  }

  async getPlayersPrice(playerIds: string[]): Promise<PlayersPriceResponse> {
    const playersList = await this.getPlayerListAndValidate(playerIds);

    const [playersTradedPrice, playersPriceList] = await Promise.all([
      this.publicRepository.getPlayersLastTradedPrice(playersList),
      this.publicRepository.getPlayersPriceQuery(playersList),
    ]);

    return playersPriceList.reduce(
      (acc, { player_id, ...rest }) => ({
        ...acc,
        [player_id]: {
          price: Number(rest.price),
          ltp: Number(playersTradedPrice[player_id] ?? rest.price),
          oneDayPrice: Number(rest.one_day_price),
          fiveDayPrice: Number(rest.five_day_price),
          tenDayPrice: Number(rest.ten_day_price),
          twentyDayPrice: Number(rest.twenty_day_price),
          thirtyDayPrice: Number(rest.thirty_day_price),
        },
      }),
      {} as PlayersPriceResponse,
    );
  }

  private async getCustomerDeposits(currency: string = 'INR') {
    const balances = await this.ledgerService.getBookBalances(SHBOOKS.CASH, [
      currency,
    ]);

    const customerDeposits = balances?.[currency]
      ? Number(balances[currency])
      : 0;
    return Math.abs(customerDeposits);
  }

  private async calculateRiskMetric(): Promise<number> {
    // Total listed players promise
    const totalListedPlayersPromise = this.playerRepository.count({
      where: { canTrade: true },
    });

    // 1. Get total customer deposits
    // 2. Get total listed players
    const [totalCustomerDeposits, totalListedPlayers] = await Promise.all([
      this.getCustomerDeposits(),
      totalListedPlayersPromise,
    ]);

    // 3. If no customer deposits or no listed players
    // then return risk metric as 0
    if (totalCustomerDeposits == 0 || totalListedPlayers == 0) {
      return 0;
    }

    // metric of interest (m) < 0.75 [Metric Interest Limit]
    // 4. risk metric = m * Total customer deposits / Total listed players
    const riskMetric =
      (this.metricInterestLimit * totalCustomerDeposits) / totalListedPlayers;
    return riskMetric;
  }

  private getTopTrendingPlayers(
    playersMatchReturns: PlayersMatchReturnsQuery[],
    filteredPlayers: string[],
  ): string[] {
    const trendLimit = 10;
    // Maximum of ten from top positive returns
    const topPositivePlayers: string[] = [];
    for (const playerReturns of playersMatchReturns) {
      if (!filteredPlayers.includes(playerReturns.player_id)) {
        continue;
      }

      if (
        Number(playerReturns.returns) < 0 ||
        topPositivePlayers.length >= trendLimit
      ) {
        break;
      }

      topPositivePlayers.push(playerReturns.player_id);
    }

    // Maximum of ten from bottom negative returns
    const topNegativePlayers: string[] = [];
    for (let i = playersMatchReturns.length - 1; i >= 0; i--) {
      if (!filteredPlayers.includes(playersMatchReturns[i].player_id)) {
        continue;
      }

      if (
        Number(playersMatchReturns[i].returns) > 0 ||
        topNegativePlayers.length >= trendLimit
      ) {
        break;
      }

      topNegativePlayers.unshift(playersMatchReturns[i].player_id);
    }

    return [...topPositivePlayers, ...topNegativePlayers];
  }

  async getTrendingPlayers(
    noOfMatches: number = 30,
  ): Promise<TrendingPlayersResponse> {
    // 1. Get players returns based on match opening price in desc order of returns
    const playersMatchReturns =
      await this.publicRepository.getPlayersMatchReturns(noOfMatches);

    // 2. Create an array of player ids from their match returns list
    const playerIds = playersMatchReturns.reduce(
      (acc: string[], { player_id, returns }) =>
        Number.isNaN(returns) ? acc : acc.concat(player_id),
      [],
    );

    if (!playerIds?.length) {
      return {
        noOfMatches,
        playerIds: [],
      };
    }

    // 3. Calculate risk metric
    const riskMetric = await this.calculateRiskMetric();
    if (riskMetric == 0) {
      // Get trending players directly on players
      return {
        noOfMatches,
        playerIds: this.getTopTrendingPlayers(playersMatchReturns, playerIds),
      };
    }

    // 4. Get players under risk metric
    const playersUnderRiskMetric =
      await this.publicRepository.getPlayersUnderRiskMetric(
        riskMetric,
        playerIds,
      );

    // 5. Get trending players for players under risk metric
    return {
      noOfMatches,
      playerIds: this.getTopTrendingPlayers(
        playersMatchReturns,
        playersUnderRiskMetric,
      ),
    };
  }
}
