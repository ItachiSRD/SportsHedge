import { IRegisterUserSaga } from '@/types/sagas/user';

export const REGISTER_USER_ACTION = 'REGISTER_USER_ACTION';
export const GET_USER_DETAILS_ACTION = 'GET_USER_DETAILS_ACTION';
export const GET_USER_INVESTMENTS_ACTION = 'GET_USER_INVESTMENTS_ACTION';

export function registerUserAction(payload: IRegisterUserSaga['payload']) {
  return {
    type: REGISTER_USER_ACTION,
    payload
  };
}

export function getUserDetailsAction() {
  return {
    type: GET_USER_DETAILS_ACTION
  };
}

export function getUserInvestmentsAction() {
  return {
    type: GET_USER_INVESTMENTS_ACTION
  };
}