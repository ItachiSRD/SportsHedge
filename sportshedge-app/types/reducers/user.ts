import { IUserData, IUserInvestments } from '../entities/user';
import { IErrorActionPayload, IReducerEntityState } from './general';

export interface IUserSlice {
    user?: IUserData
    registartionStatus?: 'loading' | 'error' | 'success';
    status?: 'loading' | 'error' | 'success';
    error?: IErrorActionPayload;
    userInvestMents: IReducerEntityState<IUserInvestments>;
}