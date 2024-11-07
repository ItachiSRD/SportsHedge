import React from 'react';
import { View } from 'react-native';
import CustomText from '../Text';

interface ITradeTypeProps {
  text: string;
}

const TradeType = ({text}:ITradeTypeProps) => {
  return (
    <View className='rounded-[4px] bg-global-gray-80 px-[5px]'>
      <CustomText fontWeight={700} textClass='text-[12px] text-theme-content-primary leading-[18px] tracking-[0.48px]'>{text}</CustomText>
    </View>
  )
}

export default TradeType;