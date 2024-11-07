export type OrderbookEntry = {
  p: number;
  q: number;
};

export type OrderBook = {
  asks: OrderbookEntry[];
  bids: OrderbookEntry[];
};
