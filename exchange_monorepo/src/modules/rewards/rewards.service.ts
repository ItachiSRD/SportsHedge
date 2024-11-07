import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Op,
  QueryTypes,
  Sequelize,
  Transaction,
  and,
  literal,
} from 'sequelize';
import {
  ERROR_CODES,
  ERROR_MSG,
  LEDGER_LOG_REPOSITORY,
  REWARDS_REPOSITORY,
  REWARD_LOGS_REPOSITORY,
  SEQUELIZE,
  USER_REPOSITORY,
} from '../../core/constant';
import {
  REDEEM_METHOD,
  REWARD_ACTION,
  REWARD_TYPES,
} from '../../core/constant/enums';
import { LedgerLogs } from '../../entities/ledger_logs.entity';
import { LedgerService } from '../../services/ledger/ledger.service';
import { User } from '../users/entity/users.entity';
import { UserRewardsResponse } from './dto/rewards.dto';
import { RewardLogs } from './entity/reward-logs.entity';
import { Rewards } from './entity/rewards.entity';

@Injectable()
export class RewardsService {
  private VIRTUAL_CURRENCY_ALLOWED: boolean;
  private VIRTUAL_CURRENCY_DEPOSIT_BONUS: number;
  private depositRedeemPercent = 0.42;
  private depositAmountPercent = 25;
  private referralRedeemPercent = 100;
  private referralAmountPercent = 10;

  constructor(
    private readonly configService: ConfigService,
    @Inject(REWARDS_REPOSITORY)
    private readonly rewardsRepository: typeof Rewards,
    @Inject(REWARD_LOGS_REPOSITORY)
    private readonly rewardLogsRepository: typeof RewardLogs,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: typeof User,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
    private readonly ledgerService: LedgerService,
    @Inject(LEDGER_LOG_REPOSITORY)
    private readonly ledgerLogRepository: typeof LedgerLogs,
  ) {
    this.VIRTUAL_CURRENCY_ALLOWED = this.configService.get<boolean>(
      'VIRTUAL_CURRENCY_ALLOWED',
    );
    this.VIRTUAL_CURRENCY_DEPOSIT_BONUS = parseInt(
      this.configService.get('VIRTUAL_CURRENCY_DEPOSIT_BONUS'),
      10,
    );
  }

  private getMonthDate(monthJump = 0): Date {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const futureMonth = (currentMonth + monthJump) % 12;
    const futureYear =
      currentYear + Math.floor((currentMonth + monthJump) / 12);

    return new Date(futureYear, futureMonth, 1, 0, 0, 0, 0);
  }

  private async createRewardLogs(
    rewardId: string,
    userId: string,
    type: REWARD_TYPES,
    amount: number,
    action: REWARD_ACTION,
  ) {
    let description: string;
    const bonus = REWARD_TYPES.DEPOSIT ? 'Cash' : 'Referral';
    switch (action) {
      case REWARD_ACTION.CREDITED:
        description = `${bonus} Bonus Credited`;
        break;

      case REWARD_ACTION.DEPOSITED:
        description = 'Transferred to Wallet';
        break;

      case REWARD_ACTION.LAPSED:
        description = `Lapsed from ${bonus} Bonus`;
        break;

      default:
        break;
    }

    await this.rewardLogsRepository.create({
      rewardId,
      userId,
      type,
      amount,
      action,
      description,
      createdAt: new Date().toISOString(),
    });
  }

  private async getExistingReward(userId: string, type: REWARD_TYPES) {
    return await this.rewardsRepository.findOne({
      where: and(
        {
          userId,
          type,
          redeemMethod: REDEEM_METHOD.PER_TRADE,
          isActive: true,
        },
        literal('amount >= redeemable_amount'),
      ),
    });
  }

  private async getRegisteredUser(userId: string): Promise<User> {
    const user = await this.userRepository.findByPk(userId);

    if (!user) {
      throw new NotFoundException({
        message: ERROR_MSG.USER_NOT_FOUND,
        error_code: ERROR_CODES.NOT_FOUND,
      });
    }

    if (!user.mainBookId || !user.lockBookId) {
      throw new NotFoundException({
        message: ERROR_MSG.USER_BOOKS_NOT_FOUND,
        error_code: ERROR_CODES.NOT_FOUND,
      });
    }

    return user;
  }

