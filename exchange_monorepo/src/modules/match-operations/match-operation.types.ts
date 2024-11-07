export type PostMatchData = {
  instruments: MatchInstrument[];
  price_etf: string;
};

export type MatchInstrument = {
  name: string;
  price: string;
  qty_buy: number;
  qty_sell: number;
  match: number;
  mil?: number;
};
