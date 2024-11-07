import { Test, TestingModule } from '@nestjs/testing';
import { UpdateOrdersService } from './update-orders.service';
import { ConfigModule } from '@nestjs/config';
import { SQSConsumer } from '../../services/aws/sqs-consumer';
import { Message } from '@aws-sdk/client-sqs';
import {
  ORDER_REPOSITORY,
  TRADE_REPOSITORY,
  USER_REPOSITORY,
  LEDGER_LOG_REPOSITORY,
} from '../../core/constant';
import { LedgerService } from '../../services/ledger/ledger.service';
import { Order } from '../../entities/orders.entity';
import { DatabaseModule } from '../../core/database/database.module';
import { MEOrder } from './types';
import { User } from '../users/entity/users.entity';
import { TransactionService } from './transactions.service';

describe('UpdateOrdersService', () => {
  let service: UpdateOrdersService;
  let message: Message;

  let cancelSpy: jest.SpyInstance;
  let createSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let fulfilledSpy: jest.SpyInstance;
  let transactionService: TransactionService;
  let partial: MEOrder, fulfilled: MEOrder, orders: Order[];

  beforeEach(async () => {
    const testConfig = () => ({
      QUEUE_OUTPUT: 'http://localhost:4566/000000000000/output',
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [testConfig],
        }),
        DatabaseModule,
      ],
      providers: [
        UpdateOrdersService,
        {
          provide: SQSConsumer,
          useValue: {
            start: () => {},
          },
        },
        {
          provide: LedgerService,
          useValue: {},
        },
        {
          provide: USER_REPOSITORY,
          useValue: {
            findAll: () => {
              return [
                {
                  userId: 7,
                  lockBookId: 5,
                  mainBookId: 6,
                },
                {
                  userId: 8,
                  lockBookId: 7,
                  mainBookId: 8,
                },
                {
                  userId: 9,
                  lockBookId: 9,
                  mainBookId: 10,
                },
              ];
            },
          },
        },
        {
          provide: LEDGER_LOG_REPOSITORY,
          useValue: {},
        },
        {
          provide: ORDER_REPOSITORY,
          useValue: {
            update: () => {
              return {
                msg: 'Success',
              };
            },
            findAll: () => {
              return [
                {
                  orderId: 1,
                  userId: 7,
                },
                {
                  orderId: 2,
                  userId: 8,
                },
                {
                  orderId: 3,
                  userId: 9,
                },
              ];
            },
          },
        },
        {
          provide: TRADE_REPOSITORY,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UpdateOrdersService>(UpdateOrdersService);
    cancelSpy = jest.spyOn(service, 'handleCancelled');
    createSpy = jest.spyOn(service, 'handleCreated');
    errorSpy = jest.spyOn(service, 'handleErrors');
    fulfilledSpy = jest.spyOn(service, 'handleFulfilled');

    message = {
      Body: '',
      MessageAttributes: {
        orderId: {
          DataType: 'STRING',
          StringValue: '10',
        },
      },
    };

    fulfilled = {
      '1': {
        p: '11',
        q: '11',
        s: 'buy',
      },
      '2': {
        p: '22',
        q: '22',
        s: 'sell',
      },
    };

    partial = {
      '3': {
        p: '33',
        q: '33',
        s: 'temp',
      },
    };

    orders = [
      new Order({ userId: BigInt(69) }),
      new Order({ userId: BigInt(11) }),
      new Order({ userId: BigInt(12) }),
    ];
  });

  afterEach(() => {
    cancelSpy.mockRestore();
    createSpy.mockRestore();
    errorSpy.mockRestore();
    fulfilledSpy.mockRestore();
  });

  describe('Created', () => {
    it('Should call this', () => {
      const body = {
        created: ['asdf'],
      };
      message.Body = JSON.stringify(body);
      service.msgHandler(message);
      expect(createSpy).toHaveBeenCalled();
    });

    it('Should Update all statuses', async () => {
      const body = {
        created: {
          12: {
            p: '55',
            q: '12',
            s: 'buy',
          },
        },
      };

      message.Body = JSON.stringify(body);
      await service.msgHandler(message);
      expect(createSpy).toHaveBeenCalled();
    });
  });

  describe('Collect', () => {
    it('Has Partial', async () => {
      const output = service.getConvertedOrderIds('3', partial);
      console.log('OP', output);
    });

    it('Should not have null', async () => {
      const fulfilled = {
        '1': {
          p: '11',
          q: '11',
          s: 'buy',
        },
        '2': {
          p: '22',
          q: '22',
          s: 'sell',
        },
      };

      const output = transactionService.getConvertedOrderIds(null, fulfilled);
      expect(output.includes(null)).toBe(false);
      console.log('OP', output);
    });
  });

  describe('Extract', () => {
    it('Should work', () => {
      const output = transactionService.getConvertedUserIds(orders);
      console.log(output);
    });
  });

  describe('FFF', () => {
    it('Should work', async () => {
      const fulfilled = {
        '1': {
          p: '11',
          q: '11',
          s: 'buy',
        },
        '2': {
          p: '22',
          q: '22',
          s: 'sell',
        },
      };

      const partial = {
        '3': {
          p: '33',
          q: '33',
          s: 'temp',
        },
      };
      const output = await service.handleFulfilled('1', fulfilled, partial);
      console.log(output);
    });
  });

  describe('Convert', () => {
    it('Should work', () => {
      const uniqueId = '2';
      const output = transactionService.formatToTransaction(
        uniqueId,
        fulfilled,
        partial,
        [
          new Order(
            {
              orderId: BigInt(1),
              userId: BigInt(7),
            },
            {
              raw: true,
            },
          ),
          new Order(
            {
              orderId: BigInt(2),
              userId: BigInt(8),
            },
            {
              raw: true,
            },
          ),
          new Order(
            {
              orderId: BigInt(3),
              userId: BigInt(9),
            },
            {
              raw: true,
            },
          ),
        ],
        [
          new User(
            {
              id: '7',
              lockBookId: '5',
              mainBookId: '6',
            },
            {
              raw: true,
            },
          ),
          new User(
            {
              id: '9',
              lockBookId: '9',
              mainBookId: '10',
            },
            {
              raw: true,
            },
          ),
          new User(
            {
              id: '8',
              lockBookId: '7',
              mainBookId: '8',
            },
            {
              raw: true,
            },
          ),
        ],
      );
      console.log(output);
    });
  });

  describe('Cancelled', () => {
    it('Should call this', () => {
      const body = {
        cancelled: ['asdf'],
      };
      message.Body = JSON.stringify(body);
      service.msgHandler(message);
      expect(cancelSpy).toHaveBeenCalled();
    });
  });

  describe('Errors', () => {
    it('Should call this', () => {
      const body = {
        errors: ['asdf'],
      };
      message.Body = JSON.stringify(body);

      service.msgHandler(message);
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  describe('Fulfilled', () => {
    it('Should call this', () => {
      const body = {
        fulfilled: {
          11: {
            p: '81',
            q: '8',
            s: 'buy',
          },
          12: {
            p: '80',
            q: '4',
            s: 'buy',
          },
        },
        partial: {
          10: {
            p: '12',
            q: '80',
            s: 'sell',
          },
        },
      };
      message.Body = JSON.stringify(body);

      service.msgHandler(message);
      expect(fulfilledSpy).toHaveBeenCalled();
    });
  });
});
