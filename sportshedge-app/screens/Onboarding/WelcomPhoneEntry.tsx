import { View } from 'react-native';
import React from 'react';
import PhoneVerification from '../auth/Login/PhoneVerification';
import { User, UserInfo } from 'firebase/auth';
import CustomText from '@/components/general/Text';

import Logo from '@/assets/icons/new-logo.svg';

interface IWelcomPhoneEntryProps {
  authUser: User | UserInfo | null;
}

const WelcomPhoneEntry = ({ authUser }: IWelcomPhoneEntryProps) => {
  return (
    <View className="flex-1 justify-around py-[22px] px-[30px]">
      <View>
        <Logo width={45} height={30} className='mb-[20px]'/>
        <View style={{gap: 8}} >
          <CustomText textClass="text-[20px] leading-[30px] tracking-[0.8px] text-brand-content capitalize">
            Welcome, {authUser?.displayName}
          </CustomText>
          <CustomText textClass="text-xs text-theme-content-secondary leading-[18px] tracking-[0.48px]">
            {authUser?.email || ''}
          </CustomText>
        </View>
      </View>
      <PhoneVerification onlyPhoneVerification linkAccount />
    </View>
  );
};

export default WelcomPhoneEntry;
