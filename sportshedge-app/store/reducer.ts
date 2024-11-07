/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, combineReducers } from '@reduxjs/toolkit';
import userSlice, { userSliceInitialState } from './slices/user/reducer';
import playersSlice, { playerSliceInitialState } from './slices/players/reducer';
import orderSlice, { ordersInitialState } from './slices/order/reducer';

const createRootReducer = <T>(asyncReducers?: T) =>
  combineReducers({
    userSlice,
    playersSlice,
    orderSlice,
    ...asyncReducers
  });

const reducer = createRootReducer();

const rootReducer = (state: ReturnType<typeof reducer> | undefined, action: Action) => {
  if (action.type === 'LOGOUT') {
    state = {
      userSlice: userSliceInitialState,
      playersSlice: playerSliceInitialState,
      orderSlice: ordersInitialState,
    };
  }
  return reducer(state, action);
};

export default rootReducer;
