import { IOrderRquestPayload } from '../entities/order';
import { ISagaAction } from './general';

export interface IGetOrdersSaga extends ISagaAction {
  payload: {
    pageNo?: number;
  };
}

export interface IPlaceOrderSaga extends ISagaAction {
  payload: IOrderRquestPayload;
}

export interface ICancelOrderSaga extends ISagaAction {
  payload: {
    orderId: string;
  };
}
