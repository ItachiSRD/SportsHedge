import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryTypes, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  ERROR_CODES,
  ERROR_MSG,
  LEDGER_LOG_REPOSITORY,
  ORDER_REPOSITORY,
  ORDER_SIDE,
  ORDER_SORT_BY,
  ORDER_STATES,
  ORDER_STATE_MAP,
  ORDER_STATUS_MAP,
  ORDER_TYPE,
  PLAYER_REPOSITORY,
  SEQUELIZE,
  SH_BUSINESS_ID,
  USER_REPOSITORY,
} from '../../../core/constant';
import {
  BUY_GREATER_ASKS,
  CANNOT_TRADE_INSTRUMENT,
  INSTRUMENT_NOT_FOUND,
  INSUFFICIENT_BALANCE,
  INSUFFICIENT_INVENTORY,
  MAX_INVENTORY_BREACHED,
  ORDER_NOT_CANCELLABLE,
  ORDER_NOT_OWNED,
  PLAYER_NOT_PLAYING,
  PRICE_BELOW_CIRCUIT,
  PRICE_EXCEEDS_CIRCUIT,
  SELL_LOWER_BIDS,
  USER_INACTIVE,
  USER_NOT_FOUND,
} from '../../../core/constant/errors';
import { PaginationDto } from '../../../core/pagination';
import { LedgerLogs } from '../../../entities/ledger_logs.entity';
import { Order } from '../../../entities/orders.entity';
import { AwsService } from '../../../services/aws/aws.service';
import { LedgerService } from '../../../services/ledger/ledger.service';
import { User } from '../../users/entity/users.entity';
import { CreateOrderRequest } from '../dto/createOrder.dto';
import {
  GetOrder,
  GetUserOrder,
  GetUserOrderQuery,
  GetUserOrdersQueryParams,
  GetUserOrdersResponse,
} from '../dto/get-order.dto';
import { Player } from '../entities/player.entity';

@Injectable()
export class OrdersService {
  private MAX_ORDER_SIZE: number;
  private MAX_INVENTORY: number;

  constructor(
    @Inject(PLAYER_REPOSITORY) private readonly playerRepository: typeof Player,
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: typeof Order,
    @Inject(LEDGER_LOG_REPOSITORY)
    private readonly ledgerLogRepository: typeof LedgerLogs,
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    private readonly awsService: AwsService,
    private readonly configService: ConfigService,
    private readonly ledgerService: LedgerService,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
  ) {
    this.MAX_ORDER_SIZE = parseInt(
      this.configService.get('MAX_ORDER_SIZE'),
      10,
    );

    this.MAX_INVENTORY = parseInt(this.configService.get('MAX_INVENTORY'), 10);
    if (Number.isNaN(this.MAX_INVENTORY)) {
      this.MAX_INVENTORY = Number.MAX_SAFE_INTEGER;
    }
  }

  acquireLock = async (transaction: Transaction, lockKey: number) => {
    await this.sequelize.query('SELECT pg_advisory_xact_lock(:key);', {
      replacements: { key: lockKey },
      type: QueryTypes.SELECT,
      transaction,
    });
  };

