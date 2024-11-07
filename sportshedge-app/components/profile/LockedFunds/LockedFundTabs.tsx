import { View } from 'react-native';
import React from 'react';
import LockedFundTabBtn from './LockedFundTabBtn';

interface ILockedFundsTabProps {
  selectedTab: 'Deposit Bonus' | 'Referral Bonus';
  handleToggle: (tab: 'Referral Bonus' | 'Deposit Bonus') => void;
}

const LockedFundTabs = ({
  selectedTab,
  handleToggle
}: ILockedFundsTabProps) => {
  return (
    <View className="pl-[30px] pr-[29px] border-b flex-row items-stretch border-outline-secondary">
      <LockedFundTabBtn
        tabName="Deposit Bonus"
        amount={25000}
        isActive={selectedTab === 'Deposit Bonus'}
        onPress={() => handleToggle('Deposit Bonus')}
      />
      <LockedFundTabBtn
        tabName="Referral Bonus"
        amount={500}
        isActive={selectedTab === 'Referral Bonus'}
        onPress={() => handleToggle('Referral Bonus')}
      />
    </View>
  );
};

export default LockedFundTabs;
