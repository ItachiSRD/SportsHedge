export const SEQUELIZE = 'SEQUELIZE';
export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const PRODUCTION = 'production';
export const USER_REPOSITORY = 'USER_REPOSITORY';
export const USER_PLAYER_MAP_REPOSITORY = 'USER_PLAYER_MAP_REPOSITORY';
export const KYC_REPOSITORY = 'KYC_REPOSITORY';
export const USER_NOTIFICATIONS_REPOSITORY = 'USER_NOTIFICATIONS_REPOSITORY';
export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
export const PLAYER_REPOSITORY = 'PLAYER_REPOSITORY';
export const LEDGER_LOG_REPOSITORY = 'LEDGER_LOG_REPOSITORY';
export const TRADE_REPOSITORY = 'TRADE_REPOSITORY';
export const FUND_TRANSACTION_REPOSITORY = 'FUND_TRANSACTION_REPOSITORY';
export const FUND_TRANSACTION_LOG_REPOSITORY =
  'FUND_TRANSACTION_LOG_REPOSITORY';
export const REWARDS_REPOSITORY = 'REWARDS_REPOSITORY';
export const REWARD_LOGS_REPOSITORY = 'REWARD_LOGS_REPOSITORY';
export const INVESTMENTS_REPOSITORY = 'INVESTMENTS_REPOSITORY';
export const SH_BUSINESS_ID = '1';

// you should be able to import ideally all constants from index.
// since it's monolith, other people won't know which module has which code, once the codebase grows.
// Only use * to export everything from here.
// Else, index file will get polluted.
export * from './user';
export * from './order';
export * from './kyc';
export * from './error-codes';
export * as ERROR_MSG from './errors';
export * as MESSAGES from './messages';
export * from './payment';
export * from './player';
export * as SWAGGER from './swagger';
