import { IResponseStructure } from './general';

export interface IUser {
  name: string;
  email: string;
  phoneNumber?: string;
}

export interface IUserData {
  userId: string;
  phoneNumber: string;
  email?: string;
  userName: string;
  gender?: 'MALE' | 'FEMALE';
  firstName: string;
  middleName: string;
  lastName: string;
  emailVerified: boolean;
  state?: string;
  profilePicture?: string;
  isActive: boolean;
  isDeleted: boolean;
  isKycDone: boolean;
  id: string;
  firebaseId: string;
  phoneVerified: true;
  phone: string;
  country: string;
  referralCode?: string;
  referrer: string;
  lockBookId: string;
  mainBookId: string;
  funds: number;
}

export interface IUserDataResponse {
  success: boolean;
  message: string;
  data: IUserData;
}

export interface IUserInvestments {
  investedAmount: number;
  currentValue: number;
}

export type UserInvestmentsResponseT = IResponseStructure<IUserInvestments[]>;

export enum UserBonusTypeEnum {
  REFERRAL = 'REFERRAL',
  DEPOSIT = 'DEPOSIT'
}

export enum UserBonusActionEnum {
  CREDITED = 'CREDITED',
  DEPOSITED = 'DEPOSITED',
  LAPSED = 'LAPSED'
}

export interface IUserBonusLog {
  rewardLogId: string;
  rewardId: string;
  userId: string;
  type: UserBonusTypeEnum;
  amount: string;
  action: UserBonusActionEnum;
  description: string;
  createdAt: string;
}

export interface IUserBonusHistory {
  [key: string]: IUserBonusLog[];
}

interface IUserBonus {
  uptoMonth: number;
  amount: string;
  history: IUserBonusHistory;
  moreMonthsAvailable: number;
}

export interface IUserCashBonus extends IUserBonus {}
export type UserCashBonusResponseT = IResponseStructure<IUserCashBonus>;

export interface IUserReferralBonus extends IUserBonus {}
export type UserReferralBonusResponseT = IResponseStructure<IUserReferralBonus>;