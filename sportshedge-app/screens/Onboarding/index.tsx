import { View, Image } from 'react-native';
import React, { useState } from 'react';
import Login from '../auth/Login';
import WelcomNameEntry from './WelcomNameEntry';
import WelcomPhoneEntry from './WelcomPhoneEntry';
import { useAuthStateContext } from '../../context/auth';
import { useAppSelector } from '@/store/index';
import Branding from '@/components/onboarding/Branding';
import SplashCarousel from './SplashCarousel';

const Onboarding = () => {
  const { authUser } = useAuthStateContext();
  const { user } = useAppSelector((state) => state.userSlice);

  const [isSplashCarouselCompleted, setSplashCarouselCompleted] = useState(false);

  let welcomScreen: JSX.Element | undefined;

  if (authUser && !authUser.phoneNumber) {
    welcomScreen = <WelcomPhoneEntry authUser={authUser} />;
  } else if (authUser && (!authUser.displayName || !user)) {
    welcomScreen = <WelcomNameEntry />;
  }

  return (
    <View className='flex-1'>
      {isSplashCarouselCompleted ? (
        welcomScreen || (
          <View>
            <Branding />
            <Login />
          </View>
        )
      ) : (
        <SplashCarousel onFinalSlide={() => setSplashCarouselCompleted(true)} />
      )}
    </View>
  );
};

export default Onboarding;
