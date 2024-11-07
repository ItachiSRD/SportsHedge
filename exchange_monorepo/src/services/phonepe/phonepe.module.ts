import { Module } from '@nestjs/common';
import { PhonepeService } from './phonepe.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 7000,
    }),
  ],
  providers: [PhonepeService],
  exports: [PhonepeService],
})
export class PhonepeModule {}
