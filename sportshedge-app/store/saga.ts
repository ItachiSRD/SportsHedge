import { all } from 'redux-saga/effects';
import watchPlayersSaga from './slices/players/saga';
import watchUserSaga from './slices/user/saga';
import watchOrdersSaga from './slices/order/saga';
export default function* rootSaga() {
  yield all([watchUserSaga(), watchPlayersSaga(), watchOrdersSaga()]);
}
