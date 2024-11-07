import { Sequelize } from 'sequelize-typescript';
import { Kyc } from '../../modules/users/entity/kyc.entity';
import { LedgerLogs } from '../../entities/ledger_logs.entity';
import { Order } from '../../entities/orders.entity';
import { Trade } from '../../entities/trade.entity';
import { MatchBallByBall } from '../../modules/match/entities/match_ball_by_ball.entity';
import { Matches } from '../../modules/match/entities/matches.entity';
import { PlayerMatchMap } from '../../modules/match/entities/player_match_map.entity';
import { Player } from '../../modules/orders/entities/player.entity';
import { RewardLogs } from '../../modules/rewards/entity/reward-logs.entity';
import { Rewards } from '../../modules/rewards/entity/rewards.entity';
import { FundTransactionLogs } from '../../modules/users/entity/fund_transaction_logs.entity';
import { FundTransactions } from '../../modules/users/entity/fund_transactions.entity';
import { UserNotifications } from '../../modules/users/entity/user_notifications.entity';
import { UserPlayerFavorites } from '../../modules/users/entity/user_player_map.entity';
import { User } from '../../modules/users/entity/users.entity';
import { Books } from '../../modules/books/entities/books.entities';
import { BookBalance } from '../../modules/books/entities/book_balance.entities';
import { Operations } from '../../modules/operations/entities/operations.entities';
import { Postings } from '../../modules/operations/entities/postings.entities';
import { databaseConfig } from '../config';
import {
  DEVELOPMENT,
  FUND_TRANSACTION_LOG_REPOSITORY,
  FUND_TRANSACTION_REPOSITORY,
  INVESTMENTS_REPOSITORY,
  KYC_REPOSITORY,
  LEDGER_LOG_REPOSITORY,
  ORDER_REPOSITORY,
  PLAYER_REPOSITORY,
  REWARDS_REPOSITORY,
  REWARD_LOGS_REPOSITORY,
  SEQUELIZE,
  TRADE_REPOSITORY,
  USER_NOTIFICATIONS_REPOSITORY,
  USER_PLAYER_MAP_REPOSITORY,
  USER_REPOSITORY,
} from '../constant';
import { Investments } from '../../entities/investments.entity';
import { Business } from '../../modules/users/entity/business.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const config = databaseConfig;
      const seqConf = {
        database: config.database,
        username: config.username,
        password: config.password,
        host: config.host,
        port: config.port,
        logging: false,
      };
      // only postgres support added for now
      switch (config.dialect) {
        case 'postgres':
          seqConf['dialect'] = 'postgres';
        default:
          seqConf['dialect'] = 'postgres';
      }
      const sequelize = new Sequelize(seqConf);
      // All models should be here
      sequelize.addModels([
        User,
        Order,
        Player,
        UserPlayerFavorites,
        Trade,
        Kyc,
        LedgerLogs,
        UserNotifications,
        Matches,
        MatchBallByBall,
        PlayerMatchMap,
        FundTransactions,
        FundTransactionLogs,
        Rewards,
        RewardLogs,
        Investments,
        Books,
        BookBalance,
        Operations,
        Postings,
        Business
      ]);

      // auto migrate only if env is local
      if (process.env.NODE_ENV === DEVELOPMENT) {
        await sequelize.sync();
      }

      try {
        // tests for connection
        await sequelize.authenticate();
        console.log('Sequelize connection established successfully!');
      } catch (error) {
        // throw custom error
        console.error('Sequelize connection error:', error);
        process.exit(1);
      }
      return sequelize;
    },
  },
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
  {
    provide: ORDER_REPOSITORY,
    useValue: Order,
  },
  {
    provide: PLAYER_REPOSITORY,
    useValue: Player,
  },
  {
    provide: USER_PLAYER_MAP_REPOSITORY,
    useValue: UserPlayerFavorites,
  },
  {
    provide: TRADE_REPOSITORY,
    useValue: Trade,
  },
  {
    provide: KYC_REPOSITORY,
    useValue: Kyc,
  },
  {
    provide: LEDGER_LOG_REPOSITORY,
    useValue: LedgerLogs,
  },
  {
    provide: USER_NOTIFICATIONS_REPOSITORY,
    useValue: UserNotifications,
  },
  {
    provide: FUND_TRANSACTION_REPOSITORY,
    useValue: FundTransactions,
  },
  {
    provide: FUND_TRANSACTION_LOG_REPOSITORY,
    useValue: FundTransactionLogs,
  },
  {
    provide: REWARDS_REPOSITORY,
    useValue: Rewards,
  },
  {
    provide: REWARD_LOGS_REPOSITORY,
    useValue: RewardLogs,
  },
  {
    provide: INVESTMENTS_REPOSITORY,
    useValue: Investments,
  },
];
