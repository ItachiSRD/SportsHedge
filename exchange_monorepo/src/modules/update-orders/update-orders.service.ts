import { Message } from '@aws-sdk/client-sqs';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Op, Sequelize, Transaction, QueryTypes } from 'sequelize';
import { LedgerLogs } from 'src/entities/ledger_logs.entity';
import {
  INVESTMENTS_REPOSITORY,
  LEDGER_LOG_REPOSITORY,
  ORDER_REPOSITORY,
  ORDER_SIDE,
  ORDER_STATES,
  ORDER_TYPE,
  PLAYER_REPOSITORY,
  REWARDS_REPOSITORY,
  SEQUELIZE,
  TRADE_REPOSITORY,
  USER_REPOSITORY,
} from '../../core/constant';
import { Order } from '../../entities/orders.entity';
import { Trade } from '../../entities/trade.entity';
import { SQSConsumer } from '../../services/aws/sqs-consumer';
import { LedgerService } from '../../services/ledger/ledger.service';
import { User } from '../users/entity/users.entity';
import { Exchange, Filled, MEError, MEOrder, MEOutput, Match } from './types';
import { Fees } from '../../services/ledger/types';
import { Rewards } from '../rewards/entity/rewards.entity';
import { REDEEM_METHOD, REWARD_TYPES } from '../../core/constant/enums';
import { TransactionService } from './transactions.service';
import { Investments } from '../../entities/investments.entity';
import { BigNumber } from 'bignumber.js';
import { Player } from '../orders/entities/player.entity';

