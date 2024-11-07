import CustomText from '@/components/general/Text';
import React from 'react';
import { View } from 'react-native';

import FavouriteEmptyIcon from '@/assets/images/home/FavoriteEmptyIcon.svg'

const FavouritesSection = () => {
  return (
    <View style={{gap: 20}} className='items-center mt-[30px]'>
      <View style={{gap: 6}} className='items-center'>
        <CustomText fontWeight={500} className='text-theme-content-active text-[12px] leading-[18px] tracking-[0.48px]'>Looks like you have not added any players.</CustomText>
        <CustomText fontWeight={500} className='text-theme-content-primary text-[14px] leading-[18px] tracking-[0.56px]'>Add from player details</CustomText>
      </View>
      <FavouriteEmptyIcon height={183} width={204} />
    </View>
  );
}

export default FavouritesSection;