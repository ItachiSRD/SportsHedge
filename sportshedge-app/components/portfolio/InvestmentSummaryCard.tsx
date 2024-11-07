import { View } from 'react-native';
import React from 'react';
import CustomText from '../general/Text';
import { formatNumToShort } from '@/utils/number';

interface IInvestmentSummaryCardProps {
    investedAmount: number;
    currentValue: number;
}

const InvestmentSummaryCard = ({ investedAmount, currentValue }: IInvestmentSummaryCardProps) => {
  const netGains = currentValue - investedAmount;
  const gainPercentage = ((netGains / investedAmount) * 100).toFixed(2);
  return (
    <View style={{ gap: 24 }} className="pt-6 px-[30px] pb-[30px]">
      <View className="flex-row justify-between">
        <View>
          <CustomText
            fontWeight={500}
            textClass="text-global-gray-20 leading-[21px] tracking-[0.56px]">
            Invested
          </CustomText>
          <CustomText textClass="text-2xl text-brand-content leading-[36px] tracking-[0.96px]">
            ₹ {formatNumToShort(investedAmount)}
          </CustomText>
        </View>
        <View className="items-end">
          <CustomText
            fontWeight={500}
            textClass="text-global-gray-20 leading-[21px] tracking-[0.56px]">
            Current Value
          </CustomText>
          <CustomText textClass="text-2xl text-brand-content leading-[36px] tracking-[0.96px]">
            ₹ {(investedAmount + netGains).toLocaleString('en-IN')}
          </CustomText>
        </View>
      </View>
      <View className="flex-row justify-between items-center bg-global-gray-70 px-5 py-3 rounded-[10px]">
        <CustomText textClass="text-brand-content text-xs leading-[18px] tracking-[0.48px]">
          Return
        </CustomText>
        <CustomText
          fontWeight={700}
          textClass="text-global-green-50 text-lg leading-[27px] tracking-[0.72px]">
          {netGains < 0 ? '-' : '+'} ₹ {netGains.toLocaleString('en-IN')} ({gainPercentage}%)
        </CustomText>
      </View>
    </View>
  );
};

export default InvestmentSummaryCard;
