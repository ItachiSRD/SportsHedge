export const ORDER_STATES = Object.freeze({
  INIT: 'INIT',
  OPEN: 'OPEN',
  PARTIAL_FULFILLED: 'PARTIAL_FULFILLED',
  PARTIAL_CANCELLED: 'PARTIAL_CANCELLED',
  FULFILLED: 'FULFILLED',
  DECREMENTED: 'DECREMENTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
});

export const ORDER_SIDE = Object.freeze({
  BUY: 'buy',
  SELL: 'sell',
});

export const ORDER_TYPE = Object.freeze({
  MARKET: 'market',
  LIMIT: 'limit',
});

export const ORDER_SORT_BY = Object.freeze({
  STATUS: 'STATUS',
  NAME: 'NAME',
  SIDE: 'SIDE',
  TIME: 'TIME',
  QUANTITY: 'QUANTITY',
});

export const ORDER_STATE_MAP = Object.freeze({
  OPEN: `('INIT', 'OPEN', 'PARTIAL_FULFILLED')`,
  EXECUTED: `('FULFILLED')`,
  CANCELLED: `('PARTIAL_CANCELLED', 'CANCELLED')`,
  REJECTED: `('DECREMENTED', 'REJECTED')`,
});

export const ORDER_STATUS_MAP = Object.freeze({
  OPEN: 'OPEN',
  EXECUTED: 'EXECUTED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
});

export const INSTRUMENT_TPYE = Object.freeze({
  ETF: 'ETF',
  PLAYER: 'PLAYER'
})