import React from 'react';
import { View} from 'react-native';

import GiftBoxIcon from '@/assets/icons/giftbox-icon.svg';
import CustomText from '@/components/general/Text';

interface ILockedFundBannerProps {
  infoText?: string;
}

const LockedFundBanner = ({infoText}: ILockedFundBannerProps) => {
  return (
    <View className='pl-[29px] pr-7 bg-[#232323] justify-between flex-row items-center'>
      <View className='items-center pt-[20px]'>
        <GiftBoxIcon width={77} height={77} />
        <View className='bg-[#161616] h-[26px] w-[86px] rounded-t-[5px]'/>
      </View>
      <CustomText fontWeight={500} className='text-brand-content text-[16px] leading-[24px] tracking-[0.64px] h-[48px] w-[204px]'>
        {infoText}
      </CustomText>
    </View>
  );
};

export default LockedFundBanner;
