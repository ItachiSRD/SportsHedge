import { Module } from '@nestjs/common';
import { LedgerModule } from '../../services/ledger/ledger.module';
import { RewardsService } from './rewards.service';

@Module({
  imports: [LedgerModule],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}
