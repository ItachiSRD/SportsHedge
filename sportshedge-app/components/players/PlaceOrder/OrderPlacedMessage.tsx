import { View } from 'react-native';
import React from 'react';
import CustomText from '@/components/general/Text';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import { colors } from '@/styles/theme/colors';
import { OrderStatusT } from '@/types/entities/order';

interface IOrderPlacedMessageProps {
    status?: OrderStatusT;
}

const OrderPlacedMessage = ({ status = 'placed' }: IOrderPlacedMessageProps) => {
  const message = status === 'placed' ? 'Open Order Placed Successfully!' : 'Order Executed Successfully!';
  return (
    <View className="items-center">
      <CustomText
        fontWeight={700}
        className="text-xl text-brand-content leading-[30px] tracking-[0.8px]">
        {message}
      </CustomText>
      <View className="mt-6 items-center">
        <CustomText textClass="text-brand-content">You can check order details from</CustomText>
        <View style={{ gap: 12 }} className="flex-row items-center mt-1">
          <CustomText fontWeight={500} textClass="text-global-gray-20">Portfolio</CustomText>
          <ChevronRightIcon fill={colors['brand-content']} />
          <CustomText fontWeight={500} textClass="text-global-gray-20">Portfolio</CustomText>
        </View>
      </View>
    </View>
  );
};

export default OrderPlacedMessage;