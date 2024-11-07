import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ERROR_CODES, ERROR_MSG, MESSAGES, SWAGGER } from '../../core/constant';
import { CustomSwaggerResponse } from '../../core/swagger';
import {
  GetHealthCheckResponse,
  GetPlayerDetailsApiResponse,
  GetPlayerDetailsResponse,
  GetPlayersApiResponse,
  GetPlayersPriceDto,
  GetPlayersResponse,
  PlayerMatchQuery,
  PlayersPriceApiResponse,
  PlayersPriceResponse,
  TrendingPlayersApiResponse,
} from './dto';
import { PublicService } from './public.service';

@ApiTags(SWAGGER.PUBLIC_APIS)
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('health')
  @CustomSwaggerResponse({
    type: GetHealthCheckResponse,
    isAuthorizedRoute: false,
  })
  getHealthCheck() {
    return MESSAGES.HEALTH_CHECK;
  }

  @Get('players')
  @CustomSwaggerResponse({
    type: GetPlayersApiResponse,
    isAuthorizedRoute: false,
  })
  async getPlayers(): Promise<GetPlayersResponse> {
    const players = await this.publicService.getPlayers();

    if (!players) {
      throw new NotFoundException({
        message: ERROR_MSG.PLAYER_DETAILS_NOT_FOUND,
        error_code: ERROR_CODES.NOT_FOUND,
      });
    }

    return players;
  }

  @Get('players/:player_id')
  @CustomSwaggerResponse({
    type: GetPlayerDetailsApiResponse,
    isAuthorizedRoute: false,
  })
  async getPlayerDetails(
    @Param('player_id') player_id: string,
  ): Promise<GetPlayerDetailsResponse> {
    return await this.publicService.getPlayerDetails(player_id);
  }

  @Post('players/price')
  @CustomSwaggerResponse({
    type: PlayersPriceApiResponse,
    methodType: 'POST',
    isAuthorizedRoute: false,
  })
  async getPlayersPrice(
    @Body() dto: GetPlayersPriceDto,
  ): Promise<PlayersPriceResponse> {
    return this.publicService.getPlayersPrice(dto.playerIds);
  }

  @Get('trending-players')
  @CustomSwaggerResponse({
    type: TrendingPlayersApiResponse,
    isAuthorizedRoute: false,
  })
  async getTrendingPlayers(@Query() query: PlayerMatchQuery): Promise<any> {
    return this.publicService.getTrendingPlayers(query.noOfMatches);
  }
}
