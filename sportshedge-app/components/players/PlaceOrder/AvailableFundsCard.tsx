import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import CustomText from '@/components/general/Text';
import PressableBtn from '@/components/general/buttons/PressableBtn';
import { colors } from '@/styles/theme/colors';
import RefreshIcon from '@/assets/icons/refreshicon.svg';

interface IAvailableFundsCardProps {
    fundBalance?: number;
    fetchingFund?: boolean;
    handleFetchFund?: () => void;
}

const AvailableFundsCard = ({fundBalance = 0, fetchingFund, handleFetchFund}: IAvailableFundsCardProps) => {
  return (
    <View className="flex-row items-center justify-between px-[30px] py-2.5 bg-theme-primary">
      <CustomText textClass="text-brand-content">Available Funds: ₹ {fundBalance}</CustomText>
      {fetchingFund ? (
        <ActivityIndicator size={16} color={colors['brand-content']} />
      ) : (
        <PressableBtn onPress={handleFetchFund}>
          <RefreshIcon />
        </PressableBtn>
      )}
    </View>
  );
};

export default AvailableFundsCard;