  createOrder = async (firebaseId: string, input: CreateOrderRequest) => {
    //  1. Get User Details and check if they are active
    const user = await this.userRepository.findOne({ where: { firebaseId } });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    if (!user.isActive) {
      throw new BadRequestException(USER_INACTIVE);
    }

    //  2. Check if User allowed to trade the Instrument if not a market maker
    if (user.parent != SH_BUSINESS_ID) {
      await this.canCreateTrade(input);
    }

    let newOrder: Order;
    const transaction = await this.sequelize.transaction();
    try {
      await this.acquireLock(transaction, parseInt(user.id));

      //  3. Get User's currency balance and Instrument Balance
      const balances = await this.ledgerService.getBalances(user.mainBookId, [
        user.currency,
        input.instrument,
      ]);

      //  4. Is the User allowed to Hold more Inventory?
      if (
        user.parent != SH_BUSINESS_ID &&
        input.side == ORDER_SIDE.BUY &&
        balances[input.instrument] + input.size > this.MAX_INVENTORY
      ) {
        throw new BadRequestException(MAX_INVENTORY_BREACHED);
      }

      //  5. Does User have sufficient Inventory/Currency Balance
      const feePercent: number = this.getFeePercent(
        user,
        input.instrument,
        input.type,
      );

      const transactionFee = this.calculateTransactionFee(
        input.price,
        input.size,
        feePercent,
      );

      this.hasSufficientBalance(input, balances, user.currency, transactionFee);

      //  6. Create Order in the Database
      newOrder = await this.orderRepository.create(
        {
          userId: BigInt(user.id),
          feePercent: feePercent,
          transactionFee,
          price: input.price,
          size: input.size,
          side: input.side,
          type: input.type,
          instrument: input.instrument,
          totalAmount: this.calculateTotalPrice(
            input.price,
            input.size,
            transactionFee,
          ),
        },
        { transaction },
      );

      //  7. Lock User Balance
      const ledgerOutput = await this.lockUserBalance(
        user,
        newOrder,
        transactionFee,
        user.currency,
      );

      //  8. Log Ledger Transaction
      await this.ledgerLogRepository.create(
        {
          orderId: newOrder.orderId.toString(),
          ledgerTransactionId: ledgerOutput.operation.id,
          memo: ledgerOutput.operation.memo,
          status: ledgerOutput.operation.status,
          error: ledgerOutput.operation.error || '',
          rejectionReason: ledgerOutput.operation.rejectionReason,
          entries: JSON.stringify(ledgerOutput.operation.entries),
        },
        { transaction },
      );

      //  TODO: Fix this code sooner
      if (input.side === ORDER_SIDE.BUY && input.type === ORDER_TYPE.MARKET) {
        input.size = input.price * input.size * 100;
      } else {
        //  Note: Multiplying by 2 digit Precision
        input.price *= 100;
      }

      //  9. Send Order to Matching Engine
      await this.awsService.sendSQSMessage(
        this.configService.get('QUEUE_INPUT'),
        {
          type: input.type,
          action: 'create',
          orderId: newOrder.orderId.toString(),
          ...input,
        },
      );

      await transaction.commit();
    } catch (err) {
      //  TODO: Rollback Ledger on Failure
      await transaction.rollback();
      throw err;
    }

    return {
      orderId: newOrder.orderId,
    };
  };

  //  Validate if the Trade for the Instrument is possible
  canCreateTrade = async (input: CreateOrderRequest) => {
    //  1. Check if Order Size is in Limit
    if (input.size > this.MAX_ORDER_SIZE) {
      throw new BadRequestException(
        `Order size cannot exceed ${this.MAX_ORDER_SIZE}`,
      );
    }

    //  2. Get Instrument Details
    const instrument = await this.playerRepository.findOne({
      where: {
        playerId: input.instrument,
      },
    });

    //  3. Check if Instrument exists and is in Tradable State
    if (!instrument) throw new BadRequestException(INSTRUMENT_NOT_FOUND);
    if (!instrument.canTrade)
      throw new BadRequestException(CANNOT_TRADE_INSTRUMENT);

    //  4. If Market Orders, Trade is allowed
    if (input.type === ORDER_TYPE.MARKET) {
      return true;
    }

    //  5. Check Trade conditions for Limit Order
    //  TODO: Create a separate function
    //  5.1. Player should be in a Match
    if (!instrument.isPlaying)
      throw new BadRequestException(PLAYER_NOT_PLAYING);

    //  5.2. Price should be within Upper and Lower Circuit
    const circuit = parseFloat(((15 / 100) * instrument.price).toFixed(2));
    if (input.price > instrument.price + circuit) {
      throw new BadRequestException(
        PRICE_EXCEEDS_CIRCUIT + ' of ' + (instrument.price + circuit),
      );
    }
    if (input.price < instrument.price - circuit) {
      throw new BadRequestException(
        PRICE_BELOW_CIRCUIT + ' of ' + (instrument.price - circuit),
      );
    }

    //  5.3. Opposite side price should not worse than best price in Orderbook
    //  TODO: Do the precision calculation somewhere else
    const bestAskPrice =
      instrument.topPrices.asks[0]?.p / 100 || Number.MAX_SAFE_INTEGER;
    if (input.side === 'buy' && input.price >= bestAskPrice) {
      throw new BadRequestException(BUY_GREATER_ASKS);
    }

    const bestBidPrice = instrument.topPrices.bids[0]?.p / 100 || 0;
    if (input.side === 'sell' && input.price <= bestBidPrice) {
      throw new BadRequestException(SELL_LOWER_BIDS);
    }

    return true;
  };

  calculateTransactionFee = (
    amount: number,
    quantity: number,
    feePercent: number,
  ) => {
    return parseFloat(((feePercent / 100) * amount * quantity).toFixed(2));
  };

