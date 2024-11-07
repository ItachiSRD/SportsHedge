import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { Pagination, PaginationDto } from '../../../core/pagination';
import { CustomSwaggerResponse } from '../../../core/swagger';
import { GetUser } from '../../users/decorator/get-user.decorator';
import { CancelOrderRequest, CreateOrderRequest } from '../dto/createOrder.dto';
import {
  GetOrder,
  GetOrderApiResponse,
  GetUserOrdersApiResponse,
  GetUserOrdersQueryParams,
  GetUserOrdersResponse,
} from '../dto/get-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @CustomSwaggerResponse()
  async createOrder(
    @Body() userInput: CreateOrderRequest,
    @GetUser() userDetails: DecodedIdToken,
  ) {
    return await this.ordersService.createOrder(userDetails.uid, userInput);
  }

  @Get()
  @CustomSwaggerResponse({ type: GetUserOrdersApiResponse, isPagination: true })
  async getAllOrders(
    @GetUser() userDetails: DecodedIdToken,
    @Pagination() pagination: PaginationDto,
    @Query() queryParams: GetUserOrdersQueryParams,
  ): Promise<GetUserOrdersResponse> {
    return this.ordersService.getUserOrders(
      userDetails.uid,
      pagination,
      queryParams,
    );
  }

  @Get('/:order_id')
  @CustomSwaggerResponse({ type: GetOrderApiResponse })
  async getUserOrder(
    @GetUser() userDetails: DecodedIdToken,
    @Param('order_id') order_id: bigint,
  ): Promise<GetOrder> {
    return this.ordersService.getUserOrderDetails(userDetails.uid, order_id);
  }

  @Post('cancel')
  async cancelOrder(
    @GetUser() userDetails: DecodedIdToken,
    @Body() userInput: CancelOrderRequest,
  ) {
    return await this.ordersService.cancelOrder(
      userDetails.uid,
      userInput.orderId,
    );
  }
}
