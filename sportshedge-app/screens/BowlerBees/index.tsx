import React from 'react'
import BaseScreen from '../BaseScreen'
import { View } from 'react-native'
import ScreenHeader from '@/components/general/ScreenHeader'
import { ScrollView } from 'react-native-gesture-handler'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '@/types/navigation/RootStackParams'
import CustomText from '@/components/general/Text'

import { BOWLER_BEES_TITLES, BOWLER_BEES_CONTENT } from '@/constants/bowlerBees'
import { COUNTRY_FLAGS } from '@/constants/country-flags'

type BowlerBeesScreenPropsT = StackScreenProps<RootStackParamList, 'BowlerBees'>;

const BowlerBeesScreen = ( { navigation }: BowlerBeesScreenPropsT) => {

  const CountryFlag = ({ country }: { country: string }) => {
    const FlagComponent = COUNTRY_FLAGS[country];
    return FlagComponent ? <FlagComponent /> : null;
  };
  const textClass = 'text-[14px] leading-[21px] tracking-[0.56px] text-theme-content-primary';
  return (
    <BaseScreen>
      <View className="mx-[30px] mt-[22px] mb-[28px]">
        <ScreenHeader
          title="Bowler Bees Holdings"
          handleGoBack={() => navigation.goBack()}
          textClass="text-[16px] leading-[24px] tracking-[0.64px]"
        />
      </View>
      <View className='border-t border-global-gray-80 px-[30px] pt-[20px]'>
        <View className='flex-row justify-between mb-[6px]'>
          {BOWLER_BEES_TITLES.map((item, index) => (
            <CustomText key={index} className='text-theme-content-secondary text-[12px] leading-[18px] tracking-[0.48px]'> {item.title} </CustomText>
          ))}
        </View>
        <ScrollView showsVerticalScrollIndicator={false} className='mx-[2px]'>
          {BOWLER_BEES_CONTENT.map((item, index) => (
            <View key={index} className='flex-row pt-[17px] pb-4 border-b border-theme-primary justify-center'>
              <CustomText fontWeight={500} className={`${textClass} w-1/4`}>{item.assets}</CustomText>
                <View style={{gap: 8}} className='flex-row items-center flex-1'>
                  <CountryFlag country={item.team}/>
                  <CustomText fontWeight={500} className={textClass}>{item.name}</CustomText>
                </View>
              <CustomText fontWeight={500} className={`${textClass}`}>₹ {item.price}</CustomText>
            </View>
          ))}
        </ScrollView>
      </View>
    </BaseScreen>
  )
}

export default BowlerBeesScreen;