import { GET_ORDER_PAGE_SIZE } from '@/constants/api';
import { IOrdersResponse } from '@/types/entities/order';
import { IErrorActionPayload } from '@/types/reducers/general';
import { IOrderSlice } from '@/types/reducers/order';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const ordersInitialState: IOrderSlice = {
  placeOrder: { data: {} },
  orders: { data: [], pageNo: 0, pazeSize: 10 }, 
  cancelOrder: { },
};

export const orderSlice = createSlice({
  name: 'orderSlice',
  initialState: ordersInitialState,
  reducers: {
    placeOrder(state) {
      state.placeOrder.status = 'loading';
    },
    placeOrderSuccess(state, action: PayloadAction<{ data: unknown }>) {
      state.placeOrder.data = action.payload.data;
      state.placeOrder.status = 'success';
    },
    placeOrderFailed(state, action: PayloadAction<IErrorActionPayload>) {
      state.placeOrder.error = action.payload;
      state.placeOrder.status = 'error';
      state.placeOrder.showToast = true;
      state.placeOrder.toastMessagge = action.payload.message;
    },
    updatePlaceOrderStatus(state, action: PayloadAction<{ status: IOrderSlice['placeOrder']['status'] }>) {
      state.placeOrder.status = action.payload.status;
    },
    closePlaceOrderToast(state) {
      state.placeOrder.showToast = false;
    },
    getOrders(state) {
      state.orders.status = 'loading';
    },
    getOrdersSuccess(state, action: PayloadAction<{ data: IOrdersResponse['data'] }>) {
      const { data } = action.payload;
      // Filter the exising order which are not there in the new orders
      const filteredOrders = state.orders.data.filter((order) =>
        data.orders.every((newOrder) => newOrder.orderId !== order.orderId)
      );

      // Update the orders
      state.orders.data = [ ...filteredOrders, ...data.orders ];
      state.orders.pageNo = data.pageNo;
      state.orders.status = 'success';
      state.orders.hasMoreData = data.orders.length >= GET_ORDER_PAGE_SIZE;
    },
    getOrdersFailed(state, action: PayloadAction<IErrorActionPayload>) {
      state.orders.status = 'error';
      state.orders.error = action.payload;
    },
    cancelOrder(state, action: PayloadAction<{ orderId: string }>) {
      const { orderId } = action.payload;
      state.cancelOrder[orderId] = { status: 'loading' };
    },
    cancelOrderSuccess(state, action: PayloadAction<{ orderId: string }>) {
      const { orderId } = action.payload;
      state.orders.data = state.orders.data.map((order) => {
        if (order.orderId === orderId) {
          return { ...order, status: 'CANCELLED' };
        }
        return order;
      });
      state.cancelOrder[orderId].status = 'success';
    },
    cancelOrderFailed(state, action: PayloadAction<{ orderId: string, error: IErrorActionPayload }>) {
      const { orderId, error } = action.payload;
      state.cancelOrder[orderId] = { status: 'error', error: error };
    },
    updateCanelOrderStatus(state, action: PayloadAction<{ orderId: string; status: 'init' | 'loading' | 'error' | 'success' }>) {
      const { orderId, status } = action.payload;
      if (state.cancelOrder[orderId]) {
        state.cancelOrder[orderId].status = status;
      }
    }
  }
});

export const {
  placeOrder,
  placeOrderFailed,
  placeOrderSuccess,
  updatePlaceOrderStatus,
  closePlaceOrderToast,
  getOrders,
  getOrdersFailed,
  getOrdersSuccess,
  cancelOrder,
  cancelOrderFailed,
  cancelOrderSuccess,
  updateCanelOrderStatus
} = orderSlice.actions;

export default orderSlice.reducer;