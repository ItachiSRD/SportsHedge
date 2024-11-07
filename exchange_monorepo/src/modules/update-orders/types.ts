import { Books } from 'src/services/ledger/types';
import { Order } from '../../entities/orders.entity';

//  TODO: Change key to orderId
export type MEOrder = {
  [orderId: string]: {
    p: string;
    q: string;
    s: string;
  };
};

export type MEError = {
  [orderId: string]: {
    action: string;
    message: string;
  };
};

export type MEOutput = {
  orderId: string;
  created: MEOrder | null;
  cancelled: MEOrder | null;
  fulfilled: MEOrder | null;
  partial: MEOrder | null;
  errors: MEError | null;
};

export type Match = {
  orderId: string;
  p?: string;
  q?: string;
  s?: string;
  action?: string;
  message?: string;
  isFulfilled: boolean;
  order: Order;
  user: {
    id: string;
    books: Books;
    currency: string;
  };
};

export type Exchange = {
  asset: string;
  quantity: number;
  price: number;
  currency: string;
};

export type Filled = {
  quantity: number;
  price: number;
  fees: number;
};
