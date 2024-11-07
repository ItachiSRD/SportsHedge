import { useState } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { useAppDispatch } from '@/store/index';

export type AuthLoginStateT = {
    status: 'init' | 'pending' | 'failed' | 'success';
    message?: string;
}

interface IGoogleSignInError extends Error {
    code: Partial<typeof statusCodes>;
}

const useSocialAuthLogin = () => {
  const dispatch = useAppDispatch();
  const [loginState, setLoginState] = useState<AuthLoginStateT>({ status: 'init' });
  const [logoutState, setLogoutState] = useState<AuthLoginStateT>({ status: 'init' });

  const signInWithGoogle = async () => {
    try {
      setLoginState({ status: 'pending' });
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      //   return auth().signInWithCredential(googleCredential);
      const user = await auth().signInWithCredential(googleCredential);
      console.log('userifno', user);
      setLoginState({ status: 'success' });
    } catch (err) {
      const error = err as IGoogleSignInError;
      let errorMessage = 'Something went wrong! Please try again later';
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        errorMessage = 'Login cancelled by user';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        errorMessage = 'Signin is in progress please wait for sometime';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        errorMessage = 'Play services required to login with google';
      } 

      setLoginState({ message: errorMessage, status: 'failed' });
    }
  };

  const signInWihApple = async () => {
    try {
      setLoginState({ status: 'pending' });
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
        // See: https://github.com/invertase/react-native-apple-authentication#faqs
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
    
      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }
      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
    
      // Sign the user in with the credential
      await auth().signInWithCredential(appleCredential);
    } catch(err) {
      const error = err as IGoogleSignInError;
      setLoginState({ status :'failed', message: error.message });
    }
  };


  const logOut = async () => {
    try {
      setLogoutState({ status: 'pending' });
      const isSignedInWithGoogle = await GoogleSignin.isSignedIn();

      if (isSignedInWithGoogle) {
        await GoogleSignin.signOut();
      }

      // Signout from react nativee firebase auth instance
      await auth().signOut();

      dispatch({ type: 'LOGOUT' });
      setLogoutState({ status: 'success' });
    } catch(err) {
      console.log('Failed to logout', err);
      const error = err as Error;
      setLogoutState({ status: 'failed', message: error.message });
    }
  };

  return { loginState, signInWithGoogle, signInWihApple, logoutState, logOut };
};

export default useSocialAuthLogin;