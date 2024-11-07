import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { AwsService } from '../../../services/aws/aws.service';
import { ConfigModule } from '@nestjs/config';
import { PLAYER_REPOSITORY, ORDER_REPOSITORY } from '../../../core/constant';
import { PLAYER_NOT_PLAYING } from '../../../core/constant/errors';

describe('OrdersService', () => {
  let service: OrdersService;
  let aws: AwsService;

  let limitOrderSpy: jest.SpyInstance;
  let marketOrderSpy: jest.SpyInstance;
  let sendSQSSpy: jest.SpyInstance;

  beforeEach(async () => {
    const testConfig = () => ({
      QUEUE_INPUT: 'http://localhost:4566/000000000000/input',
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [testConfig],
        }),
      ],
      providers: [
        OrdersService,
        AwsService,
        {
          provide: PLAYER_REPOSITORY,
          useValue: {
            findOne: (data) => {
              if (data.where.instrument === 'ROHIT_SHARMA')
                return {
                  isPlaying: true,
                };
              else
                return {
                  isPlaying: false,
                };
            },
          },
        },
        {
          provide: ORDER_REPOSITORY,
          useValue: {
            create: () => {
              const orderId = (Math.random() + 1).toString(36).substring(7);
              return {
                orderId,
              };
            },
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    aws = module.get<AwsService>(AwsService);

    limitOrderSpy = jest.spyOn(service, 'createLimitOrder');
    marketOrderSpy = jest.spyOn(service, 'createMarketOrder');
    sendSQSSpy = jest.spyOn(aws, 'sendSQSMessage');
  });

  afterEach(() => {
    limitOrderSpy.mockRestore();
    marketOrderSpy.mockRestore();
    sendSQSSpy.mockRestore();
  });

  describe('Create Order', () => {
    it('Should exist', () => {
      expect(service.createOrder).toBeDefined();
    });

    it('Should call limit', () => {
      service.createOrder({
        type: 'limit',
      });

      expect(limitOrderSpy).toHaveBeenCalled();
    });

    it('Should call market', () => {
      service.createOrder({
        type: 'market',
      });

      expect(marketOrderSpy).toHaveBeenCalled();
    });
  });

  describe('Limit Order', () => {
    it('Should exist', () => {
      expect(service.createLimitOrder).toBeDefined();
    });

    it('Player not playing', async () => {
      try {
        await service.createLimitOrder({
          instrument: 'VIRAT_KOHLI',
          side: 'buy',
          size: 5,
          price: 100,
        });

        expect(true).toBe(false);
      } catch (err) {
        expect(err.message).toBe(PLAYER_NOT_PLAYING);
      }

      expect(sendSQSSpy).not.toHaveBeenCalled();
    });

    it('Send message to SQS Queue', async () => {
      await service.createLimitOrder({
        instrument: 'ROHIT_SHARMA',
        side: 'buy',
        size: 5,
        price: 100,
      });

      expect(sendSQSSpy).toHaveBeenCalled();
    });
  });

  describe('Market Order', () => {
    it('Should exist', () => {
      expect(service.createMarketOrder).toBeDefined();
    });
  });
});
