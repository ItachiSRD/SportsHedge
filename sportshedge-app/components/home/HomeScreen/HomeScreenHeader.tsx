import { View, ViewProps } from 'react-native';
import React from 'react';
import SearchIcon from '@/assets/icons/search.svg';
import NotificationRead from '@/assets/icons/notification-read.svg';
import NotificationUnread from '@/assets/icons/notification-unread.svg';
import PressableBtn from '@/components/general/buttons/PressableBtn';
import CustomText from '@/components/general/Text';
import { colors } from '@/styles/theme/colors';

interface IHomeScreenHeaderProps extends ViewProps {
    userName?: string;
    onSearchPress?: () => void;
    onNotificationPress?: () => void;
}

const HomeScreenHeader = ({ userName, onSearchPress, onNotificationPress }: IHomeScreenHeaderProps) => {
  const newNotifications = true;
  return (
    <View className="flex-row justify-between items-center px-[30px]">
      <CustomText textClass="text-xl leading-[30px] tracking-[0.8px] text-brand-content">Hello {userName},</CustomText>
      <View className='flex-row gap-[36px]'>
        <PressableBtn onPress={onSearchPress}>
          <SearchIcon fill={colors['brand-content']} />
        </PressableBtn>
        <PressableBtn onPress={onNotificationPress}>
          <View className="w-6 h-6 flex justify-center items-center">
            {!newNotifications ? 
              <NotificationRead fill={colors['brand-content']} />:
              <NotificationUnread fill={colors['brand-content']} />
            }
         </View>
        </PressableBtn>
      </View>
    </View>
  );
};

export default HomeScreenHeader;