import { useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AuthLoginStateT } from './useSocialAuthLogin';
import { useAuthStateContext } from '../../context/auth';

import { ERROR_CODES } from '@/constants/error-codes';

export const usePhoneVerification = () => {
  const { setAuthUser, registerUser } = useAuthStateContext();
  const [phoneLoginState, setPhoneLoginState] = useState<AuthLoginStateT>({ status: 'init' });
  const [confirmationState, setConfirmationState] = useState<AuthLoginStateT>({ status: 'init' });
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.PhoneAuthSnapshot>();

  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState('');

  // Handle verify phone number
  const verifyPhoneNumber = async (phoneNumber: string) => {
    try {
      setPhoneLoginState({ status: 'pending' });
      // const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      const confirmation = await auth().verifyPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      setPhoneLoginState({ status: 'success' });
    } catch (err) {
      console.log('Failed to verify the phone number.', err);
      setPhoneLoginState({
        status: 'failed',
        message: 'Something went wrong. Please try again later!'
      });
    }
  };

  const confirmCode = async (linkAccount?: boolean) => {
    try {
      setConfirmationState({ status: 'pending' });
      if (!confirm) throw new Error('Confirmation required.');
      console.log('confirm', code);
      // const confirmedUser = await confirm.confirm(code);
      const credential = auth.PhoneAuthProvider.credential(confirm.verificationId, code);
      let confirmedUser: FirebaseAuthTypes.UserCredential | undefined;
      if (linkAccount) {
        confirmedUser = await auth().currentUser?.linkWithCredential(credential);
        if (confirmedUser) {
          setAuthUser(confirmedUser.user);
        }
        await registerUser();
      } else {
        confirmedUser = await auth().signInWithCredential(credential);
      }
      console.log('confirmed ue', confirmedUser);
      setConfirmationState({ status: 'success' });
      return confirmedUser;
    } catch (error) {
      console.log('Invalid code.', error);
      const err = error as FirebaseAuthTypes.PhoneAuthError;
        const errCode = err.code ;
        const errorMessage = errCode ? ERROR_CODES[errCode] : 'Something Went Wrong!';
      setConfirmationState({ status: 'failed', message: errorMessage });
    }
  };

  return {
    code,
    setCode,
    confirm,
    setConfirm,
    confirmCode,
    verifyPhoneNumber,
    phoneLoginState,
    confirmationState
  };
};
