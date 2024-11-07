import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const { v4: uuidv4 } = require('uuid');

@Injectable()
export class AwsService {
  private accessKeyId: string;
  private secretAccessKey: string;
  private region: string;
  private endpoint: string;
  private sqsClient: SQSClient;

  constructor(private readonly configService: ConfigService) {
    this.accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    this.secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
    this.region = this.configService.get('AWS_REGION');
    this.endpoint = this.configService.get('AWS_ENDPOINT');
  }

  public getSQSClient = () => {
    if (!this.sqsClient) {
      if (this.configService.get('NODE_ENV') === 'development') {
        this.sqsClient = new SQSClient({
          region: this.region,
          credentials: {
            accessKeyId: this.accessKeyId,
            secretAccessKey: this.secretAccessKey,
          },
          endpoint: this.endpoint,
        });
      } else {
        this.sqsClient = new SQSClient({
          region: this.region,
        });
      }
    }
    return this.sqsClient;
  };

  /** Send message to the specified Queue */
  public sendSQSMessage = async (QueueUrl: string, MessageBody) =>
    this.getSQSClient().send(
      new SendMessageCommand({
        MessageBody: JSON.stringify(MessageBody),
        MessageAttributes: {
          orderId: {
            DataType: 'String',
            StringValue: MessageBody.orderId,
          },
        },
        MessageGroupId: uuidv4(),
        MessageDeduplicationId: uuidv4(),
        QueueUrl,
      }),
    );
}
