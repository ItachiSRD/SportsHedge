import { View } from 'react-native';
import React from 'react';
import { OrderStatusT, TransactionSideT } from '@/types/entities/order';
import PressableBtn from '../general/buttons/PressableBtn';
import CustomText from '../general/Text';
import { orderStatusText } from '@/constants/order';
import { timeAgo } from '@/utils/date';

interface IPortfolioOrderCardProps {
  transactionType: TransactionSideT;
  orderStatus: OrderStatusT;
  statusMessage?: string;
  orderPlacedAt: string;
  orderedAtPrice: number;
  playerName: string;
  qty?: number;
  ltp?: number;
  handleOnPress?: () => void;
}

const PortfolioOrderCard = ({
  transactionType,
  playerName,
  orderPlacedAt,
  qty = 0,
  ltp = 0,
  orderedAtPrice = 0,
  orderStatus,
  handleOnPress,
  statusMessage
}: IPortfolioOrderCardProps) => {
  const placedOrderAgo = timeAgo(orderPlacedAt);
  return (
    <PressableBtn
      onPress={handleOnPress}
      disabled={!(orderStatus === 'INIT' || orderStatus === 'OPEN')}
      pressableClasses={'pt-[16.5px] pb-[15.5px] border-b border-theme-primary'}>
      <View className="flex-row justify-between">
        <View style={{ gap: 6 }}>
          <View style={{ gap: 8 }} className="flex-row items-center">
            <CustomText
              fontWeight={500}
              textClass={`py-[1px] px-[7px] rounded leading-[21px] tracking-[0.56px] uppercase ${
                transactionType === 'buy'
                  ? 'bg-global-green-90 text-global-green-30'
                  : 'bg-global-red-80 text-global-red-20'
              }`}>
              {transactionType}
            </CustomText>
            <CustomText
              fontWeight={500}
              textClass="leading-[21px] tracking-[0.56px] text-brand-content">
              {playerName}
            </CustomText>
          </View>
          <View style={{ gap: 10 }} className="flex-row items-center">
            <CustomText
              fontWeight={500}
              textClass="text-theme-content-secondary text-xs leading-[18px] tracking-[0.48px]">
              {placedOrderAgo}
            </CustomText>
            <View className="w-[1px] h-3 bg-outline-secondary" />
            <View style={{ gap: 6 }} className="flex-row items-center">
              <CustomText
                fontWeight={500}
                textClass="text-theme-content-secondary text-xs leading-[18px] tracking-[0.48px]">
                Qty
              </CustomText>
              <CustomText
                fontWeight={500}
                textClass="text-theme-content-secondary text-xs leading-[18px] tracking-[0.48px]">
                {qty}
              </CustomText>
            </View>
          </View>
        </View>
        <View style={{ gap: 6 }}>
          <CustomText textClass="self-end py-[1px] px-[7px] uppercase rounded bg-global-gray-80 text-theme-content-primary">
            {orderStatusText[orderStatus]}
          </CustomText>
          <View style={{ gap: 10 }} className="flex-row items-center">
            <CustomText
              fontWeight={500}
              textClass="text-theme-content-secondary text-xs leading-[18px] tracking-[0.48px]">
              LTP {ltp}
            </CustomText>
            <View className="w-[1px] h-3 bg-outline-secondary" />
            <View style={{ gap: 6 }} className="flex-row items-center">
              <CustomText
                fontWeight={500}
                textClass="text-theme-content-primary text-xs leading-[18px] tracking-[0.48px]">
                {transactionType === 'buy' ? 'Bid' : 'Offer'}
              </CustomText>
              <CustomText
                fontWeight={500}
                textClass="text-theme-content-primary text-xs leading-[18px] tracking-[0.48px]">
                {orderedAtPrice}
              </CustomText>
            </View>
          </View>
        </View>
      </View>
      {statusMessage ? (
        <View className="bg-theme-primary rounded py-1.5 pl-3 pr-1 mt-[22px] mb-[8.5px]">
          <CustomText
            fontWeight={500}
            textClass="text-theme-content-primary text-xs leading-[18px] tracking-[0.48px]">
            {statusMessage}
          </CustomText>
        </View>
      ) : null}
    </PressableBtn>
  );
};

export default PortfolioOrderCard;
