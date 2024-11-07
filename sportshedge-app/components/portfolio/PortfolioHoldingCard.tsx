import { View } from 'react-native';
import React from 'react';
import CustomText from '../general/Text';
import BriefcaseIcon from '@/assets/icons/briefcase-blank.svg';
import { colors } from '@/styles/theme/colors';

interface IPortfolioHoldingCardProps {
  playerName: string;
  qty: number;
  ltp: number;
  ltpPercentageChange: number;
  investedAmount: number;
  currentPrice: number;
}

const PortfolioHoldingCard = ({
  playerName,
  qty,
  ltp,
  ltpPercentageChange,
  investedAmount,
  currentPrice
}: IPortfolioHoldingCardProps) => {
  const investmentPercentageChange = (
    ((currentPrice - investedAmount) / investedAmount) *
    100
  ).toFixed(2);
  return (
    <View className="pt-[19px] pb-[18px] border-b border-theme-primary flex-row justify-between">
      <View style={{ gap: 6 }}>
        <CustomText
          fontWeight={500}
          textClass="text-brand-content leading-[21px] tracking-[0.56px]">
          {playerName}
        </CustomText>
        <View style={{ gap: 12 }} className="flex-row items-center">
          <View style={{ gap: 4 }} className="flex-row items-center">
            <BriefcaseIcon fill={colors['theme-content-primary']} width={12} height={14} />
            <CustomText
              fontWeight={500}
              textClass="text-theme-content-active text-xs leading-[18px] tracking-[0.48px]">
              {qty}
            </CustomText>
          </View>
          <View className="h-3 w-[1px] bg-theme-content-secondary" />
          <View style={{ gap: 6 }} className="flex-row items-center">
            <CustomText
              fontWeight={500}
              textClass="text-theme-content-secondary text-xs leading-[18px] tracking-[0.48px]">
              LTP
            </CustomText>
            <CustomText
              fontWeight={500}
              textClass="text-theme-content-secondary text-xs leading-[18px] tracking-[0.48px]">
              {ltp}
            </CustomText>
            <CustomText
              fontWeight={500}
              textClass="text-positive text-xs leading-[18px] tracking-[0.48px]">
              (+{ltpPercentageChange}%)
            </CustomText>
          </View>
        </View>
      </View>
      <View style={{ gap: 6 }} className="items-end">
        <View style={{ gap: 6 }} className="flex-row items-center">
          <CustomText
            fontWeight={500}
            textClass="text-theme-content-secondary text-xs leading-[18px] tracking-[0.48px]">
            Invested
          </CustomText>
          <CustomText
            fontWeight={500}
            textClass="text-theme-content-secondary text-xs leading-[18px] tracking-[0.48px]">
            {investedAmount.toLocaleString('en-IN')}
          </CustomText>
        </View>
        <View style={{ gap: 12 }} className="flex-row items-center">
          <CustomText
            fontWeight={500}
            textClass="text-brand-content leading-[21px] tracking-[0.56px]">
            {currentPrice.toLocaleString('en-IN')}
          </CustomText>
          <View className="h-3 w-[1px] bg-theme-content-secondary" />
          <CustomText
            fontWeight={500}
            textClass="text-global-green-50 leading-[21px] tracking-[0.56px]">
            {investedAmount < 0 ? '-' : '+'}
            {investmentPercentageChange}%
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default PortfolioHoldingCard;
