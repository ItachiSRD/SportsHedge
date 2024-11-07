import { Injectable } from '@nestjs/common';
import { Consumer, ConsumerOptions } from 'sqs-consumer';
import { AwsService } from './aws.service';
import {
  Message,
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SQSConsumer {
  private consumer: Consumer;
  private client: SQSClient;
  private isShuttingDown: boolean;
  private isStopped: boolean;

  constructor(
    private readonly awsService: AwsService,
    private readonly configService: ConfigService,
  ) {
    this.client = this.awsService.getSQSClient();
    this.isStopped = false;
  }

  temp(
    queueUrl: string,
    msgHandler: (message: Message) => Promise<void | Message>,
  ) {
    const config: ConsumerOptions = {
      queueUrl,
      handleMessage: msgHandler,
      sqs: this.awsService.getSQSClient(),
      messageAttributeNames: ['orderId'],
      pollingWaitTimeMs: 10,
      waitTimeSeconds: 5,
    };

    this.consumer = Consumer.create(config);
    this.consumer.start();
  }

  start = async (
    queueUrl: string,
    msgHandler: (message: Message) => Promise<void | Message>,
  ) => {
    const params = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: this.configService.get('POLL_INTERVAL'),
      MessageAttributeNames: ['All'],
    };

    for (;;) {
      try {
        const response = await this.client.send(
          new ReceiveMessageCommand(params),
        );
        const messages = response.Messages || [];

        if (this.isShuttingDown) {
          console.log('Shutting down gracefully');
          this.isStopped = true;
          return;
        }

        for (let i = 0; i < messages.length; i += 1) {
          await msgHandler(messages[i]);

          // Delete the message from the queue after processing
          const deleteParams = {
            QueueUrl: params.QueueUrl,
            ReceiptHandle: messages[i].ReceiptHandle,
          };
          await this.client.send(new DeleteMessageCommand(deleteParams));
        }
      } catch (error) {
        console.error('Error in SQS Consumer:', error);
      }
    }
  };

  stop = async () => {
    this.isShuttingDown = true;

    function delay(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    for (let i = 0; i < 20; i++) {
      if (this.isStopped) break;

      await delay(1000);
    }

    console.log('Stopped Success');
  };
}
