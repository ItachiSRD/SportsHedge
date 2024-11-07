import CustomText from '@/components/general/Text';
import React from 'react';
import { View } from 'react-native';

type IStepProps = {
  bgColor: string;
  stepFillColor: string;
  borderColor: string;
};

const ReferralSteps = ({ bgColor, borderColor, stepFillColor }: IStepProps) => {
  return (
    <View style={{ flex: 1 }} className={`px-[30px] bg-${bgColor}`}>
      <CustomText textClass="text-[12px] text-global-gray-20 tracking-[0.64px] leading-[18px] pt-[30px] pb-[22px]">
        This is how it works
      </CustomText>
      <View style={{ gap: 16 }}>
        <View
          className={`flex flex-row p-[6px] border border-${borderColor} rounded-[10px] items-center`}
          style={{ gap: 20 }}>
          <View
            className={`flex justify-center items-center bg-[#1E1E22] ${stepFillColor} w-[41px] h-[62px] rounded-[4px]`}>
            <CustomText
              fontWeight={700}
              textClass="text-[20px] text-theme-reverse tracking-[0.64px] leading-[30px]">
              1
            </CustomText>
          </View>
          <CustomText textClass="flex-1 text-[16px] text-theme-reverse tracking-[0.64px] leading-[24px]">
            Copy and share your referral code in your network
          </CustomText>
        </View>
        <View
          className={`flex flex-row p-[6px] border border-${borderColor} rounded-[10px] items-center`}
          style={{ gap: 20 }}>
          <View
            className={`flex justify-center items-center bg-[#1E1E22] ${stepFillColor} w-[41px] h-[62px] rounded-[4px]`}>
            <CustomText
              fontWeight={700}
              textClass="text-[20px] text-theme-reverse tracking-[0.64px] leading-[30px]">
              2
            </CustomText>
          </View>
          <CustomText textClass="flex-1 text-[16px] text-theme-reverse tracking-[0.64px] leading-[24px]">
            Get them registered with your referral code
          </CustomText>
        </View>
        <View
          className={`flex flex-row p-[6px] border border-${borderColor} rounded-[10px] items-center`}
          style={{ gap: 20 }}>
          <View
            className={`flex justify-center items-center bg-[#1E1E22] ${stepFillColor} w-[41px] h-[62px] rounded-[4px]`}>
            <CustomText
              fontWeight={700}
              textClass="text-[20px] text-theme-reverse tracking-[0.64px] leading-[30px]">
              3
            </CustomText>
          </View>
          <CustomText textClass="flex-1 text-[16px] text-theme-reverse tracking-[0.64px] leading-[24px]">
            Make <CustomText fontWeight={700}>20% of the transaction fee</CustomText> on all their
            trades at month end
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default ReferralSteps;
