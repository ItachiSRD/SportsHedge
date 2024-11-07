import { ApiProperty } from '@nestjs/swagger';
import { ERROR_CODES, ERROR_MSG, MESSAGES } from '../constant';

export class ApiResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: MESSAGES.DEFAULT })
  message: string;
}

export class ApiErrorResponse {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: ERROR_MSG.INTERNAL_SERVER_ERROR })
  message: string;

  @ApiProperty({ example: ERROR_CODES.UNKNOWN })
  error_code: string;

  @ApiProperty({ example: ERROR_MSG.BAD_REQUEST })
  error: string;

  @ApiProperty()
  path: string;

  @ApiProperty({ example: '2023-10-07T04:42:04.507Z' })
  timestamp: string;
}
