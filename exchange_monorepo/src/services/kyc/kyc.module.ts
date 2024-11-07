import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { config } from '../../core/config';

@Module({
  imports: [
    HttpModule.register({
      baseURL: config.kyc.host,
      headers: {
        username: config.kyc.username,
      },
    }),
  ],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
