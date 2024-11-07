import { Module } from '@nestjs/common';
import { KycModule } from '../../services/kyc/kyc.module';
import { LedgerModule } from '../../services/ledger/ledger.module';
import { PhonepeModule } from '../../services/phonepe/phonepe.module';
import { PublicRepository } from '../public/public.repository';
import { RewardsModule } from '../rewards/rewards.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [LedgerModule, KycModule, PhonepeModule, RewardsModule],
  controllers: [UsersController],
  providers: [UsersService, PublicRepository],
  exports: [UsersService],
})
export class UsersModule {}
