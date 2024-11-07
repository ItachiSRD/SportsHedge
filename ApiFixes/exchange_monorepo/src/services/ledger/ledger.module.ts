import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 7000,
    }),
  ],
  controllers: [LedgerController],
  providers: [LedgerService],
  exports: [LedgerService],
})
export class LedgerModule {}
