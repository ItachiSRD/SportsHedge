import { IUserData } from '../entities/user';
import { ISagaAction } from './general';

export interface IRegisterUserSaga extends ISagaAction {
  payload: {
    userName: string;
    phone: {
      countryCode: string;
      number: string;
    };
    referralCode?: string;
    gender?: string;
    country?: string;
    state?: string;
    profilePicture?: string;
  };
}
export interface IUpdateUserDetailsSaga extends ISagaAction {
  payload: Partial<IUserData>;
}

interface IUserBonusQueryParams {
  uptoMonth: number;
}

export interface IUserCashBonusSaga extends ISagaAction {
  payload: IUserBonusQueryParams;
}

export interface IUserReferralBonusSaga extends ISagaAction {
  payload: IUserBonusQueryParams;
}
