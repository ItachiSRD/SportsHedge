import { ApiProperty } from '@nestjs/swagger';
import { MESSAGES } from '../../../core/constant';
import { ApiResponse } from '../../../core/swagger';

export * from './player.dto';

export class GetHealthCheckResponse extends ApiResponse {
  @ApiProperty({ example: MESSAGES.HEALTH_CHECK })
  data: string;
}
