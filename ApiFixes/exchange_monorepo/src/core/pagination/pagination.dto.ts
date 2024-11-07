import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationQuery {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pageNo?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize?: number;
}

export class PaginationResponse extends PaginationQuery {}

export class PaginationDto extends PaginationQuery {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  offset: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  limit: number;
}

export class PaginationApiResponse {
  @ApiProperty({ type: PaginationResponse })
  pagination: PaginationResponse;
}
