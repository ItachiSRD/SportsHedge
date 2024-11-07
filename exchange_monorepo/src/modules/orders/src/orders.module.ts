import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AwsModule } from '../../../services/aws/aws.module';
import { LedgerModule } from '../../../services/ledger/ledger.module';

@Module({
  imports: [AwsModule, LedgerModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