  lockUserBalance = async (
    user: User,
    order: Order,
    transactionFee: number,
    currency: string,
  ) => {
    const userBooks = {
      mainBookId: user.mainBookId,
      lockBookId: user.lockBookId,
    };

    //  If User is Buying, lock their Currency
    if (order.side == ORDER_SIDE.BUY) {
      const instrument = {
        name: user.currency,
        amount: this.calculateTotalPrice(
          order.price,
          order.size,
          transactionFee,
        ).toString(),
      };

      return await this.ledgerService.lockFunds(
        userBooks,
        instrument,
        order.orderId.toString(),
      );
    }

    //  If User is Selling, lock their Inventory & Transaction Fee
    return await this.ledgerService.lockFunds(
      userBooks,
      {
        name: order.instrument,
        amount: order.size.toString(),
      },
      order.orderId.toString(),
      {
        name: currency,
        amount: transactionFee.toString(),
      },
    );
  };

  calculateTotalPrice = (
    price: number,
    qty: number,
    transactionFee?: number,
  ) => {
    return parseFloat((price * qty + transactionFee || 0).toFixed(2));
  };

  hasSufficientBalance = (
    input: CreateOrderRequest,
    balance: any,
    currency: string,
    transactionFee: number,
  ) => {
    //  If Buying, should have sufficient Currency Balance
    if (input.side === ORDER_SIDE.BUY) {
      const totalPrice = this.calculateTotalPrice(
        input.price,
        input.size,
        transactionFee,
      );

      if (balance[currency] < totalPrice)
        throw new BadRequestException(INSUFFICIENT_BALANCE);

      return;
    }

    //  If Selling, should have sufficient Inventory & Currency Balance
    if (balance[input.instrument] < input.size) {
      throw new BadRequestException(INSUFFICIENT_INVENTORY);
    }
    if (balance[currency] < transactionFee)
      throw new BadRequestException(INSUFFICIENT_BALANCE);
  };

  //  Get the Transaction fee for an the Instrument based on Order type
  getFeePercent = (user: User, instrument: string, type: string) => {
    let fees: string;

    //  If User is a MM for Sportshedge, no fees
    if (user.parent === SH_BUSINESS_ID) {
      return 0;
    }

    if (instrument.indexOf('ETF') === 0) {
      fees = this.configService.get('TRANSACTION_FEE_ETF');
      return parseFloat(fees);
    }

    if (type === 'limit') {
      fees = this.configService.get('TRANSACTION_FEE_LIMIT');
      return parseFloat(fees);
    }

    if (type === 'market') {
      fees = this.configService.get('TRANSACTION_FEE_MARKET');
      return parseFloat(fees);
    }

    fees = this.configService.get('TRANSACTION_FEE_LIMIT');
    return parseFloat(fees);
  };

  cancelOrder = async (firebaseId: string, orderId: string) => {
    //  1. Get User Details
    const user = await this.userRepository.findOne({ where: { firebaseId } });
    if (!user) {
      throw new NotFoundException({
        message: ERROR_MSG.USER_NOT_FOUND,
        error_code: ERROR_CODES.NOT_FOUND,
      });
    }

    //  2. Get Order Details
    const orderDetails = await this.orderRepository.findOne({
      where: {
        orderId,
      },
    });
    if (!orderDetails) {
      throw new NotFoundException({
        message: ERROR_MSG.ORDER_NOT_FOUND,
        error_code: ERROR_CODES.NOT_FOUND,
      });
    }

    //  3. Does Order belong to User?
    if (orderDetails.userId != BigInt(user.id)) {
      throw new BadRequestException(ORDER_NOT_OWNED);
    }

    //  4. Is it a Limit Order?
    if (orderDetails.type != 'limit') {
      throw new BadRequestException(ORDER_NOT_CANCELLABLE);
    }

    //  5. Only OPEN, INIT, PARTIAL_FULFILLED orders can be cancelled
    if (
      ![
        ORDER_STATES.OPEN.toString(),
        ORDER_STATES.INIT.toString(),
        ORDER_STATES.PARTIAL_CANCELLED.toString(),
      ].includes(orderDetails.status)
    ) {
      throw new BadRequestException(ORDER_NOT_CANCELLABLE);
    }

    //  6. Place the Order in SQS Queue
    await this.awsService.sendSQSMessage(
      this.configService.get('QUEUE_INPUT'),
      {
        type: 'limit',
        action: 'cancel',
        instrument: orderDetails.instrument,
        orderId,
      },
    );

    return {
      msg: 'Order Placed for Cancel',
    };
  };

