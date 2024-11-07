import { View , Dimensions} from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from '@/components/general/Text';

import CenterLogo from '@/assets/icons/mobileLogin-logo.svg';
import Logo1 from '@/assets/icons/loginArrows/1.svg'
import Logo2 from '@/assets/icons/loginArrows/2.svg'
import Logo3 from '@/assets/icons/loginArrows/3.svg'
import Logo4 from '@/assets/icons/loginArrows/4.svg'
import Logo5 from '@/assets/icons/loginArrows/5.svg'

import Union from '@/assets/icons/UnionStyle.svg';

const Branding = () => {

  return (
    <LinearGradient
      colors={['#2B2B37', '#141418', 'transparent']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: -0.3 }}
      className='items-center h-[317px] justify-end'
    >
      <Logo1 className='absolute top-[150px] left-[18px]'/>
      <Logo2 className='absolute top-[10px] left-[128px]'/>
      <Logo3 className='absolute top-[67px] right-0 '/>
      <Logo4 className='absolute top-[172px] left-[285px]'/>
      <Logo5 className='absolute top-[14px] left-[1.2px]'/>
      <CenterLogo width={29.614} height={33.178} className='bottom-[92px]'/>
      <View className='items-center justify-end'>
        <Union className='bottom-[-2px]'/>
        <CustomText fontWeight={700} className='text-[#D2D2D2] text-[20.714px] leading-[20.714px] absolute'>SportsHedge</CustomText>
      </View>
    </LinearGradient>
  )
}

export default Branding;