  async addDepositBonus(userId: string, depositAmount: number) {
    // Get registered user
    await this.getRegisteredUser(userId);

    const rewardsAmount = (depositAmount * this.depositAmountPercent) / 100;

    const existingReward = await this.getExistingReward(
      userId,
      REWARD_TYPES.DEPOSIT,
    );

    let reward: Rewards;
    if (existingReward) {
      existingReward.amount += rewardsAmount;
      reward = await existingReward.save();
    } else {
      reward = await this.rewardsRepository.create({
        type: REWARD_TYPES.DEPOSIT,
        amount: rewardsAmount,
        userId,
        expiry: this.getMonthDate(1),
        redeemableAmount: 0,
        redeemedAmount: 0,
        redeemStart: new Date(),
        redeemMethod: REDEEM_METHOD.PER_TRADE,
        redeemPercent: this.depositRedeemPercent,
      });
    }

    await this.createRewardLogs(
      reward.rewardId,
      userId,
      REWARD_TYPES.DEPOSIT,
      rewardsAmount,
      REWARD_ACTION.DEPOSITED,
    );
  }

  createUserDeposit = async (
    user: User,
    depositAmount: number,
    transaction: Transaction,
  ) => {
    //  1. Deposit User Funds
    const currency = 'INR';
    const ledgerOutput = await this.ledgerService.depositFunds(
      {
        mainBookId: user.mainBookId,
        lockBookId: user.lockBookId,
      },
      {
        name: currency,
        amount: depositAmount.toString(),
      },
    );

    //  2. Create the Ledger Log for the Deposit
    await this.ledgerLogRepository.create(
      {
        orderId: ledgerOutput.id,
        ledgerTransactionId: ledgerOutput.id,
        memo: ledgerOutput.memo,
        status: ledgerOutput.status,
        error: ledgerOutput.error || '',
        rejectionReason: ledgerOutput.rejectionReason,
        entries: JSON.stringify(ledgerOutput.entries),
      },
      { transaction },
    );

    return ledgerOutput.userDeposit;
  };

  addDepositReward = async (
    user: User,
    depositAmount: number,
    transaction: Transaction,
  ) => {
    //  1. Get existing Deposit Rewards for User if exists
    let userReward = await this.rewardsRepository.findOne({
      where: and({
        userId: user.id,
        type: REWARD_TYPES.DEPOSIT,
        isActive: true,
      }),
      transaction,
    });

    //  TODO: Get the reward percent from Config
    const rewardAmount = (25 / 100) * depositAmount;
    //  If no reward found, create a new Reward
    if (!userReward) {
      userReward = await this.rewardsRepository.create(
        {
          type: REWARD_TYPES.DEPOSIT,
          amount: rewardAmount,
          userId: user.id,
          redeemableAmount: rewardAmount,
          redeemedAmount: 0,
          redeemStart: new Date(),
          redeemMethod: REDEEM_METHOD.PER_TRADE,
          redeemPercent: this.depositRedeemPercent,
        },
        { transaction },
      );
    } else {
      //  If existing Reward, add the new amount,
      await userReward.increment('redeemableAmount', {
        by: rewardAmount,
        transaction,
      });
    }

    //  2. Create a Reward Log for the Deposit
    await this.rewardLogsRepository.create(
      {
        rewardId: userReward.rewardId,
        userId: user.id,
        type: REWARD_TYPES.DEPOSIT,
        amount: rewardAmount,
        action: REWARD_ACTION.DEPOSITED,
        description: 'Deposit bonus rewarded',
      },
      { transaction },
    );

    return rewardAmount;
  };

