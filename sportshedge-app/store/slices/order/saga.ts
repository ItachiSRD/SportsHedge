import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { getOrdersFailed, getOrders, placeOrder, placeOrderFailed, placeOrderSuccess, cancelOrder, cancelOrderSuccess, cancelOrderFailed, getOrdersSuccess } from './reducer';
import { CANCEL_ORDER_ACTION, GET_ORDERS_ACTION, PLACE_ORDER_ACTION } from './action';
import { ICancelOrderSaga, IGetOrdersSaga, IPlaceOrderSaga } from '@/types/sagas/order';
import { AxiosError, AxiosResponse } from 'axios';
import { API_ENDPOINTS, GET_ORDER_PAGE_SIZE } from '@/constants/api';
import axiosClient from '@/lib/http/axios';
import { IOrdersResponse } from '@/types/entities/order';
import { IResponseStructure } from '@/types/entities/general';
import { getUserDetailsAction } from '../user/action';

function* getOrdersSaga({ payload }: IGetOrdersSaga) {
  try {
    const { pageNo = 1 } = payload;
    yield put(getOrders());

    // Get the order from the api
    const response: AxiosResponse<IOrdersResponse> = yield call(
      axiosClient.get,
      API_ENDPOINTS.ORDERS + `?pageNo=${pageNo}&pageSize=${GET_ORDER_PAGE_SIZE}`,
    );

    const orders = response.data;

    console.log('orders', orders);

    yield put(getOrdersSuccess({ data: orders.data }));
  } catch(err) {
    console.error('Failed to place the order', err);
    const error = err as Error;
    yield put(getOrdersFailed({ message: error.message }));
  }
}

function* placeOrdersSaga({ payload }: IPlaceOrderSaga) {
  try {
    yield put(placeOrder());

    console.log('pay', payload);

    // Get the order from the api
    const response: AxiosResponse<unknown> = yield call(
      axiosClient.post,
      API_ENDPOINTS.ORDERS,
      payload
    );

    const orderData = response.data;

    console.log('response', orderData);
    yield put(placeOrderSuccess({ data: orderData }));
    yield put(getUserDetailsAction());
  } catch(err) {
    const error = err as AxiosError<IResponseStructure<unknown>>;
    console.error('Failed to place the order', error.response);
    let message;
    if (error.response?.data) {
      message = error.response?.data.message;
    }
    yield put(placeOrderFailed({ message: message || error.message }));
  }
}

function* cancelOrderSaga({ payload }: ICancelOrderSaga) {
  const { orderId } = payload;
  try {
    yield put(cancelOrder({ orderId }));

    // Cancel request
    const response: AxiosResponse<unknown> = yield call(
      axiosClient.post,
      API_ENDPOINTS.CANCEL_ORDER,
      { orderId }
    );

    console.log('cancel response data', response.data);
    
    yield put(cancelOrderSuccess({ orderId }));

  } catch(err) {
    const error = err as AxiosError;
    console.error('Failed to cancel the order', error.response);
    yield put(cancelOrderFailed({ orderId, error: { message: error.message } }));
  }
}

export default function* watchOrdersSaga() {
  yield takeLatest(GET_ORDERS_ACTION, getOrdersSaga);
  yield takeLatest(PLACE_ORDER_ACTION, placeOrdersSaga);
  yield takeEvery(CANCEL_ORDER_ACTION, cancelOrderSaga);
}