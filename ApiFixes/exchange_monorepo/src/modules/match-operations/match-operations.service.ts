import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber } from 'bignumber.js';
import { Op, Sequelize } from 'sequelize';
import {
  ORDER_REPOSITORY,
  ORDER_SIDE,
  ORDER_STATES,
  ORDER_TYPE,
  PLAYER_REPOSITORY,
  TRADE_REPOSITORY,
  USER_REPOSITORY,
} from '../../core/constant';
import {
  POST_MATCH_SUCCESS,
  PRE_MATCH_SUCCESS,
} from '../../core/constant/messages';
import { Order } from '../../entities/orders.entity';
import { Trade } from '../../entities/trade.entity';
import { AwsService } from '../../services/aws/aws.service';
import { CreateOrderRequest } from '../orders/dto/createOrder.dto';
import { Player } from '../orders/entities/player.entity';
import { OrdersService } from '../orders/src/orders.service';
import { MatchInstrument, PostMatchData } from './match-operation.types';

@Injectable()
export class MatchOperationsService {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: typeof Player,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: typeof Order,
    @Inject(TRADE_REPOSITORY)
    private readonly tradeRepository: typeof Trade,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: typeof Trade,
    private readonly awsService: AwsService,
    private readonly configService: ConfigService,
    private readonly orderService: OrdersService,
  ) {}

  activateTrades = async (
    instruments: string[],
    isPlaying: boolean,
    updateMatchCount: boolean = false,
  ) => {
    return this.playerRepository.update(
      {
        canTrade: true,
        isPlaying,
        ...(updateMatchCount && {
          matchNumber: Sequelize.literal(`match_number + 1`),
        }),
      },
      {
        where: {
          playerId: {
            [Op.in]: instruments,
          },
        },
      },
    );
  };

  deactivateTrade = async (instruments: string[]) => {
    return this.playerRepository.update(
      {
        canTrade: false,
      },
      {
        where: {
          playerId: {
            [Op.in]: instruments,
          },
        },
      },
    );
  };

  postMatch = async (matchData: PostMatchData) => {
    //  1. Stop Trades for all Players
    const instrumentList = matchData.instruments.map(
      (instrument) => instrument.name,
    );
    await this.deactivateTrade(instrumentList);

    //  2. For each Instrument,
    for (const instrument of matchData.instruments) {
      //  2.1. Update Instrument Details
      await this.updateInstrument(instrument);

      //  2.2. Cancel all OPEN Orders
      await this.cancelOpenOrders(instrument.name);
      //  TODO: Ensure all Orders are Cancelled. If not, retry to Cancel those Orders

      //  2.3. Expire Expired Stocks
      await this.expirePlayerStocks(instrument);

      //  2.4. Place SH inventory
      await this.placeSHOrders(instrument);

      //  TODO: 2.5. Handle Short Selling
      //  TODO: 2.6. Update Closing Price of ETF
    }

    //  3. Activate Trades again
    await this.activateTrades(instrumentList, false);

    return POST_MATCH_SUCCESS;
  };

  expirePlayerStocks = async (instrument: MatchInstrument) => {
    const matchToExpire =
      instrument.match - parseInt(this.configService.get('EXPIRY_MATCHES'));

    //  1. If there aren't enough matches for Expiry, don't do anything
    if (matchToExpire < 0) return;

    //  2. Get Total of buy Orders on expiry Date
    const buys = await this.tradeRepository.findAll({
      attributes: [
        ['buyer_id', 'buyerId'],
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'quantity'],
      ],
      where: {
        instrument: instrument.name,
        matchNumber: matchToExpire,
      },
      group: ['buyer_id'],
      raw: true,
    });

    //  3. Get Total of Sell Orders from Expiry Date to Current Match Count
    const sells = await this.tradeRepository.findAll({
      attributes: [
        ['seller_id', 'sellerId'],
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'quantity'],
      ],
      where: {
        instrument: instrument.name,
        matchNumber: {
          [Op.gt]: matchToExpire,
          [Op.lt]: instrument.match,
        },
      },
      group: ['seller_id'],
      raw: true,
    });

    //  4. Convert sells to map very easy finding
    const sellMap = sells.reduce((map, sell) => {
      map[sell.sellerId] = sell.quantity;
      return map;
    }, {});

    //  5. For each buy of User, expire if required
    for (let i = 0; i < buys.length; i++) {
      const userSells = sellMap[buys[i].buyerId] || 0;
      const toExpire = buys[i].quantity - userSells;

      //  5.1. If nothing to Expire, skip
      if (toExpire <= 0) {
        continue;
      }

      //  5.2. Get Firebase ID for User and Sportshedge
      const user = await this.userRepository.findOne({
        where: {
          id: buys[i].buyerId,
        },
      });
      const firebaseIdUser = user.buyerId;
      const firebaseIdSH = this.configService.get('MARKET_MAKER_FIREBASE_ID');

      //  5.3. Create a Counter Order on behalf of SH to fulfil Expired - Limit Order
      const buyOrder: CreateOrderRequest = {
        instrument: instrument.name,
        type: ORDER_TYPE.LIMIT,
        price: Number(instrument.price),
        side: ORDER_SIDE.BUY,
        size: toExpire,
      };
      await this.orderService.createOrder(firebaseIdSH, buyOrder);

      //  5.4. Create a new Order on behalf of the User - Market Order
      const sellOrder: CreateOrderRequest = {
        instrument: instrument.name,
        type: ORDER_TYPE.MARKET,
        price: Number(instrument.price),
        side: ORDER_SIDE.SELL,
        size: toExpire,
      };
      await this.orderService.createOrder(firebaseIdUser, sellOrder);
    }
  };

  preMatch = async (instruments: MatchInstrument[]) => {
    //  1. Stop users from placing Orders
    const instrumentList = instruments.map((instrument) => instrument.name);
    await this.deactivateTrade(instrumentList);

    //  2. For each Instrument,
    for (let i = 0; i < instruments.length; i += 1) {
      //  2.1. Cancel all Open Orders
      await this.cancelOpenOrders(instruments[i].name);

      //  2.2. Place new Orders on Upper and Lower Circuit
      // await this.placeSHOrdersPreMatch(instruments[i]);
    }

    //  3. Allow Users to Place Orders
    await this.activateTrades(instrumentList, true, true);

    //  TODO: 3. Update ETF composition

    return PRE_MATCH_SUCCESS;
  };

  cancelOpenOrders = async (playerId: string) => {
    //  1. Get all Open Orders for the Player
    const openOrders = await this.orderRepository.findAll({
      where: {
        status: {
          [Op.or]: [ORDER_STATES.OPEN, ORDER_STATES.PARTIAL_FULFILLED],
        },
        instrument: playerId,
      },
      raw: true,
    });

    //  2. For each Order, send a Cancel Order to the ME
    //  TODO: Call Cancel Order from Service
    for (const order of openOrders) {
      await this.awsService.sendSQSMessage(
        this.configService.get('QUEUE_INPUT'),
        {
          type: 'limit',
          action: 'cancel',
          instrument: playerId,
          orderId: order.orderId,
        },
      );
    }
  };

  updateInstrument = async (instrument: MatchInstrument) => {
    const playerDetails = await this.playerRepository.update(
      {
        buyInventoryLimit: instrument.qty_buy.toString(),
        sellInventoryLimit: instrument.qty_sell.toString(),
        price: BigNumber(instrument.price).toNumber(),
        maxInventoryLimit: BigInt(instrument.mil),
        fantasyPoints: null,
      },
      {
        where: {
          playerId: instrument.name,
        },
        returning: true,
      },
    );

    return playerDetails[1][0].dataValues;
  };

  placeSHOrdersPreMatch = async (instrument: MatchInstrument) => {
    const firebaseId = this.configService.get('MARKET_MAKER_FIREBASE_ID');
    const circuit = BigNumber(instrument.price).multipliedBy(15).dividedBy(100);

    //  1. Place the Buy Order
    const buyOrder: CreateOrderRequest = {
      instrument: instrument.name,
      type: ORDER_TYPE.LIMIT,
      price: BigNumber(instrument.price).minus(circuit).toNumber(),
      side: ORDER_SIDE.BUY,
      size: instrument.qty_buy,
    };
    await this.orderService.createOrder(firebaseId, buyOrder);

    //  2. Place the Sell Order
    const sellOrder: CreateOrderRequest = {
      instrument: instrument.name,
      type: ORDER_TYPE.LIMIT,
      price: BigNumber(instrument.price).plus(circuit).toNumber(),
      side: ORDER_SIDE.SELL,
      size: instrument.qty_sell,
    };
    await this.orderService.createOrder(firebaseId, sellOrder);
  };

  placeSHOrders = async (instrument: MatchInstrument) => {
    const firebaseId = this.configService.get('MARKET_MAKER_FIREBASE_ID');

    // Applying temporary size of buy and sell to 1000 on
    // post match SH inventory orders
    // TODO: Change logic to evaluate from qty_buy and qty_sell
    const temp_size = 1000;

    //  1. Place the Buy Order
    const buyOrder: CreateOrderRequest = {
      instrument: instrument.name,
      type: ORDER_TYPE.LIMIT,
      price: BigNumber(instrument.price).minus(BigNumber(0.01)).toNumber(),
      side: ORDER_SIDE.BUY,
      size: temp_size,
    };
    await this.orderService.createOrder(firebaseId, buyOrder);

    //  2. Place the Sell Order
    const sellOrder: CreateOrderRequest = {
      instrument: instrument.name,
      type: ORDER_TYPE.LIMIT,
      price: BigNumber(instrument.price).toNumber(),
      side: ORDER_SIDE.SELL,
      size: temp_size,
    };
    await this.orderService.createOrder(firebaseId, sellOrder);
  };

  handleShortSell = async () => {
    //  TODO: Implement the functionality
    //  For short sell, notify user if they cross the 70% threshold
    //  Square of all Short inventory if price crosses 85%
  };
}
