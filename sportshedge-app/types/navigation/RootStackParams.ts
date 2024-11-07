import { NavigatorScreenParams } from '@react-navigation/core';
import { IPlayerBasicInfo, IPlayerDetail } from '../entities/player';
import { TransactionSideT } from '../entities/order';

export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamsListT>;
    Main: NavigatorScreenParams<MainBottomTabListT>;
    Notifications: undefined;
    BowlerBees: undefined;
};
  

export type AuthStackParamsListT = {
    Login: undefined;
    Signup: undefined;
}

export type MainBottomTabListT = {
    Home: undefined;
    PlayersStack: NavigatorScreenParams<PlayersStackT>;
    PortFolio: undefined;
    ProfileStack: NavigatorScreenParams<ProfileStackListT>;
}

export type PlayersStackT = {
    PlayersLanding: undefined;
    PlaceOrders: {
        playerId: string;
        playerData: IPlayerBasicInfo;
        playerDetail: IPlayerDetail;
        transactionSide: TransactionSideT;
    }
}

export type ProfileStackListT = {
    Profile: undefined;
    EditProfile: undefined;
    Funds: undefined;
    Referral: undefined;
    Earnings: undefined;
    AadharKYC: undefined;
    DrivingLicenceKYC: undefined;
    LockedFunds: { initialTab?: 'Deposit Bonus' | 'Referral Bonus' };
    Learn: undefined;
    PricingModel: undefined;
    FantasyPointScoringSystem: undefined;
}