  getUserId = async (firebaseId: string): Promise<bigint> => {
    const user = await this.userRepository.findOne({ where: { firebaseId } });
    if (!user) {
      throw new NotFoundException({
        message: ERROR_MSG.USER_NOT_FOUND,
        error_code: ERROR_CODES.NOT_FOUND,
      });
    }

    return BigInt(user.id);
  };

  getUserOrderDetails = async (
    firebaseId: string,
    orderId: bigint,
  ): Promise<GetOrder> => {
    const userId = await this.getUserId(firebaseId);

    const userOrder = await this.orderRepository.findOne({
      where: { orderId, userId },
    });

    if (!userOrder) {
      throw new NotFoundException({
        message: ERROR_MSG.ORDER_NOT_FOUND,
        error_code: ERROR_CODES.NOT_FOUND,
      });
    }

    return userOrder;
  };

  getUserOrders = async (
    firebaseId: string,
    pagination: PaginationDto,
    queryParams: GetUserOrdersQueryParams,
  ): Promise<GetUserOrdersResponse> => {
    const userId = await this.getUserId(firebaseId);

    const { filterBy, sortBy } = queryParams;

    let sortOrder = '';
    switch (sortBy) {
      case ORDER_SORT_BY.NAME:
        sortOrder = `p.name ASC`;
        break;
      case ORDER_SORT_BY.SIDE:
        sortOrder = `o.side ASC`;
        break;
      case ORDER_SORT_BY.QUANTITY:
        sortOrder = `o.size DESC`;
        break;
      case ORDER_SORT_BY.TIME:
        sortOrder = '';
        break;
      case ORDER_SORT_BY.STATUS:
      default:
        sortOrder = `
          CASE
            WHEN o.status IN ${ORDER_STATE_MAP.OPEN} THEN 1
            WHEN o.status IN ${ORDER_STATE_MAP.EXECUTED} THEN 2
            WHEN o.status IN ${ORDER_STATE_MAP.CANCELLED} THEN 3
            WHEN o.status IN ${ORDER_STATE_MAP.REJECTED} THEN 4
          END
        `;
        break;
    }

    const playersFilter = filterBy
      ? `
        AND p.name ILIKE '%${filterBy.trim()}%'
      `
      : '';

    const query = `
        SELECT 
        o.order_id,
        o."type",
        o.instrument,
        o."size",
        o.price,
        CASE
          WHEN o.status IN ${ORDER_STATE_MAP.OPEN} 
          THEN '${ORDER_STATUS_MAP.OPEN}'
          WHEN o.status IN ${ORDER_STATE_MAP.EXECUTED} 
          THEN '${ORDER_STATUS_MAP.EXECUTED}'
          WHEN o.status IN ${ORDER_STATE_MAP.CANCELLED} 
          THEN '${ORDER_STATUS_MAP.CANCELLED}'
          WHEN o.status IN ${ORDER_STATE_MAP.REJECTED} 
          THEN '${ORDER_STATUS_MAP.REJECTED}'
        END AS status,
        o.created_at,
        o.side,
        o.quantity_filled,
        o.metadata
      FROM orders AS o
      ${
        playersFilter || sortBy === ORDER_SORT_BY.NAME
          ? 'LEFT JOIN players AS p ON o.instrument = p.player_id'
          : ''
      }
      WHERE o.user_id = :userId
      ${playersFilter}
      ORDER BY
        ${sortOrder ? sortOrder + ',' : ''}
        o.created_at DESC
      LIMIT :limit
      OFFSET :offset;
    `;

    const userOrders: GetUserOrderQuery[] = await this.sequelize.query(query, {
      replacements: {
        userId,
        limit: pagination.limit,
        offset: pagination.offset,
      },
      type: QueryTypes.SELECT,
      raw: true,
    });

    const orders: GetUserOrder[] = userOrders.map((order) => {
      let errorReason: string = '';
      if (order.metadata?.errors) {
        errorReason = order.metadata.errors.join(', ');
      }

      return {
        orderId: Number(order.order_id),
        type: order.type,
        instrument: order.instrument,
        size: order.size,
        price: Number(order.price),
        status: order.status,
        date: new Date(order.created_at),
        side: order.side,
        quantityFilled: order.quantity_filled,
        errorReason,
      };
    });

    return {
      userId: Number(userId),
      pageNo: pagination.pageNo,
      pageSize: orders.length,
      orders,
    };
  };
}
