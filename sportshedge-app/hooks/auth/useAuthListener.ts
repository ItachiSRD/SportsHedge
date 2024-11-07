import { useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useAuthStateContext } from '../../context/auth';

export const useAuthListener = () => {
  const { authUser, setAuthUser } = useAuthStateContext();
  const isAuthenticated = !!authUser;

  const authStateChanged = async (authUser: FirebaseAuthTypes.User | null) => {
    if (authUser) {
      console.log('auth user', authUser, setAuthUser);
      setAuthUser(authUser);
    } else {
      setAuthUser(null);
    }
  };

  // Specifically for when user logs in with the phone number
  useEffect(() => auth().onAuthStateChanged(authStateChanged), []);

  return { isAuthenticated, authUser };
};