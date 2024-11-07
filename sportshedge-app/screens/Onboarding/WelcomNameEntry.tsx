import React from 'react';
import { View } from 'react-native';
import { useState } from 'react';
import TextInput from '@/components/general/inputs/TextInput';
import Button from '@/components/general/buttons/Button';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import { useAuthStateContext } from '../../context/auth';
import { colors } from '@/styles/theme/colors';
import CustomText from '@/components/general/Text';
import { useAppSelector } from '@/store/index';

import Logo from '@/assets/icons/new-logo.svg';

export type UpdateStatesT = {
  status: 'init' | 'pending' | 'failed' | 'success';
  message?: string;
}

const WelcomNameEntry = () => {
  const { registerUser } = useAuthStateContext();
  const { registartionStatus } = useAppSelector((state) => state.userSlice);
  const [userName, setUserName] = useState('');
  const [updateState, setUpdateState] = useState<UpdateStatesT>({ status: 'init' });

  const handleUpdateUserName = async () => {
    try {
      if (!userName) return;
      setUpdateState({ status: 'pending' });
      await registerUser(userName);
      setUpdateState({ status: 'success' });
    } catch(err) {
      console.log('Failed to update the username', err);
      setUpdateState({ status: 'failed', message: 'Failed to update the username' });
    }
  };

  const loading = registartionStatus === 'loading' || updateState.status === 'pending';
  // const errorMessage = error?.message || updateState.message; 

  return (
    <View className="flex-1 justify-around py-[22px] px-[30px]">
      <View>
        <View style={{gap: 22}} className="mt-[49px]">
          <CustomText fontWeight={500} textClass="text-[16px] text-theme-content-active leading-[24px] tracking-[0.64px]">Welcome to</CustomText>
          <View style={{gap: 12}} className='flex-row items-center'>
            <Logo width={45} height={30}/>
            <CustomText fontWeight={700} textClass="text-[28px] text-theme-content-primary leading-[28px]">SportsHedge</CustomText>
          </View>
        </View>
      </View>
      <View>
        <View className="flex-row items-center">
          <TextInput
            rootContainerClass="flex-1"
            containerProps={{ className: 'py-3' }}
            placeholder="What’s Your First Name?"
            shape="rounded"
            value={userName}
            onChangeText={setUserName}
          />
          <Button
            onPress={handleUpdateUserName}
            containerClass="h-[50px] w-[81px] border-brand-content ml-6 p-0"
            variant="outlined"
            shape="rounded"
            loading={loading}
            trailingIcon={loading ? undefined : <ChevronRightIcon fill={colors['theme-content-active']} />}
            disabled={updateState.status === 'pending'}
            loaderColor={colors['brand-content']}
          />
        </View>
        {updateState.status === 'failed' ? <CustomText textClass="text-xs mt-4 text-negative">{updateState.message}</CustomText> : null}
      </View>
    </View>
  );
};

export default WelcomNameEntry;