import { View } from 'react-native';
import React from 'react';
import CustomText from '@/components/general/Text';
import ProgressBar from '@/components/general/status/progress/Bar';

interface IPlayerStockAvailabiltyProps {
    availablityPercentage?: number;
    buyAvailability?: number;
    sellAvailability?: number;
    title?: string;
}

const PlayerStockAvailability = ({ buyAvailability = 0, sellAvailability = 0, title='Stock Availability' }: IPlayerStockAvailabiltyProps) => {
  const availablityPercentage = 100 - (buyAvailability + sellAvailability);
  
  return (
    <View style={{ gap: 13 }} className="flex-row items-center justify-between">
      <CustomText textClass="text-[10px] text-brand-content leading-[15px] tracking-[0.4px]">
        {title}
      </CustomText>
      <ProgressBar progress={availablityPercentage} />
    </View>
  );
};

export default PlayerStockAvailability;