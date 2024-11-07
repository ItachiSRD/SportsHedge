import { IOrderData } from '../entities/order';
import { IErrorActionPayload } from './general';

export interface IOrderSlice {
  placeOrder: {
    showToast?: boolean;
    toastMessagge?: string;
    type?: 'error' | 'info';
    data: unknown;
    status?: 'init' | 'loading' | 'error' | 'success';
    error?: IErrorActionPayload;
  };
  cancelOrder: {
    [orderId: string]: {
      status?: 'init' | 'loading' | 'error' | 'success';
      error?: IErrorActionPayload;
    };
  },
  orders: {
    data: IOrderData[];
    status?: 'init' | 'loading' | 'error' | 'success';
    error?: IErrorActionPayload;
    hasMoreData?: boolean;
    pageNo: number;
    pazeSize: number;
  }
}