import { Module } from '@nestjs/common';
import { MatchOperationsService } from './match-operations.service';
import { MatchOperationsController } from './match.controller';
import { AwsModule } from '../../services/aws/aws.module';
import { OrdersModule } from '../orders/src/orders.module';

@Module({
  imports: [AwsModule, OrdersModule],
  controllers: [MatchOperationsController],
  providers: [MatchOperationsService],
})
export class MatchOperationsModule {}
