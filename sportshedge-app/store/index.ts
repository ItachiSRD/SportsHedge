import { configureStore, ReducersMapObject } from '@reduxjs/toolkit';
import createSagaMiddleware, { Saga, Task } from 'redux-saga';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import reducer from './reducer';
import rootSaga from './saga';

enum SagaMode {
  RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount',
  DAEMON = '@@saga-injector/daemon',
  ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount',
}

export interface Descriptor {
  saga: Saga;
  mode: SagaMode;
  task?: Task
}

// Interface for key value pair of saga
interface InjectedSaga {
  [key: string]: Descriptor | string;
}

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: {},
});

sagaMiddleware.run(rootSaga);
export const runSaga = sagaMiddleware.run;
export const injectedReducers = {} as ReducersMapObject;
export const injectedSagas = {} as InjectedSaga;

type AppDispatch = typeof store.dispatch;
// Infer the root state type dynamically
export type RootState = ReturnType<typeof reducer>;


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;