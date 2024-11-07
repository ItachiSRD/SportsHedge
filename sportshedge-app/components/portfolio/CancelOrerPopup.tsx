import { View } from 'react-native';
import React from 'react';
import CancelBookIcon from '@/assets/icons/cancel-book.svg';
import CustomText from '../general/Text';
import { TransactionSideT } from '@/types/entities/order';
import Button from '../general/buttons/Button';
import { colors } from '@/styles/theme/colors';

interface ICancelOrderPopupProps {
  playerName: string;
  transactionSide: TransactionSideT;
  qty: number;
  price: number;
  cancellingOrder?: boolean;
  handleCancelOrer?: () => void;
  handleGoBack?: () => void;
}

const CancelOrerPopup = ({
  playerName,
  transactionSide,
  qty,
  price,
  cancellingOrder = false,
  handleCancelOrer,
  handleGoBack
}: ICancelOrderPopupProps) => {
  return (
    <View style={{ gap: 30 }} className="bg-global-gray-80 p-[30px] pb-2.5 rounded-[20px]">
      <CancelBookIcon />
      <View>
        <CustomText textClass="text-brand-content leading-[21px] tracking-[0.56px]">
          Do you want to cancel below order?
        </CustomText>
        <CustomText
          fontWeight={700}
          textClass="text-brand-content text-base leading-[24px] tracking-[0.64px] mt-4 mb-1.5">
          <CustomText fontWeight={700} textClass="uppercase">{transactionSide}</CustomText>{' '}
          <CustomText fontWeight={700} textClass="theme-content-secondary">|</CustomText> Qty {qty + ' '}
          <CustomText fontWeight={700} textClass="theme-content-secondary">|</CustomText> Price {price}
        </CustomText>
        <CustomText
          fontWeight={700}
          textClass="text-brand-content text-base leading-[24px] tracking-[0.64px]">
          {playerName}
        </CustomText>
      </View>
      <View style={{ gap: 12 }}>
        <Button
          variant="outlined"
          size="large"
          containerClass="border-brand-content rounded-[10px]"
          textClass="text-brand-content text-base leading-[24px] tracking-[0.64px]"
          title="Yes Cancel the Order"
          onPress={handleCancelOrer}
          loading={cancellingOrder}
          disabled={cancellingOrder}
          loaderColor={colors['brand-content']}
        />
        <Button
          variant="ghost"
          size="large"
          containerClass="py-[13px] px-3"
          textClass="text-brand-content text-base leading-[24px] tracking-[0.64px]"
          title="Go Back"
          onPress={handleGoBack}
        />
      </View>
    </View>
  );
};

export default CancelOrerPopup;