  async provideJoiningBonus(user: User, transaction: Transaction) {
    //  1. If Joining bonus providing is disabled, ignore
    if (!this.VIRTUAL_CURRENCY_ALLOWED) {
      return true;
    }

    let deposit: number, reward: number;
    try {
      const joiningBonus = this.VIRTUAL_CURRENCY_DEPOSIT_BONUS;

      //  2. Deposit amount to User's Ledger
      deposit = await this.createUserDeposit(user, joiningBonus, transaction);

      //  3. Add Rewards to User's Account
      reward = await this.addDepositReward(user, joiningBonus, transaction);
    } catch (err) {
      //  TODO: Undo User Deposit if creating Reward fails
      console.log('Cannot provide joining bonus', err);
      throw err;
    }

    return {
      deposit,
      reward,
    };
  }

  async updateDepositBonus(userId: string, tradeAmount: number) {
    // 1. Get registered user
    const user = await this.getRegisteredUser(userId);

    // 2. Get reward
    const reward = await this.getExistingReward(userId, REWARD_TYPES.DEPOSIT);

    if (!reward) {
      console.log('No rewards found!');
      return;
    }

    // 3. Calculate amount to redeem
    let amountToRedeem = (reward.redeemPercent * tradeAmount) / 100;

    // 4. Check for maximum redeemable amount
    // If exceeds available amount, then set max to available
    const availableAmount = reward.amount - reward.redeemableAmount;
    if (amountToRedeem > availableAmount) {
      amountToRedeem = availableAmount;
    }

    // 5. Update reward
    reward.redeemableAmount += amountToRedeem;
    reward.redeemedAmount = reward.redeemableAmount;

    // 6. Save updated reward and create it's log
    await Promise.all([
      reward.save(),
      this.createRewardLogs(
        reward.rewardId,
        userId,
        REWARD_TYPES.DEPOSIT,
        amountToRedeem,
        REWARD_ACTION.CREDITED,
      ),
    ]);

    // Transfer to Main book
    const instrument = 'INR';
    const res = await this.ledgerService.transferRewards(
      user.mainBookId,
      instrument,
      amountToRedeem,
    );
    console.log(res);
  }

  async addJoiningBonusReward(userId: string, userMainBookId: string) {
    if (!this.VIRTUAL_CURRENCY_ALLOWED) {
      return;
    }

    const joiningBonus = this.VIRTUAL_CURRENCY_DEPOSIT_BONUS;
    const instrument = 'INR';

    await this.addDepositBonus(userId, joiningBonus);
    const res = await this.ledgerService.transferRewards(
      userMainBookId,
      instrument,
      joiningBonus,
    );
    console.log(res);
  }

  private async getRefereeTotalFeesQuery(userId: string): Promise<number> {
    const query = `
      SELECT COALESCE(SUM(t."totalFees"), 0) AS total_fees
      FROM trade t
      WHERE EXISTS (
        SELECT 1
        FROM users u
        WHERE u.referrer = :userId
        AND (t.maker_id = u.id OR t.taker_id = u.id)
      );
    `;
    const [totalFeesQuery]: { total_fees: number }[] =
      await this.sequelize.query(query, {
        replacements: { userId },
        type: QueryTypes.SELECT,
      });

    return Number(totalFeesQuery?.total_fees) ?? 0;
  }

  async expireAndRenewReferralReward(userId: string) {
    // 1. Get registered user
    const user = await this.getRegisteredUser(userId);

    const totalTransactionFee = await this.getRefereeTotalFeesQuery(userId);

    const referralAmount =
      (totalTransactionFee * this.referralAmountPercent) / 100;

    const existingReward = await this.getExistingReward(
      userId,
      REWARD_TYPES.REFERRAL,
    );

    // If referral wallet hasn't expired yet
    const today = new Date();
    if (existingReward?.expiry > today) {
      return `Referral bonus reward will expire on ${existingReward.expiry.toDateString()}`;
    }

    // Check for existing reward
    // Send amount to user's wallet
    // Expire previous referral reward
    if (existingReward?.amount) {
      // TODO: add redeem referral bonus logic if not redeemed
      // TODO: Lapse the existing amount if not redeemed

      // Transfer to Main book
      const instrument = 'INR';
      const res = await this.ledgerService.transferRewards(
        user.mainBookId,
        instrument,
        existingReward.amount,
      );
      console.log(res);

      // Expire existing reward
      existingReward.isActive = false;
      await existingReward.save();

      // create reward log
      await this.createRewardLogs(
        existingReward.rewardId,
        userId,
        REWARD_TYPES.REFERRAL,
        existingReward.amount,
        REWARD_ACTION.CREDITED,
      );
    }

    // Create new referral reward
    const newReferralReward = await this.rewardsRepository.create({
      type: REWARD_TYPES.REFERRAL,
      amount: referralAmount,
      userId,
      expiry: this.getMonthDate(2),
      redeemableAmount: 0,
      redeemedAmount: 0,
      redeemStart: this.getMonthDate(1),
      redeemMethod: REDEEM_METHOD.PER_TRADE,
      redeemPercent: this.referralRedeemPercent,
    });

    // Create new referral reward log
    await this.createRewardLogs(
      newReferralReward.rewardId,
      userId,
      REWARD_TYPES.REFERRAL,
      newReferralReward.amount,
      REWARD_ACTION.DEPOSITED,
    );

    return `New referral bonus reward deposited into your wallet! Will be active between ${newReferralReward.redeemStart.toDateString()} to ${newReferralReward.expiry.toDateString()}`;
  }

