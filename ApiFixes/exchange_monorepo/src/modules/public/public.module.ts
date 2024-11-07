import { Module } from '@nestjs/common';
import { LedgerModule } from '../../services/ledger/ledger.module';
import { PublicController } from './public.controller';
import { PublicRepository } from './public.repository';
import { PublicService } from './public.service';

@Module({
  imports: [LedgerModule],
  controllers: [PublicController],
  providers: [PublicService, PublicRepository],
})
export class PublicModule {}
