import CustomText from '@/components/general/Text'
import React from 'react'
import { View } from 'react-native';
import TradeCard from '../TradeCard';
import BaseScreen from '@/screens/BaseScreen';

import { SPLASH_THEME_DATA } from '@/constants/splash-theme-data';
import Rod from '../Rod';


const Theme3 = () => {

  const { theme3 } = SPLASH_THEME_DATA;

  return (
    <BaseScreen>
      <View style={{gap: 20}} className='mt-[51px] mx-[36px]'>
        <TradeCard 
         key={theme3?.[0]?.id}
          transactionType='buy'
          country1={theme3?.[0]?.country1}
          country2={theme3?.[0]?.country2}
          player={theme3?.[0]?.player}
          price={theme3?.[0]?.price}          
        />
        {}
        <View style={{gap: 31}} className='mx-[28px] items-center'>
          <Rod />
          <Rod containerStyles='w-[162px] bg-[#222]'/>
          <Rod />
        </View>
        <TradeCard 
          key={theme3?.[1]?.id}
          transactionType='sell'
          country1={theme3?.[1]?.country1}
          country2={theme3?.[1]?.country2}
          player={theme3?.[1]?.player}
          price={theme3?.[1]?.price}
        />
      </View>
    </BaseScreen>
  )
}

export default Theme3;