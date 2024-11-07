import React from 'react';
import { View } from 'react-native';
import PaymentProcessingIcon from '@/assets/icons/payment_processing.svg';
import CustomText from '@/components/general/Text/';

const PaymentProcessing = () => {
  return (
    <View>
      <PaymentProcessingIcon width={54} height={54} />
      <CustomText
        fontWeight={700}
        textClass="mt-8 mb-6 text-[16px] text-brand-content tracking-[0.64px] leading-[24px]">
        {'We\'re having payment processing issues at the moment. Please try again later'}
      </CustomText>
      <CustomText
        textClass="mb-8 text-[14px] text-brand-content tracking-[0.64px] leading-[21px]">
        If money was deducted from your account, it will be refunded
      </CustomText>
    </View>
  );
};

export default PaymentProcessing;
