import { ICancelOrderSaga, IGetOrdersSaga, IPlaceOrderSaga } from '@/types/sagas/order';

export const GET_ORDERS_ACTION = 'GET_ORDERS_ACTION';
export const PLACE_ORDER_ACTION = 'PLACE_ORDER_ACTION';
export const CANCEL_ORDER_ACTION = 'CANCEL_ORDER_ACTION';

export const getOrdersAction = (payload: IGetOrdersSaga['payload']) => {
  return {
    type: GET_ORDERS_ACTION,
    payload
  };
};

export const placeOrderAction = (payload: IPlaceOrderSaga['payload']) => {
  return {
    type: PLACE_ORDER_ACTION,
    payload
  };
};

export const cancelOrderAction = (payload: ICancelOrderSaga['payload']) => {
  return {
    type: CANCEL_ORDER_ACTION,
    payload
  };
};