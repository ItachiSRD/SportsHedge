import CustomText from '@/components/general/Text'
import React from 'react'
import { View } from 'react-native'
import ButtonOverlay from '../ButtonOverlay'

import BgRectangles from '@/assets/icons/bg_rectangles.svg'

const Theme1 = () => {
  
  const PriceTitles = ({text, textColor}: {text: string , textColor: string}) => {
    return (
      <CustomText fontWeight={500} className={`text-${textColor} text-[16px] leading-[24px] tracking-[0.64px]`}>{text}</CustomText>
    );
  }

  return (
    <View className='justify-center items-center flex-1'>
      <BgRectangles/>
      <View style={{gap: 18}} className='absolute w-[206px] h-[186px] rounded-[31.714px] border border-outline-secondary p-[30px]'>
        <View style={{gap: 12}}>
          <CustomText fontWeight={700} className='text-white text-[19px] leading-[28.5px] tracking-[0.76px] mr-[23px]'>Virat Kohli</CustomText>
          <View style={{gap: 8}} className='flex-row'>
            <PriceTitles text='LTP' textColor='global-gray-20'/>
            <PriceTitles text='₹ 65' textColor='brand-content'/>
            <PriceTitles text='+15%' textColor='global-green-50'/>
          </View>
        </View>
        <View style={{gap: 24}} className='flex-row'>
          <ButtonOverlay text='Buy'/>
          <ButtonOverlay text='Sell'/>
        </View>
      </View>
      
    </View>
  )
}

export default Theme1;