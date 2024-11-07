import React from 'react';
import { View } from 'react-native';
import CustomText from '../general/Text';
import FundSellIcon from '@/assets/icons/sell-icon.svg';
import FundBuyIcon from '@/assets/icons/buy-icon.svg';
import FundDepositIcon from '@/assets/icons/fund_deposit.svg';
import FundWithdrawnIcon from '@/assets/icons/fund_withdrawn.svg';
import AnnouncementIcon from '@/assets/icons/announcement-icon.svg';
import InfoIcon from '@/assets/icons/information-icon.svg';

interface INotificationCardProps {
  title: string;
  date: string;
  type: 'Buy' | 'Sell' | 'Deposit' | 'Withdrawal' | 'Announcement' | 'Info';
}
const icons = {
  Sell: FundSellIcon,
  Buy: FundBuyIcon,
  Deposit: FundDepositIcon,
  Withdrawal: FundWithdrawnIcon,
  Announcement: AnnouncementIcon,
  Info: InfoIcon
};

const NotificationCard = ({ title, date, type }: INotificationCardProps) => {
  const Icon = icons[type];
  return (
    <View className="flex flex-row gap-[16px] border-b border-[#29292E] py-[30px]">
      <View className="bg-theme-primary w-[44px] h-[44px] justify-center items-center rounded-md">
        <Icon />
      </View>
      <View style={{ gap: 12 }} className="flex-1">
        <CustomText textClass="text-base text-theme-reverse tracking-[0.64px] leading-[24px]">
          {title}
        </CustomText>
        <CustomText textClass="text-xs text-theme-content-active tracking-[0.48px] leading-[18px]">
          {date}
        </CustomText>
      </View>
    </View>
  );
};

export default NotificationCard;
