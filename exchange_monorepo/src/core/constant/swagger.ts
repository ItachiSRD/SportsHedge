export const PUBLIC_APIS = 'Public APIs';

export const USER = {
  USER_ID: '144',
  FIREBASE_ID: '1f2sEFE341ad1',
  USERNAME: 'John',
  FIRST_NAME: 'John',
  MIDDLE_NAME: 'Jane',
  LAST_NAME: 'Doe',
  PHONE_NUMBER: '9999988888',
  EMAIL: 'john.doe@gmail.com',
  REFERRAL_CODE: 'TMKUC1TKSS780',
  REFERRER: '120',
  GENDER: 'MALE',
  COUNTRY: '+91',
  STATE: 'Karnataka',
  IS_KYC_DONE: true,
  IS_EMAIL_VERIFIED: false,
  IS_PHONE_VERIFIED: true,
  IS_DELETED: false,
  IS_ACTIVE: true,
  PROFILE_PIC:
    'https://lh3.googleusercontent.com/a/ACg8ocK4Bh8MuoiJRdqnjGTMHeAzPSOlU_albJgiZ0K8sNEi=s96-c',
  FUNDS: 10000,
  MAIN_BOOK_ID: '13',
  LOCK_BOOK_ID: '24',
  METADATA: {
    videoWatched: 5,
  },
  INVESTED_AMOUNT: '1000.00',
  INVESTED_AVERAGE: '69.69',
  CURRENT_VALUE: '1200',
};

export const PLAYER = {
  NAME: 'Virat Kohli',
  ROLE: 'batsman',
  TEAM: 'ind',
  PLAYER_ID: 'V_KOHLI',
  CAN_TRADE: true,
  IS_PLAYING: true,
  LTP: 34,
  PRICE: 50,
  FANTASY_POINTS: 59,
  PERFORMANCE_POINTS: [100, 55.7, 60.3],
  PERFORMANCE_AVERAGE: 72,
  STOCK_AVAILABILITY: {
    BUY: 50,
    SELL: 50,
  },
  MARKET_DEPTH: {
    bids: [
      [55, 53],
      [2, 4],
    ],
    offers: [
      [57, 59],
      [3, 1],
    ],
  },
  MATCH_NUMBER: 10,
};

export const GET_PLAYERS_RESPONSE = {
  [PLAYER.PLAYER_ID]: {
    name: PLAYER.NAME,
    role: PLAYER.ROLE,
    team: PLAYER.TEAM,
  },
};

export const ORDER = {
  ORDER_ID: 1,
  USER_ID: 1,
  TRANSACTION_FEE: 10,
  FEE_PERCENT: 1,
  PRICE: 50,
  SIZE: 2,
  QUANTITY_FILLED: 2,
  PRICE_FILLED: 48,
  SIDE: 'buy',
  TYPE: 'market',
  INSTRUMENT: PLAYER.NAME,
  ERROR_REASON: 'Session timeout',
  CREATED_AT: '2023-10-09T13:06:34.296Z',
  UPDATED_AT: '2023-10-09T13:06:34.296Z',
};

export const PLAYERS_PRICE = {
  PRICE: 50,
  LTP: 46.5,
  ONE_DAY_PRICE: 48.5,
  FIVE_DAY_PRICE: 52.6,
  TEN_DAY_PRICE: 49.2,
  TWENTY_DAY_PRICE: 50.1,
  THIRTY_DAY_PRICE: 44.5,
};

export const PLAYERS_PRICE_RESPONSE = {
  [PLAYER.PLAYER_ID]: {
    price: PLAYERS_PRICE.PRICE,
    ltp: PLAYERS_PRICE.LTP,
    oneDayPrice: PLAYERS_PRICE.ONE_DAY_PRICE,
    fiveDayPrice: PLAYERS_PRICE.FIVE_DAY_PRICE,
    tenDayPrice: PLAYERS_PRICE.TEN_DAY_PRICE,
    twentyDayPrice: PLAYERS_PRICE.TWENTY_DAY_PRICE,
    thirtyDayPrice: PLAYERS_PRICE.THIRTY_DAY_PRICE,
  },
};

export const HOLDING = {
  [PLAYER.PLAYER_ID]: 40,
};

export const FUND = {
  USER_ID: USER.USER_ID,
  TYPE: 'deposit',
  CURRENCY: 'INR',
  AMOUNT: 250.12,
  STATUS: 'SUCCESS',
  REFERENCE_ID: '123123480M',
  CREATED_AT: '2023-10-09T13:06:34.296Z',
  UPDATED_AT: '2023-10-09T13:06:34.296Z',
};

export const BONUS_LOG = {
  REWARD_LOG_ID: '1',
  REWARD_ID: '1',
  USER_ID: USER.USER_ID,
  REWARD_TYPE: 'REFERRAL',
  AMOUNT: 200,
  REWARD_ACTION: 'DEPOSITED',
  DESCRIPTION: 'Transferred to Wallet',
  CREATED_AT: '2023-10-09T13:06:34.296Z',
};

export const MONTH_WISE_BONUS_LOG = {
  'October 2023': [
    {
      rewardLogId: BONUS_LOG.REWARD_LOG_ID,
      rewardId: BONUS_LOG.REWARD_ID,
      userId: BONUS_LOG.USER_ID,
      type: BONUS_LOG.REWARD_TYPE,
      amount: BONUS_LOG.AMOUNT,
      action: BONUS_LOG.REWARD_ACTION,
      description: BONUS_LOG.DESCRIPTION,
      createdAt: BONUS_LOG.CREATED_AT,
    },
  ],
};

export const BONUS = {
  TYPE: 'REFERRAL',
  AMOUNT: 200,
  UPTO_MONTH: 2,
  MORE_MONTHS_AVAILABLE: 3,
};
