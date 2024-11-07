import { View } from 'react-native';
import React, { useState } from 'react';
import CustomText from '@/components/general/Text';

import InfoCircle from '@/assets/icons/info-circle.svg';
import PressableBtn from '@/components/general/buttons/PressableBtn';
import { POPUP_TEXT } from '@/constants/playerBottomsheetInfo';
import PopUp from './PopUp.tsx';

interface IPlayerPerformanceProps {
  fantasyPoints?: number;
  performanceAvg?: number;
  noOfGames?: number;
}

const PlayerPerformance = ({ fantasyPoints = 0, performanceAvg = 0 , noOfGames}: IPlayerPerformanceProps) => {

  const [activePopUp, setActivePopUp] = useState<string | null>(null);

  const textClass = 'text-[12px] text-theme-content-primary leading-[18px] tracking-[0.48px]';
  return (
    <>
    <View style={{gap: 12}} className="">
      <View style={{ gap: 4 }} className="flex-row items-center justify-between">
        <View style={{gap: 4}} className='flex-row items-center'>
          <CustomText textClass={textClass}>
            Live Fantasy Points
          </CustomText>
          <PressableBtn key={POPUP_TEXT.Fantasy.id} onPress={() => setActivePopUp('fantasy')}>
            <InfoCircle width={16} height={16}/>
          </PressableBtn>
          {activePopUp === 'fantasy' && <PopUp desc={POPUP_TEXT.Fantasy.desc} onClose={() => setActivePopUp(null)} /> }
        </View>
        <CustomText fontWeight={700} textClass={textClass}>
          {fantasyPoints}
        </CustomText>
      </View>
      <View style={{ gap: 4 }} className="flex-row items-center justify-between">
        <View style={{gap: 4}} className='flex-row items-center'>
          <CustomText textClass={textClass}>
          {noOfGames} Games Performance Average
          </CustomText>
          <PressableBtn key={POPUP_TEXT.Performance.id} onPress={() => setActivePopUp('performance')}>
            <InfoCircle width={16} height={16}/>
          </PressableBtn>
          {activePopUp === 'performance' && <PopUp desc={POPUP_TEXT.Performance.desc} onClose={() => setActivePopUp(null)} /> }
        </View>
        <CustomText textClass={textClass} fontWeight={700}>
          {performanceAvg}
        </CustomText>
      </View>
    </View>
    </>
  );
};

export default PlayerPerformance;
