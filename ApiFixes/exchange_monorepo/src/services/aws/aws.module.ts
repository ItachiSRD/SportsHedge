import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { SQSConsumer } from './sqs-consumer';

@Module({
  providers: [AwsService, SQSConsumer],
  exports: [AwsService, SQSConsumer],
})
export class AwsModule {}
