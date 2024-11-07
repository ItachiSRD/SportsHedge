import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PLAYER_ROLES, SWAGGER } from '../../../core/constant';
import { ApiResponse } from '../../../core/swagger';
import { OrderbookEntry } from '../../orders/entities/player-types';

class GetPlayer {
  @ApiProperty({ example: SWAGGER.PLAYER.NAME })
  name: string;

  @ApiProperty({
    example: SWAGGER.PLAYER.ROLE,
    enum: Object.values(PLAYER_ROLES),
  })
  role: string;

  @ApiProperty({ example: SWAGGER.PLAYER.TEAM })
  team: string;
}

export class GetPlayersResponse {
  [key: string]: GetPlayer;
}

export class GetPlayersApiResponse extends ApiResponse {
  @ApiProperty({ example: SWAGGER.GET_PLAYERS_RESPONSE })
  data: GetPlayersResponse;
}

export class StockAvailability {
  @ApiProperty({ example: SWAGGER.PLAYER.STOCK_AVAILABILITY.BUY })
  buy: number;

  @ApiProperty({ example: SWAGGER.PLAYER.STOCK_AVAILABILITY.SELL })
  sell: number;
}

export class GetPlayerDetailsResponse {
  @ApiProperty({ example: SWAGGER.PLAYER.PLAYER_ID })
  playerId: string;

  @ApiProperty({ example: SWAGGER.PLAYER.IS_PLAYING })
  isPlaying: boolean;

  @ApiProperty({ example: SWAGGER.PLAYER.CAN_TRADE })
  canTrade: boolean;

  @ApiProperty({ example: SWAGGER.PLAYER.PRICE })
  price: number;

  @ApiProperty({ example: SWAGGER.PLAYER.PERFORMANCE_POINTS })
  performancePoints: number[];

  @ApiProperty({ example: SWAGGER.PLAYER.FANTASY_POINTS })
  fantasyPoints: number;

  @ApiProperty({ example: SWAGGER.PLAYER.PERFORMANCE_AVERAGE })
  performanceAverage: number;

  @ApiProperty({ type: StockAvailability })
  stockAvailability: StockAvailability;

  @ApiProperty({ example: SWAGGER.PLAYER.MARKET_DEPTH })
  marketDepth: {
    bids: OrderbookEntry[];
    asks: OrderbookEntry[];
  };
}

export class GetPlayerDetailsApiResponse extends ApiResponse {
  @ApiProperty({ type: GetPlayerDetailsResponse })
  data: GetPlayerDetailsResponse;
}

export class GetPlayersPriceDto {
  @ApiProperty({ example: [SWAGGER.PLAYER.PLAYER_ID] })
  @ArrayUnique()
  @IsString({ each: true })
  playerIds: string[];
}

export class PlayersPriceQuery {
  player_id: string;
  price: number;
  one_day_price: number;
  five_day_price: number;
  ten_day_price: number;
  twenty_day_price: number;
  thirty_day_price: number;
}

class PlayersPrice {
  @ApiProperty({ example: SWAGGER.PLAYERS_PRICE.PRICE })
  price: number;

  @ApiProperty({ example: SWAGGER.PLAYERS_PRICE.LTP })
  ltp: number;

  @ApiProperty({ example: SWAGGER.PLAYERS_PRICE.ONE_DAY_PRICE })
  oneDayPrice: number;

  @ApiProperty({ example: SWAGGER.PLAYERS_PRICE.FIVE_DAY_PRICE })
  fiveDayPrice: number;

  @ApiProperty({ example: SWAGGER.PLAYERS_PRICE.TEN_DAY_PRICE })
  tenDayPrice: number;

  @ApiProperty({ example: SWAGGER.PLAYERS_PRICE.TWENTY_DAY_PRICE })
  twentyDayPrice: number;

  @ApiProperty({ example: SWAGGER.PLAYERS_PRICE.THIRTY_DAY_PRICE })
  thirtyDayPrice: number;
}

export class PlayersPriceResponse {
  [key: string]: PlayersPrice;
}

export class PlayersPriceApiResponse extends ApiResponse {
  @ApiProperty({ example: SWAGGER.PLAYERS_PRICE_RESPONSE })
  data: PlayersPriceResponse;
}

export class PlayerMatchQuery {
  @ApiPropertyOptional({
    example: SWAGGER.PLAYER.MATCH_NUMBER,
    minimum: 2,
    maximum: 30,
  })
  @IsNumber()
  @Min(2)
  @Max(30)
  @Type(() => Number)
  @IsOptional()
  noOfMatches?: number;
}

export class PlayersMatchReturnsQuery {
  player_id: string;
  returns: string;
}

export class TrendingPlayersResponse {
  @ApiProperty({ example: SWAGGER.PLAYER.MATCH_NUMBER })
  noOfMatches: number;

  @ApiProperty({ example: [SWAGGER.PLAYER.PLAYER_ID] })
  playerIds: string[];
}

export class TrendingPlayersApiResponse extends ApiResponse {
  @ApiProperty({ type: TrendingPlayersResponse })
  data: TrendingPlayersResponse;
}
