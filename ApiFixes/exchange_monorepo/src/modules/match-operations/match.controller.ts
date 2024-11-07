import { Controller, Post, Body } from '@nestjs/common';
import { MatchOperationsService } from './match-operations.service';
import { MatchInstrument, PostMatchData } from './match-operation.types';

@Controller('operations')
export class MatchOperationsController {
  constructor(private readonly matchService: MatchOperationsService) {}

  @Post('post')
  async postMatchOperation(@Body() postMatchData: PostMatchData) {
    return await this.matchService.postMatch(postMatchData);
  }

  @Post('pre')
  async preMatchOperation(@Body() preMatchData: MatchInstrument[]) {
    return await this.matchService.preMatch(preMatchData);
  }
}
