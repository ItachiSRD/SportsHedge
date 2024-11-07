import { View } from 'react-native';
import React from 'react';
import OrderPlacedIcon from '@/assets/images/place-order/orer-placed-tick.svg';
import OrderExecutedIcon from '@/assets/images/place-order/order-executed-tick.svg';
import CustomText from '@/components/general/Text';
import BriefCaseIcon from '@/assets/icons/briefcase-blank.svg';
import { colors } from '@/styles/theme/colors';
import { OrderStatusT } from '@/types/entities/order';

interface IOrderedPlayerInfo {
  status?: OrderStatusT;
  name?: string;
  qty?: number;
  orderPlacedAtPrice?: number;
  transactionType?: string;
}

const OrderedPlayerInfo = ({
  transactionType,
  status = 'placed',
  name = '',
  qty = 0,
  orderPlacedAtPrice = 0
}: IOrderedPlayerInfo) => {
  return (
    <View style={{ gap: 23 }} className="items-center flex-1 justify-center">
      {status === 'placed' ? <OrderPlacedIcon /> : <OrderExecutedIcon />}
      <View>
        <CustomText fontWeight={700} className="text-2xl text-brand-content">
          {name}
        </CustomText>
        <View style={{ gap: 12 }} className="flex-row items-center">
          <CustomText textClass="text-base text-global-gray-20 capitalize">{transactionType}</CustomText>
          <View style={{ gap: 4 }} className="flex-row items-center">
            <BriefCaseIcon fill={colors['global-gray-20']} />
            <CustomText textClass="text-base text-global-gray-20">{qty}</CustomText>
          </View>
          <CustomText textClass="text-base text-global-gray-20">
            at ₹{orderPlacedAtPrice}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default OrderedPlayerInfo;
