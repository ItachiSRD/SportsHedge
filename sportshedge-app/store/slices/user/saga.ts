import { call, put, takeLatest } from 'redux-saga/effects';
import {
  getUserDetails,
  getUserDetailsFailed,
  getUserDetailsSuccess,
  getUserInvestments,
  getUserInvestmentsFailed,
  getUserInvestmentsSuccess,
  registerUser,
  registerUserFailed,
  registerUserSuccess
} from './reducer';
import { AxiosError, AxiosResponse } from 'axios';
import {
  IUserDataResponse,
  IUserInvestments,
  UserInvestmentsResponseT
} from '@/types/entities/user';
import axiosClient from '@/lib/http/axios';
import { API_ENDPOINTS } from '@/constants/api';
import {
  GET_USER_DETAILS_ACTION,
  GET_USER_INVESTMENTS_ACTION,
  REGISTER_USER_ACTION
} from './action';
import { IRegisterUserSaga } from '@/types/sagas/user';

function* registerUserSaga({ payload }: IRegisterUserSaga) {
  try {
    yield put(registerUser());

    console.log('register user dsd payload', payload);

    // Post request to register User
    const response: AxiosResponse<IUserDataResponse> = yield call(
      axiosClient.post<IUserDataResponse>,
      API_ENDPOINTS.USERS,
      payload
    );

    const user = response.data;

    console.log('register user', user);

    yield put(registerUserSuccess(user.data));
  } catch (err) {
    const error = err as AxiosError;
    console.error('Failed to register the user', error.response);
    yield put(registerUserFailed({ message: error.message }));
  }
}

function* getUserDetailsSaga({ payload }: IRegisterUserSaga) {
  try {
    yield put(getUserDetails());

    console.log('payload', payload);

    // Get the User details
    const response: AxiosResponse<IUserDataResponse> = yield call(
      axiosClient.get<IUserDataResponse>,
      API_ENDPOINTS.USERS
    );

    const user = response.data;

    console.log('get user', user);

    yield put(getUserDetailsSuccess(user.data));
  } catch (err) {
    const error = err as AxiosError;
    console.error('Failed to get the user details', error.response);
    yield put(getUserDetailsFailed({ message: error.message }));
  }
}

function* getUserInvestmentsSaga() {
  try {
    yield put(getUserInvestments());

    // Fetch the user investments
    // Get the players details
    // const response: AxiosResponse<UserInvestmentsResponseT> = yield call(
    //   axiosClient.get,
    //   API_ENDPOINTS.USER_INVESTMENTS,
    // );

    // const investments = response.data;
    // console.log('user investments', investments);
    const investments: IUserInvestments = {
      investedAmount: 12,
      currentValue: 12
    };
    // const investments={data:[
    //   {
    //     investedAmount: 12,
    //     currentValue: 12
    //   }

    // ]}
    yield put(getUserInvestmentsSuccess({ data: investments }));
  } catch (err) {
    const error = err as AxiosError<UserInvestmentsResponseT>;
    console.error('Failed to fetch the user investments ', error.response);
    yield put(
      getUserInvestmentsFailed({ message: error.response?.data?.message || error.message })
    );
  }
}

export default function* watchUserSaga() {
  yield takeLatest(REGISTER_USER_ACTION, registerUserSaga);
  yield takeLatest(GET_USER_DETAILS_ACTION, getUserDetailsSaga);
  yield takeLatest(GET_USER_INVESTMENTS_ACTION, getUserInvestmentsSaga);
}
