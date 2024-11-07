import { Module } from '@nestjs/common';
import { UpdateOrdersService } from './update-orders.service';
import { AwsModule } from '../../services/aws/aws.module';
import { LedgerModule } from '../../services/ledger/ledger.module';
import { RewardsModule } from '../rewards/rewards.module';
import { TransactionService } from './transactions.service';

@Module({
  imports: [AwsModule, LedgerModule, RewardsModule],
  providers: [UpdateOrdersService, TransactionService],
})
export class UpdateOrdersModule {}
