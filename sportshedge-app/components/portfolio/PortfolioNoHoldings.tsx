import { View } from 'react-native';
import React from 'react';
import SuitcaseIcon from '@/assets/icons/suitcase.svg';
import CustomText from '../general/Text';
import { colors } from '@/styles/theme/colors';

const PortfolioNoHoldings = () => {
  return (
    <View style={{ gap: 10 }} className="pt-[47px] py-[49px] px-14 items-center">
      <SuitcaseIcon fill={colors['theme-content-active']} />
      <CustomText textClass="text-theme-content-active text-center leading-[21px] tracking-[0.56px]">
        Buy your favourite player’s stock to see them in holdings here
      </CustomText>
    </View>
  );
};

export default PortfolioNoHoldings;
