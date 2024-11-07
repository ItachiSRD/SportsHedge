import ScreenHeader from '@/components/general/ScreenHeader';
import BaseScreen from '@/screens/BaseScreen';
import { ProfileStackListT } from '@/types/navigation/RootStackParams';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View } from 'react-native';
import DepositBonus from './DepositBonus';
import ReferralRewards from './ReferralRewards';
import LockedFundTabs from '@/components/profile/LockedFunds/LockedFundTabs';

type LockedFundsPropsT = StackScreenProps<ProfileStackListT, 'LockedFunds'>;

const LockedFunds = ({navigation, route}: LockedFundsPropsT) => {
  const initialTab = route.params?.initialTab || 'Referral Bonus';
  const [selectedTab, setSelectedTab] = useState<'Deposit Bonus' | 'Referral Bonus'>(initialTab);

  return (
    <BaseScreen className='bg-theme-primary'>
      <ScreenHeader
        title="Locked Fund"
        handleGoBack={() => navigation.goBack()}
        containerClass='mx-[30px] my-[24px]'
        textClass="text-[14px] leading-[21px] tracking-[0.56px]"
      />
      <LockedFundTabs selectedTab={selectedTab} handleToggle={setSelectedTab} />
      <View className="bg-theme-secondary flex-1">
        {selectedTab == 'Deposit Bonus' ? <DepositBonus /> : <ReferralRewards />}
      </View>
    </BaseScreen>
  );
};

export default LockedFunds;
