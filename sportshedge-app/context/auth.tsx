import React, { createContext, useState } from 'react';
import { useContext } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useAppDispatch } from '../store';
import { registerUserAction } from '@/store/slices/user/action';
import { getUserDataFromLocalStorage } from '@/utils/local-storage';

interface IAuthContextProps {
  children: React.ReactNode;
}

export interface IAuthStateContext {
  authUser: FirebaseAuthTypes.User | null;
  setAuthUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
  updateUserName: (userName: string) => void;
  updateEmail: (email: string) => void;
  registerUser: (name?: string) => void;
}

const initialState = {
  authUser: auth().currentUser
};

const AuthContext = createContext(initialState as IAuthStateContext);

const AuthContextProvider = ({ children }: IAuthContextProps) => {
  const [authUser, setAuthUser] = useState(initialState.authUser);
  const dispatch = useAppDispatch();

  const updateUserName = async (userName: string) => {
    await auth().currentUser?.updateProfile({
      displayName: userName
    });
    setAuthUser(auth().currentUser);
  };

  const updateEmail = async (email: string) => {
    await auth().currentUser?.verifyBeforeUpdateEmail(email);
    setAuthUser(auth().currentUser);
  };

  const registerUser = async (name?: string) => {
    const userName = name || authUser!.displayName;
    if (!userName) {
      throw new Error('User name is required');
    }
    const savedUserInfo = await getUserDataFromLocalStorage();
    dispatch(registerUserAction({
      userName,
      phone: {
        countryCode: savedUserInfo!.userInp.countryCode,
        number: savedUserInfo!.userInp.number
      },
      referralCode: savedUserInfo?.userInp.referralCode
    }));
  };

  return (
    <AuthContext.Provider
      value={{ authUser, setAuthUser, updateUserName, updateEmail, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthStateContext = () => useContext(AuthContext);

export default AuthContextProvider;
