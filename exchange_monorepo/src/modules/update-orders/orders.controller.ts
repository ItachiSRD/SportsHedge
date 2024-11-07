import { Body, Controller, Post } from '@nestjs/common';
import { UpdateOrdersService } from './update-orders.service';
import { Message } from '@aws-sdk/client-sqs';

@Controller('update')
export class UpdateOrdersController {
  constructor(private readonly updateOrderService: UpdateOrdersService) {}

  @Post('test')
  async testFulfilled(@Body() body) {
    const input: Message = {
      MessageAttributes: {
        orderId: {
          DataType: 'String',
          StringValue: body.orderId,
        },
      },
      Body: JSON.stringify({
        ...body,
      }),
    };
    return await this.updateOrderService.msgHandler(input);
  }
}
