export const SORT_ORDER_OPTIONS = [
  'Open, Executed, Rejected, Cancelled',
  'A - Z Alphabetically',
  'Buy & Sell',
  'Time',
  'Qty'
];

export const SORT_HOLDING_OPTIONS = [
  'A - Z Alphabetically',
  'Percentage Change',
  'Last Traded Price',
  'Profit & Loss',
  'Invested Amount'
];

export const dummyOrders = [
  {
    id: '1',
    transactionType: 'Buy',
    orderStatus: 'placed',
    orderPlacedAt: Date.now(),
    orderedAtPrice: 23,
    ltp: 56,
    playerName: 'Virat Kohli',
    qty: 25
  },
  {
    id: '2',
    transactionType: 'Sell',
    orderStatus: 'placed',
    orderPlacedAt: Date.now(),
    orderedAtPrice: 23,
    ltp: 56,
    playerName: 'Ishan Kishan',
    qty: 32
  },
  {
    id: '3',
    transactionType: 'Buy',
    orderStatus: 'rejected',
    statusMessage: 'Reason: Session timeoout',
    orderPlacedAt: Date.now(),
    orderedAtPrice: 23,
    ltp: 56,
    playerName: 'MS Dhoni',
    qty: 25
  },
  {
    id: '4',
    transactionType: 'Buy',
    orderStatus: 'cancelled',
    orderPlacedAt: Date.now(),
    orderedAtPrice: 23,
    ltp: 56,
    playerName: 'R Ashwin',
    qty: 2785
  },
  {
    id: '5',
    transactionType: 'Buy',
    orderStatus: 'placed',
    orderPlacedAt: Date.now(),
    orderedAtPrice: 23,
    ltp: 56,
    playerName: 'R Gaikwad',
    qty: 25
  },
  {
    id: '6',
    transactionType: 'Buy',
    orderStatus: 'placed',
    orderPlacedAt: Date.now(),
    orderedAtPrice: 23,
    ltp: 56,
    playerName: 'ABD',
    qty: 125
  }
];

export const dummyHoldings = [
  {
    id: '1',
    playerName: 'Virat Kohli',
    ltp: 56,
    ltpPercentageChange: 2.5,
    investedAmount: 5000,
    currentPrice: 5800,
    qty: 25
  },
  {
    id: '2',
    playerName: 'Ishan Kishan',
    ltp: 56,
    ltpPercentageChange: 3.5,
    investedAmount: 5000,
    currentPrice: 5800,
    qty: 32
  },
  {
    id: '3',
    playerName: 'MS Dhoni',
    ltp: 56,
    ltpPercentageChange: 2.5,
    investedAmount: 5000,
    currentPrice: 5800,
    qty: 25
  },
  {
    id: '4',
    playerName: 'R Ashwin',
    ltp: 56,
    ltpPercentageChange: 2.99,
    investedAmount: 5000,
    currentPrice: 5800,
    qty: 2785
  },
  {
    id: '5',
    playerName: 'R Gaikwad',
    ltp: 56,
    ltpPercentageChange: 29.5,
    investedAmount: 5000,
    currentPrice: 5800,
    qty: 25
  },
  {
    id: '6',
    playerName: 'ABD',
    ltp: 56,
    ltpPercentageChange: 12.5,
    investedAmount: 5000,
    currentPrice: 5800,
    qty: 125
  }
];