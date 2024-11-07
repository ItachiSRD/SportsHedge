import React from 'react';
import { View } from 'react-native';
import FundDepositIcon from '@/assets/icons/fund_deposit.svg';
import TransferIcon from '@/assets/icons/arrow-up-from-bracket.svg';
import LapseIcon from '@/assets/icons/trash-icon.svg';
import CustomText from '@/components/general/Text';

interface ILockedFundCardProps {
  title: string;
  date: string;
  amount: number;
  type: 'Deposit' | 'Transfer' | 'Lapse';
}
const icons = {
  Deposit: FundDepositIcon,
  Transfer: TransferIcon,
  Lapse: LapseIcon,
};

const LockedFundCard = ({ title, date, amount, type }: ILockedFundCardProps) => {

  const formatDate = (dateStr: string) => {
    if (dateStr === 'Just Now') {
      return dateStr;
    } else {
      return new Date(dateStr)
        .toLocaleString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
        .split(',')
        .reverse()
        .join(', ');
    }
  };

  const Icon = icons[type];
  return (
    <View className="flex-row mb-[30px] justify-between">
      <View className="bg-theme-primary w-[44px] h-[44px] justify-center items-center rounded-[8px] mr-[16px]">
        <Icon />
      </View>
      <View className="flex-1">
        <CustomText textClass="text-[16px] text-theme-reverse tracking-[0.64px] leading-[24px]">
          {title}
        </CustomText>
        <CustomText textClass="text-xs text-theme-content-active tracking-[0.48px] leading-[18px]">
          {formatDate(date)}
        </CustomText>
      </View>
      <CustomText
        fontWeight={500}
        textClass={`text-[16px] tracking-[0.64px] leading-[24px] ${Icon === FundDepositIcon ? 'text-[#38E896]' : (Icon === LapseIcon ? 'text-[#FF6D64]' : 'text-white')}`}>
        {Icon === FundDepositIcon ? `+ ₹${amount}` : `- ₹${amount}`}
      </CustomText>
    </View>
  );
};

export default LockedFundCard;