  private getPreviousMonthStart(uptoMonth: number) {
    const currentDate = new Date();

    // uptoMonth = 0; returns start of current month
    // uptoMonth = 1; returns start of previous 1 month
    const startOfPreviousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - uptoMonth,
      1,
    );

    return startOfPreviousMonth;
  }

  private getMonthDifference(startDate: Date, endDate: Date) {
    return (
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth())
    );
  }

  private formatRewardLogHistoryMonthWise(rewardLogsHistory: RewardLogs[]) {
    const formattedLogs: { [key: string]: RewardLogs[] } =
      rewardLogsHistory.reduce((acc, rewardLog) => {
        const fullMonthYear = new Date(rewardLog.createdAt).toLocaleDateString(
          'en-IN',
          {
            year: 'numeric',
            month: 'long',
          },
        );

        if (!(fullMonthYear in acc)) {
          acc[fullMonthYear] = [];
        }

        acc[fullMonthYear].push(rewardLog);

        return acc;
      }, {});

    return formattedLogs;
  }

  async getUserRewards(
    userId: string,
    rewardType: REWARD_TYPES,
    uptoMonth: number = 2,
  ): Promise<UserRewardsResponse> {
    //  1. Get last active reward for user of specified reward type
    const activeReward = await this.getExistingReward(userId, rewardType);

    //  2. Get the locked amount in the reward
    let amount: number;
    if (!activeReward) {
      amount = 0;
    } else {
      amount = activeReward.redeemableAmount;
    }

    //  3. Get previous month start date for reward logs to be fetched from
    const fetchUpto = this.getPreviousMonthStart(uptoMonth);

    //  4.a. Promise to fetch the first ever reward log for user of specified reward type
    const firstRewardLogPromise = this.rewardLogsRepository.findOne({
      where: { userId, type: rewardType },
      order: [['created_at', 'asc']],
    });

    //  4.b. Promise to fetch all user reward logs upto the specified month number
    const rewardLogsHistoryPromise = this.rewardLogsRepository.findAll({
      where: {
        userId,
        type: rewardType,
        createdAt: {
          [Op.gte]: fetchUpto,
        },
      },
      order: [['created_at', 'desc']],
    });

    //  4.c. Get first reward log and reward logs upto specified month number
    const [firstRewardLog, rewardLogsHistory] = await Promise.all([
      firstRewardLogPromise,
      rewardLogsHistoryPromise,
    ]);

    //  5. Calculate month difference between first log and previous month start date
    let moreMonthsAvailable = 0;
    if (firstRewardLog) {
      const monthDifference = this.getMonthDifference(
        new Date(firstRewardLog.createdAt),
        fetchUpto,
      );
      moreMonthsAvailable = Math.max(monthDifference, 0);
    }

    //  6. Format reward logs history into an object grouped by month
    const history = this.formatRewardLogHistoryMonthWise(rewardLogsHistory);

    return {
      uptoMonth,
      amount,
      history,
      moreMonthsAvailable,
    };
  }
}
