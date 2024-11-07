// export type TransactionTypesT = 'Buy' | 'Sell';
// export type OrderTypesT = 'Market Order' | 'Limit Order';

export type TransactionSideT = 'buy' | 'sell';
export type TransactionTypeT = 'market' | 'limit';
export type OrderStatusT = 'INIT' | 'OPEN' | 'PARTIAL_FULFILLED' | 'PARTIAL_CANCELLED' | 'FULFILLED' | 'DECREMENTED' | 'REJECTED' | 'CANCELLED';


export interface IOrderRquestPayload {
  price: number;
  size: number;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  instrumentId: string;  // This is playerId
  instrumentType: string;  // This is playerId
}

export interface IOrderData {
  orderId: string;
  type: TransactionTypeT;
  instrument: string;
  size: number;
  price: number;
  status: OrderStatusT;
  date: string;
  side: TransactionSideT;
  quantityFilled: number;
}


export interface IOrdersResponse {
  success: boolean;
  message: string;
  data: {
    pageNo: number;
    pageSize: number;
    orders: IOrderData[]
  }
}