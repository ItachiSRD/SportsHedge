import CustomText from '@/components/general/Text';
import TradeType from '@/components/general/TradeType';
import React, { useCallback, useRef, useState } from 'react';
import { View, Image } from 'react-native';
import BriefCaseIcon from '@/assets/images/home/BriefCaseIcon.png';
import PressableBtn from '@/components/general/buttons/PressableBtn';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import BowlerBeesDetails from '../BowlerBees/Bottomsheet';

const HomeScreenBanner = () => {

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>();

  const bowlerBeesDetailRef = useRef<BottomSheetModal>(null);
  const handleClosePlayerDetails = useCallback(() => {
    setSelectedPlayerId(undefined);
  }, []);

  const handlePress = () => {
    bowlerBeesDetailRef.current?.present();
  };

  return (
    <>
    {/* <PressableBtn onPress={handlePress}> */}
      <View className='my-[24px] mx-[30px] rounded-[10px] border border-[#6A6A75] items-center'>
        <View className='flex-row pt-[14px] pb-[17px] pl-[14px] items-center'>
          <View className='ml-[15px] mr-[23px]'>
            <Image source={BriefCaseIcon} width={65} height={61}/>
          </View>
          <View className='flex-1 mr-[19px] ml-[13px]'>
            <CustomText fontWeight={600} className='text-[15px] text-white leading-[18px] tracking-[0.6px] mb-[10px]'>No experience in picking players stocks?</CustomText>
            <CustomText className='text-[10px] text-white leading-[15px] tracking-[0.4px] mb-[12px]'>Invest in pre-built portfolio in one tap. Discounted transaction fee of just 1%.</CustomText>
            <CustomText fontWeight={700} className='text-[14px] text-white leading-[21px] tracking-[0.56px] mb-[6px]' >Bowler Bees</CustomText>
            <View className='flex-row items-center'>
              <TradeType text='ETF'/>
              <CustomText fontWeight={500} className='text-[15px] text-white leading-[21px] tracking-[0.56px] ml-[8px] mr-[6px]'>₹ 58</CustomText>
              <CustomText fontWeight={500} className='text-[15px] text-[#38E896] leading-[21px] tracking-[0.56px]'>+2.5%</CustomText>
            </View>
          </View>
        </View>
      </View>
    {/* </PressableBtn> */}
    <BowlerBeesDetails bottomSheetRef={bowlerBeesDetailRef} closePlayerDetails={handleClosePlayerDetails}/>
    </>
  );
};

export default HomeScreenBanner;