import React from 'react';
import { View } from 'react-native';
import InsufficientBalanceIcon from '@/assets/icons/insufficient_balance.svg';
import CustomText from '@/components/general/Text/';

interface IInsufficientBalanceProps {
  text?: string;
}

const InsufficientBalance = ({ text = 'You don\'t have sufficient money for withdrawal' }: IInsufficientBalanceProps) => {
  return (
    <View>
      <InsufficientBalanceIcon width={53} height={40} />
      <CustomText
        fontWeight={700}
        textClass="my-8 text-[16px] text-brand-content tracking-[0.64px] leading-[24px]">
        {text}
      </CustomText>
    </View>
  );
};

export default InsufficientBalance;