@Injectable()
export class UpdateOrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: typeof Order,
    @Inject(TRADE_REPOSITORY) private readonly tradeRepository: typeof Trade,
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    @Inject(LEDGER_LOG_REPOSITORY)
    private readonly ledgerLogRepository: typeof LedgerLogs,
    @Inject(REWARDS_REPOSITORY)
    private readonly rewardsRepository: typeof Rewards,
    @Inject(INVESTMENTS_REPOSITORY)
    private readonly investmentsRepository: typeof Investments,
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: typeof Player,
    private readonly configService: ConfigService,
    private readonly sqsConsumer: SQSConsumer,
    private readonly ledgerService: LedgerService,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
    private readonly transactionService: TransactionService,
  ) {
    sqsConsumer.start(this.configService.get('QUEUE_OUTPUT'), this.msgHandler);
  }

  msgHandler = async (message: Message) => {
    //  1. Get attributes from the Message
    const attributes = this.getMessageAttributes(message.MessageAttributes);

    //  2. Parse the input body
    let body: MEOutput;
    try {
      body = this.getMessageBody(message.Body);
    } catch (err) {
      console.error('Could not parse body', err);
    }

    //  TODO: Create a wrapper to divide all the ME output to proper precision
    //  Note: Do not put this in an if clause because Market Order that do not fulfil will also go through here
    await this.handleFulfilled(
      attributes.orderId,
      body.fulfilled,
      body.partial,
    );

    if (body.errors) {
      await this.handleErrors(attributes.orderId, body.errors);
    }
    if (body.created) {
      await this.handleCreated(body.created);
    }
    if (body.cancelled) {
      await this.handleCancelled(attributes.orderId, body.cancelled);
    }
  };

  handleErrors = async (orderId: string, errors: MEError) => {
    //  Cancel the Orders that have Errors
    await this.handleCancelled(orderId, errors);
  };

  getOrdersDetails = async (orderIds: bigint[]) => {
    //  TODO: All Order details might not be found. How to handle that case?
    try {
      return await this.orderRepository.findAll({
        where: {
          orderId: {
            [Op.in]: orderIds,
          },
        },
        raw: true,
      });
    } catch (err) {
      console.error('Error fetching Order Details', err);
      throw err;
    }
  };

  handleCreated = async (created: MEOrder) => {
    //  1. Convert given Ids to BigInt
    const orderIds = [];
    for (const orderId in created) {
      orderIds.push(BigInt(orderId));
    }

    //  2. Update status of Orders to OPEN
    await this.orderRepository.update(
      {
        status: ORDER_STATES.OPEN,
      },
      {
        where: {
          orderId: {
            [Op.in]: orderIds,
          },
        },
      },
    );
  };

  acquireLock = async (transaction: Transaction, lockKey: number) => {
    await this.sequelize.query('SELECT pg_advisory_xact_lock(:key);', {
      replacements: { key: lockKey },
      type: QueryTypes.SELECT,
      transaction,
    });
  };

  handleCancelled = async (orderId: string, cancelled: MEOrder | MEError) => {
    //  1. Get all converted Order IDs from the ME Output
    const allOrderIds = this.transactionService.getConvertedOrderIds(
      orderId,
      cancelled,
      null,
    );

    //  2. Get Details of all Orders
    const orderDetails = await this.getOrdersDetails(allOrderIds);

    //  3. Get all converted User IDs from list of Orders
    const allUserIds =
      this.transactionService.getConvertedUserIds(orderDetails);

    //  4. Get Details of all Users
    const userDetails = await this.userRepository.findAll({
      where: {
        id: {
          [Op.in]: allUserIds,
        },
      },
    });

    //  5. Convert data to Transaction
    const orders = this.transactionService.convertToTransaction(
      orderDetails,
      userDetails,
      cancelled,
    );

    //  6. For each Order, process the Order
    for (const order of orders) {
      const transaction = await this.sequelize.transaction();
      try {
        await this.acquireLock(transaction, parseInt(order.user.id));

        //  6.1. Refund remaining amount and asset
        const ledgerOutput = await this.ledgerService.unlockFunds(
          order.orderId,
          order.user.books,
          {
            amount: (
              order.order.totalAmount - order.order.priceFilled
            ).toString(),
            name: order.user.currency,
          },
          {
            amount: (order.order.size - order.order.quantityFilled).toString(),
            name: order.order.instrument,
          },
        );

        //  6.2. Create a Ledger Log
        await this.ledgerLogRepository.create({
          orderId: order.orderId,
          ledgerTransactionId: ledgerOutput.id,
          memo: ledgerOutput.memo,
          status: ledgerOutput.status,
          error: ledgerOutput.error || '',
          rejectionReason: ledgerOutput.rejectionReason,
          entries: JSON.stringify(ledgerOutput.entries),
        });

        //  6.3. Update Order Status
        const updatedData: any = {
          status:
            order.order.quantityFilled > 0
              ? ORDER_STATES.PARTIAL_CANCELLED
              : ORDER_STATES.CANCELLED,
        };

        // If there's an error message, append it to the metadata
        if (order.message && order.message.trim() !== '') {
          const sanitizedMessage = order.message.replace(/"/g, '\\"'); // escape double quotes

          //  TODO: Append error messages in the Future
          updatedData.metadata = `{"message": ${sanitizedMessage}}`;
          // Sequelize.literal(`
          // COALESCE(metadata, '{}'::jsonb) ||
          // jsonb_build_object('errors', COALESCE(metadata->'errors', '[]'::jsonb) || '["${sanitizedMessage}"]'::jsonb)`);
        }

        // Update the order
        await this.orderRepository.update(updatedData, {
          where: {
            orderId: order.orderId,
          },
        });

        await transaction.commit();
      } catch (err) {
        console.error(err);
        //  TODO: Rollback Ledger in case of failure
        await transaction.rollback();
      }
    }
  };

  handleFulfilled = async (
    orderId: string,
    fulfilled: MEOrder,
    partial: MEOrder,
  ) => {
    //  TODO: If an Order is already processed, don't process again
    //  1. Get all converted Order IDs from the ME Output
    const allOrderIds = this.transactionService.getConvertedOrderIds(
      orderId,
      fulfilled,
      partial,
    );

    //  2. Get Details of all Orders
    const orderDetails = await this.getOrdersDetails(allOrderIds);

    //  3. Get all converted User IDs from list of Orders
    const allUserIds =
      this.transactionService.getConvertedUserIds(orderDetails);

    //  4. Get Details of all Users
    const userDetails = await this.userRepository.findAll({
      where: {
        id: {
          [Op.in]: allUserIds,
        },
      },
    });

    //  5. Convert data to Transaction format
    const { allOrders, unique } = this.transactionService.formatToTransaction(
      orderId,
      fulfilled,
      partial,
      orderDetails,
      userDetails,
    );

    const output = await this.performTransaction(unique, allOrders);
    return output;
  };

  getBuyerAndSeller = (uniqueOrder: Match, currentOrder: Match) => {
    const buyer: Match =
      uniqueOrder.order.side === ORDER_SIDE.BUY ? uniqueOrder : currentOrder;

    const seller: Match =
      uniqueOrder.order.side === ORDER_SIDE.SELL ? uniqueOrder : currentOrder;

    return {
      buyer,
      seller,
    };
  };

  performTransaction = async (uniqueOrder: Match, allOrders: Match[]) => {
    //  Accumulator for Unique Order
    const uniqueFilled: Filled = {
      fees: 0,
      price: 0,
      quantity: 0,
    };

    //  Process all Orders one by one
    for (const currentOrder of allOrders) {
      //  Create a Transaction for this Trade
      const transaction = await this.sequelize.transaction();

      //  Calculate the Total Price and Quantity
      const totalQuantity = parseInt(currentOrder.q);
      const totalPrice: number = parseFloat(
        (parseFloat(currentOrder.p) * parseFloat(currentOrder.q)).toFixed(2),
      );
      let tradeOutput = null;
      let currentRefundAmount = 0;

      try {
        await this.acquireLock(transaction, parseInt(currentOrder.user.id));

        //  1. Check for Self Trade
        if (currentOrder.user.id === uniqueOrder.user.id) {
          //  Increment the amount fulfilled for both Orders
          //  Then, return the fees
          //  TODO: Write code for this
          await this.handleSelfTrade();
        }

        //  2. Get Buyer and Seller
        const { buyer, seller } = this.getBuyerAndSeller(
          uniqueOrder,
          currentOrder,
        );

        //  3. Exchange the Assets on Ledger
        tradeOutput = await this.tradeAssets(
          uniqueOrder,
          currentOrder,
          totalQuantity,
          totalPrice,
          transaction,
        );

        //  4. Create a Trade in Database
        await this.createTrade(
          buyer,
          seller,
          totalQuantity,
          parseFloat(currentOrder.p),
          transaction,
        );

        //  5. Update the Current Order filled Quantities and Status
        const currentFilled: Filled = {
          price: totalPrice,
          quantity: totalQuantity,
          fees: tradeOutput.currentOrderFees,
        };
        currentRefundAmount = await this.updateOrderStatus(
          currentOrder,
          currentFilled,
          transaction,
        )

        //  6. Refund the Order if required
        if (currentRefundAmount != 0) {
          await this.refundOrder(
            currentRefundAmount,
            currentOrder,
            transaction,
          )
        }

        //  7. Update Invested
        await this.updateInvested(currentOrder, currentFilled, transaction);

        //  8. Provide Rewards for Trade
        await this.redeemDepositReward(currentOrder, totalPrice, transaction);

        //  9. Update Accumulator Values
        uniqueFilled.fees += tradeOutput.uniqueOrderFees;
        uniqueFilled.price += totalPrice;
        uniqueFilled.quantity += totalQuantity;

        await transaction.commit();
      } catch (err) {
        console.error('Perform Transaction current');
        console.error(err);
        if (tradeOutput != null) {
          console.log('Reverting Trade');
          await this.undoTradeAssets(
            uniqueOrder,
            currentOrder,
            totalQuantity,
            totalPrice,
          );
        }

        if (currentRefundAmount != 0) {
          console.log('Locking Unlocked Funds');
          await this.undoRefundOrder(currentRefundAmount, currentOrder);
        }
        await transaction.rollback();
      }
    }

    //  10. Process the Unique Order
    const transaction = await this.sequelize.transaction();
    let uniqueRefundAmount = 0;
    try {
      await this.acquireLock(transaction, parseInt(uniqueOrder.user.id));

      uniqueRefundAmount = await this.updateOrderStatus(uniqueOrder, uniqueFilled, transaction);
      if (uniqueRefundAmount != 0) {
        await this.refundOrder(uniqueRefundAmount, uniqueOrder, transaction);
      }

      await this.updateInvested(uniqueOrder, uniqueFilled, transaction);

      await this.redeemDepositReward(
        uniqueOrder,
        uniqueFilled.price,
        transaction,
      );

      await transaction.commit();
    } catch (err) {
      console.error('Perform Transaction Unique');
      console.error(err);
      if (uniqueRefundAmount != 0) {
        await this.undoRefundOrder(uniqueRefundAmount, uniqueOrder);
      }
      await transaction.rollback();
    }

    //  11. Update Instrument LTP
    if (allOrders.length > 0)
      await this.updateLTP(allOrders);
    else
      await this.updateLTP([uniqueOrder]);
  };

  //  Finding the LTP by going through non-unique Orders
  updateLTP = async (allOrders: Match[]) => {
    const orderSide = allOrders[0].order.side;
    const playerId = allOrders[0].order.instrument;
    let ltp = Number(allOrders[0].p);

    //  1. Find the highest/Lowest Price for LTP
    for (let i = 1; i < allOrders.length; i++) {
      const tradePrice = Number(allOrders[i].p);

      //  1.1. For Buy orders, LTP will be the Lowest Traded Price
      if (orderSide === ORDER_SIDE.BUY && tradePrice < ltp) {
        ltp = tradePrice;
      }

      //  1.2. For Sell orders, LTP will be the highest Traded Price
      if (orderSide === ORDER_SIDE.SELL && tradePrice > ltp) {
        ltp = tradePrice;
      }
    }

    //  2. Update LTP for the Instrument
    await this.playerRepository.update(
      {
        ltp,
      },
      {
        where: {
          playerId,
        },
      },
    );
  };

  updateBuyerInvested = async (
    currentOrder: Match,
    filled: Filled,
    transaction: Transaction,
  ) => {
    //  1. Get current Invested
    const [investment] = await this.investmentsRepository.findOrCreate({
      where: {
        userId: currentOrder.user.id,
        instrument: currentOrder.order.instrument,
      },
      transaction,
    });

    //  2. Get Current Asset Balance for User
    const userBalance = await this.ledgerService.getBookBalances(
      currentOrder.user.id,
      [currentOrder.order.instrument],
    );
    let newBalance: number;
    if (userBalance)
      newBalance =
        (userBalance[currentOrder.order.instrument] || 0) + filled.quantity;
    else newBalance = filled.quantity;

    //  3. Calculate the new Total and Average Invested
    const updatedTotal = BigNumber(investment?.total || 0).plus(filled.price);
    let updatedAverage: string;
    if (newBalance > 0)
      updatedAverage = updatedTotal.dividedBy(newBalance).toString();
    else updatedAverage = investment?.average;

    //  4. Update Invested for User
    await this.investmentsRepository.update(
      {
        total: updatedTotal.toString(),
        average: updatedAverage,
      },
      {
        where: {
          userId: currentOrder.user.id,
          instrument: currentOrder.order.instrument,
        },
        transaction,
      },
    );
  };

  updateSellerInvested = async (
    currentOrder: Match,
    filled: Filled,
    transaction: Transaction,
  ) => {
    const [updatedCount] = await this.investmentsRepository.update(
      {
        total: Sequelize.literal(`total-(average * ${filled.quantity})`),
      },
      {
        where: {
          userId: currentOrder.user.id,
          instrument: currentOrder.order.instrument,
        },
        transaction,
      },
    );

    //  TODO: Not going to be used unless we have Short Sell
    //  When short sell starts, review code
    if (updatedCount === 0) {
      await this.investmentsRepository.create(
        {
          userId: currentOrder.user.id,
          instrument: currentOrder.order.instrument,
          total: `-${filled.quantity}`,
        },
        {
          transaction,
        },
      );
    }
  };

  updateInvested = async (
    currentOrder: Match,
    filled: Filled,
    transaction: Transaction,
  ) => {
    //  Update Invested for Seller
    if (currentOrder.order.side === ORDER_SIDE.SELL) {
      await this.updateSellerInvested(currentOrder, filled, transaction);
      return;
    }

    //  Update Invested for Buyer
    if (currentOrder.order.side === ORDER_SIDE.BUY) {
      await this.updateBuyerInvested(currentOrder, filled, transaction);
      return;
    }
  };

  redeemDepositReward = async (
    order: Match,
    tradeAmount: number,
    transaction: Transaction,
  ) => {
    //  1. Get deposit reward for User
    const reward = await this.rewardsRepository.findOne({
      where: {
        userId: order.user.id,
        isActive: true,
        redeemMethod: REDEEM_METHOD.PER_TRADE,
        type: REWARD_TYPES.DEPOSIT,
      },
      transaction,
      raw: true,
    });

    //  2. Validate redemption Capability
    if (!reward) return;
    if (reward.amount === reward.redeemedAmount) return;

    //  3. Calculate the redeemable amount
    let redeemable = parseFloat(
      ((reward.redeemPercent / 100) * tradeAmount).toFixed(2),
    );
    if (reward.redeemableAmount + redeemable > reward.amount) {
      redeemable = reward.amount - reward.redeemableAmount;
    }

    //  4. Transfer rewards to Wallet
    const ledgerOutput = await this.ledgerService.addRewards(order.user.books, {
      amount: redeemable.toString(),
      name: order.user.currency,
    });

    //  5. Create Ledger Log
    await this.ledgerLogRepository.create(
      {
        orderId: order.orderId,
        ledgerTransactionId: ledgerOutput.id,
        memo: ledgerOutput.memo,
        status: ledgerOutput.status,
        error: ledgerOutput.error || '',
        rejectionReason: ledgerOutput.rejectionReason,
        entries: JSON.stringify(ledgerOutput.entries),
      },
      { transaction },
    );

    //  6. Update status for reward
    await this.rewardsRepository.update(
      {
        redeemableAmount: Sequelize.literal(`redeemable_amount+${redeemable}`),
        redeemedAmount: Sequelize.literal(`redeemed_amount+${redeemable}`),
      },
      {
        where: {
          rewardId: reward.rewardId,
        },
        transaction,
      },
    );
  };

  updateOrderStatus = async (
    order: Match,
    filled: Filled,
    transaction: Transaction,
  ) => {
    //  TODO: Validate if amounts > existing in DB
    //  1. Calculate the new status and refund amount
    let newStatus: string;
    let refundAmount: number;

    //  1.1. For Market Orders
    if (order.order.type === ORDER_TYPE.MARKET) {
      if (filled.quantity === 0) newStatus = ORDER_STATES.CANCELLED;
      else if (filled.quantity === order.order.size)
        newStatus = ORDER_STATES.FULFILLED;
      else newStatus = ORDER_STATES.PARTIAL_CANCELLED;

      refundAmount = order.order.totalAmount - filled.price - filled.fees;
    }

    //  1.2. For Limit Orders
    else {
      if (order.isFulfilled) {
        newStatus = ORDER_STATES.FULFILLED;
        refundAmount =
          order.order.totalAmount -
          order.order.priceFilled -
          filled.price -
          filled.fees;
      } else if (filled.quantity > 0) {
        newStatus = ORDER_STATES.PARTIAL_FULFILLED;
        refundAmount = 0;
      } else {
        newStatus = ORDER_STATES.OPEN;
        refundAmount = 0;
      }
    }

    //  2. Update Order Status and quantity and price filled
    await this.orderRepository.update(
      {
        status: newStatus,
        quantityFilled: Sequelize.literal(`quantity_filled+${filled.quantity}`),
        feesFilled: Sequelize.literal(`fees_filled+${filled.fees}`),
        priceFilled: Sequelize.literal(
          `price_filled+${filled.price}+${filled.fees}`,
        ),
      },
      {
        where: {
          orderId: order.orderId,
        },
        returning: true,
        transaction,
      },
    );

    return refundAmount;
  };

  refundOrder = async (refundAmount: number, order: Match, transaction: Transaction) => {
    if (refundAmount <= 0)
      return;

    //  1. Unlock User Funds
    const ledgerOutput = await this.ledgerService.unlockFunds(
      order.orderId,
      order.user.books,
      {
        name: order.user.currency,
        amount: refundAmount.toString(),
      },
    );

    //  2. Log Ledger Transaction
    await this.ledgerLogRepository.create(
      {
        orderId: order.orderId,
        ledgerTransactionId: ledgerOutput.id,
        memo: ledgerOutput.memo,
        status: ledgerOutput.status,
        error: ledgerOutput.error || '',
        rejectionReason: ledgerOutput.rejectionReason,
        entries: JSON.stringify(ledgerOutput.entries),
      },
      { transaction },
    );
  }

  undoRefundOrder = async (refundAmount: number, order: Match) => {
    if (refundAmount <= 0)
      return;

    //  1. Unlock User Funds
    const ledgerOutput = await this.ledgerService.undoUnlockFunds(
      order.orderId,
      order.user.books,
      {
        name: order.user.currency,
        amount: refundAmount.toString(),
      },
    );

    //  2. Log Ledger Transaction
    await this.ledgerLogRepository.create(
      {
        orderId: order.orderId,
        ledgerTransactionId: ledgerOutput.id,
        memo: ledgerOutput.memo,
        status: ledgerOutput.status,
        error: ledgerOutput.error || '',
        rejectionReason: ledgerOutput.rejectionReason,
        entries: JSON.stringify(ledgerOutput.entries),
      },
    );
  }

  updateAndRefundOrder = async (
    order: Match,
    filled: Filled,
    transaction: Transaction,
  ) => {
    //  TODO: Validate if amounts > existing in DB
    //  1. Calculate the new status and refund amount
    let newStatus: string;
    let refundAmount: number;

    //  1.1. For Market Orders
    if (order.order.type === ORDER_TYPE.MARKET) {
      if (filled.quantity === 0) newStatus = ORDER_STATES.CANCELLED;
      else if (filled.quantity === order.order.size)
        newStatus = ORDER_STATES.FULFILLED;
      else newStatus = ORDER_STATES.PARTIAL_CANCELLED;

      refundAmount = order.order.totalAmount - filled.price - filled.fees;
    }

    //  1.2. For Limit Orders
    else {
      if (order.isFulfilled) {
        newStatus = ORDER_STATES.FULFILLED;
        refundAmount =
          order.order.totalAmount -
          order.order.priceFilled -
          filled.price -
          filled.fees;
      } else if (filled.quantity > 0) {
        newStatus = ORDER_STATES.PARTIAL_FULFILLED;
        refundAmount = 0;
      } else {
        newStatus = ORDER_STATES.OPEN;
        refundAmount = 0;
      }
    }

    //  2. Update Order Status and quantity and price filled
    await this.orderRepository.update(
      {
        status: newStatus,
        quantityFilled: Sequelize.literal(`quantity_filled+${filled.quantity}`),
        feesFilled: Sequelize.literal(`fees_filled+${filled.fees}`),
        priceFilled: Sequelize.literal(
          `price_filled+${filled.price}+${filled.fees}`,
        ),
      },
      {
        where: {
          orderId: order.orderId,
        },
        returning: true,
        transaction,
      },
    );

    //  3. If anything is to be refunded, refund it
    if (refundAmount > 0) {
      //  3.1. Unlock User Funds
      const ledgerOutput = await this.ledgerService.unlockFunds(
        order.orderId,
        order.user.books,
        {
          name: order.user.currency,
          amount: refundAmount.toString(),
        },
      );

      //  3.2. Log Ledger Transaction
      await this.ledgerLogRepository.create(
        {
          orderId: order.orderId,
          ledgerTransactionId: ledgerOutput.id,
          memo: ledgerOutput.memo,
          status: ledgerOutput.status,
          error: ledgerOutput.error || '',
          rejectionReason: ledgerOutput.rejectionReason,
          entries: JSON.stringify(ledgerOutput.entries),
        },
        { transaction },
      );
    }
  };

  handleSelfTrade = async () => { };

  undoTradeAssets = async (
    unique: Match,
    current: Match,
    quantity: number,
    price: number,
  ) => {
    //  1. Get Buyer and Seller
    const { buyer, seller } = this.getBuyerAndSeller(unique, current);

    //  2. Get the Asset and Currency Exchange Amounts
    const exchange: Exchange = {
      asset: current.order.instrument,
      quantity: quantity,
      price: price,
      currency: current.user.currency,
    };

    //  3. Get Fees for Buyer and Seller
    const buyerFees = parseFloat(
      ((buyer.order.feePercent / 100) * price).toFixed(2),
    );
    const sellerFees = parseFloat(
      ((seller.order.feePercent / 100) * price).toFixed(2),
    );

    const fees: Fees = {
      buyer: buyerFees.toString(),
      seller: sellerFees.toString(),
    };

    //  4. Trade the Assets on Ledger
    const ledgerOutput = await this.ledgerService.undoTrade(
      buyer.user.books,
      seller.user.books,
      exchange,
      fees,
      `UNDO-${buyer.order.orderId}-${seller.order.orderId}`,
    );

    //  5. Create Ledger Logs for both Orders
    await this.ledgerLogRepository.bulkCreate(
      [
        {
          orderId: buyer.orderId,
          ledgerTransactionId: ledgerOutput.id,
          memo: ledgerOutput.memo,
          status: ledgerOutput.status,
          error: ledgerOutput.error || '',
          rejectionReason: ledgerOutput.rejectionReason,
          entries: JSON.stringify(ledgerOutput.entries),
        },
        {
          orderId: seller.orderId,
          ledgerTransactionId: ledgerOutput.id,
          memo: ledgerOutput.memo,
          status: ledgerOutput.status,
          error: ledgerOutput.error || '',
          rejectionReason: ledgerOutput.rejectionReason,
          entries: JSON.stringify(ledgerOutput.entries),
        },
      ],
    );
  };

  tradeAssets = async (
    unique: Match,
    current: Match,
    quantity: number,
    price: number,
    transaction: Transaction,
  ) => {
    //  1. Get Buyer and Seller
    const { buyer, seller } = this.getBuyerAndSeller(unique, current);

    //  2. Get the Asset and Currency Exchange Amounts
    const exchange: Exchange = {
      asset: current.order.instrument,
      quantity: quantity,
      price: price,
      currency: current.user.currency,
    };

    //  3. Get Fees for Buyer and Seller
    const buyerFees = parseFloat(
      ((buyer.order.feePercent / 100) * price).toFixed(2),
    );
    const sellerFees = parseFloat(
      ((seller.order.feePercent / 100) * price).toFixed(2),
    );

    const fees: Fees = {
      buyer: buyerFees.toString(),
      seller: sellerFees.toString(),
    };

    //  4. Trade the Assets on Ledger
    const ledgerOutput = await this.ledgerService.makeTrade(
      buyer.user.books,
      seller.user.books,
      exchange,
      fees,
      `TRADE-${buyer.order.orderId}-${seller.order.orderId}`,
    );

    //  5. Create Ledger Logs for both Orders
    await this.ledgerLogRepository.bulkCreate(
      [
        {
          orderId: buyer.orderId,
          ledgerTransactionId: ledgerOutput.id,
          memo: ledgerOutput.memo,
          status: ledgerOutput.status,
          error: ledgerOutput.error || '',
          rejectionReason: ledgerOutput.rejectionReason,
          entries: JSON.stringify(ledgerOutput.entries),
        },
        {
          orderId: seller.orderId,
          ledgerTransactionId: ledgerOutput.id,
          memo: ledgerOutput.memo,
          status: ledgerOutput.status,
          error: ledgerOutput.error || '',
          rejectionReason: ledgerOutput.rejectionReason,
          entries: JSON.stringify(ledgerOutput.entries),
        },
      ],
      { transaction },
    );

    return {
      uniqueOrderFees: unique.orderId == buyer.orderId ? buyerFees : sellerFees,
      currentOrderFees:
        current.orderId == buyer.orderId ? buyerFees : sellerFees,
    };
  };

  createTrade = async (
    buyer: Match,
    seller: Match,
    quantity: number,
    price: number,
    transaction: Transaction,
  ) => {
    await this.tradeRepository.create(
      {
        buyerOrderId: BigInt(buyer.orderId),
        buyerId: buyer.user.id,
        sellerOrderId: BigInt(seller.orderId),
        sellerId: seller.user.id,
        instrument: buyer.order.instrument,
        price,
        quantity,
        status: 'DONE',
      },
      { transaction },
    );
  };

  getMessageAttributes = (attributes) => {
    return {
      orderId: attributes.orderId.StringValue,
    };
  };

  getMessageBody = (body) => {
    return JSON.parse(body);
  };

  stop = async () => {
    await this.sqsConsumer.stop();
  };
}
