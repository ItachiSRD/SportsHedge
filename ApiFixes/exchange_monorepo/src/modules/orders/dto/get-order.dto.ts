import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import {
  ORDER_SIDE,
  ORDER_SORT_BY,
  ORDER_STATES,
  ORDER_STATUS_MAP,
  ORDER_TYPE,
  SWAGGER,
} from '../../../core/constant';
import { PaginationQuery } from '../../../core/pagination';
import { ApiResponse } from '../../../core/swagger';

export class GetOrder {
  @ApiProperty({ example: SWAGGER.ORDER.ORDER_ID })
  orderId: bigint;

  @ApiProperty({ example: SWAGGER.ORDER.USER_ID })
  userId: bigint;

  @ApiProperty({ example: SWAGGER.ORDER.TRANSACTION_FEE })
  transactionFee: number;

  @ApiProperty({ example: SWAGGER.ORDER.FEE_PERCENT })
  feePercent: number;

  @ApiProperty({ example: SWAGGER.ORDER.PRICE })
  price: number;

  @ApiProperty({ example: SWAGGER.ORDER.SIZE })
  size: number;

  @ApiProperty({ example: SWAGGER.ORDER.QUANTITY_FILLED })
  quantityFilled: number;

  @ApiProperty({ example: SWAGGER.ORDER.PRICE_FILLED })
  priceFilled: number;

  @ApiProperty({
    example: ORDER_STATES.INIT,
    enum: Object.values(ORDER_STATES),
  })
  status: string;

  @ApiProperty({ example: ORDER_SIDE.BUY, enum: Object.values(ORDER_SIDE) })
  side: string;

  @ApiProperty({
    example: ORDER_TYPE.MARKET,
    enum: Object.values(ORDER_TYPE),
  })
  type: string;

  @ApiProperty({ example: SWAGGER.ORDER.INSTRUMENT })
  instrument: string;

  @ApiProperty({ example: SWAGGER.ORDER.CREATED_AT })
  createdAt: Date;

  @ApiProperty({ example: SWAGGER.ORDER.UPDATED_AT })
  updatedAt: Date;
}

export class GetOrderApiResponse extends ApiResponse {
  @ApiProperty({ type: GetOrder })
  data: GetOrder;
}

export class GetUserOrdersQueryParams {
  @ApiPropertyOptional({
    example: SWAGGER.ORDER.INSTRUMENT,
    description: 'Filter by name',
  })
  @IsString()
  @Matches(/^[a-zA-Z\s]*$/, { message: 'Filter should contain only alphabets' })
  @IsOptional()
  filterBy?: string;

  @ApiPropertyOptional({ example: ORDER_SORT_BY.STATUS, enum: ORDER_SORT_BY })
  @IsEnum(Object.values(ORDER_SORT_BY))
  @IsOptional()
  sortBy?: string;
}

export class GetUserOrderQuery {
  order_id: string;
  type: string;
  instrument: string;
  size: number;
  price: string;
  status: string;
  created_at: string;
  side: string;
  quantity_filled: number;
  metadata?: Record<string, any>;
}

export class GetUserOrder {
  @ApiProperty({ example: SWAGGER.ORDER.ORDER_ID })
  orderId: number;

  @ApiProperty({
    example: ORDER_TYPE.MARKET,
    enum: Object.values(ORDER_TYPE),
  })
  type: string;

  @ApiProperty({ example: SWAGGER.ORDER.INSTRUMENT })
  instrument: string;

  @ApiProperty({ example: SWAGGER.ORDER.SIZE })
  size: number;

  @ApiProperty({ example: SWAGGER.ORDER.PRICE })
  price: number;

  @ApiProperty({
    example: ORDER_STATUS_MAP.OPEN,
    enum: Object.values(ORDER_STATUS_MAP),
  })
  status: string;

  @ApiProperty({ example: SWAGGER.ORDER.CREATED_AT })
  date: Date;

  @ApiProperty({ example: SWAGGER.ORDER.SIDE })
  side: string;

  @ApiProperty({ example: SWAGGER.ORDER.QUANTITY_FILLED })
  quantityFilled: number;

  @ApiProperty({ example: SWAGGER.ORDER.ERROR_REASON })
  errorReason: string;
}

export class GetUserOrdersResponse extends PaginationQuery {
  @ApiProperty({ example: SWAGGER.ORDER.USER_ID })
  userId: number;

  @ApiProperty({ type: [GetUserOrder] })
  orders: GetUserOrder[];
}

export class GetUserOrdersApiResponse extends ApiResponse {
  @ApiProperty({ type: GetUserOrdersResponse })
  data: GetUserOrdersResponse;
}
