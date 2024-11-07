import { IUserData, IUserInvestments } from '@/types/entities/user';
import { IErrorActionPayload } from '@/types/reducers/general';
import { IUserSlice } from '@/types/reducers/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const userSliceInitialState: IUserSlice = {
  userInvestMents: { data: { investedAmount: 0, currentValue: 0 } }
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState: userSliceInitialState,
  reducers: {
    registerUser(state) {
      state.registartionStatus = 'loading';
    },
    registerUserSuccess(state, action: PayloadAction<IUserData>) {
      state.user = action.payload;
      state.registartionStatus = 'success';
    },
    registerUserFailed(state, action: PayloadAction<IErrorActionPayload>) {
      state.error = action.payload;
      state.registartionStatus = 'error';
    },
    getUserDetails(state) {
      state.status = 'loading';
    },
    getUserDetailsSuccess(state, action: PayloadAction<IUserData>) {
      state.user = action.payload;
      state.status = 'success';
    },
    getUserDetailsFailed(state, action: PayloadAction<IErrorActionPayload>) {
      state.error = action.payload;
      state.status = 'error';
    },
    getUserInvestments(state) {
      state.userInvestMents.status = 'loading';
    },
    getUserInvestmentsSuccess(state, action: PayloadAction<{ data: IUserInvestments }>) {
      const { data } = action.payload;
      state.userInvestMents.data = data;
      state.userInvestMents.status = 'success';
    },
    getUserInvestmentsFailed(state, action: PayloadAction<IErrorActionPayload>) {
      state.userInvestMents.error = action.payload;
    }
  }
});


export const {
  registerUser,
  registerUserSuccess,
  registerUserFailed,
  getUserDetails,
  getUserDetailsFailed,
  getUserDetailsSuccess,
  getUserInvestments,
  getUserInvestmentsFailed,
  getUserInvestmentsSuccess
} = userSlice.actions;

export default userSlice.reducer;