import React from 'react';
import { FlatList, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation/RootStackParams';
import BaseScreen from '../BaseScreen';
import NotificationCard from '@/components/notification/NotificationCard';
import ScreenHeader from '@/components/general/ScreenHeader';

type INotificationScreenProps = StackScreenProps<RootStackParamList, 'Notifications'>;

type Notification = {
  title: string;
  date: string;
  type: 'Buy' | 'Sell' | 'Deposit' | 'Withdrawal' | 'Announcement' | 'Info';
};

const NotificationScreen = ({ navigation }: INotificationScreenProps) => {
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

  const notifications: Notification[] = [
    {
      title: 'Qty 25, Sell @ ₹60 of Virat Kohli order executed. Find it in holdings',
      date: 'Just Now',
      type: 'Sell'
    },
    {
      title:
        'You have bought 25 units of Virat Kholi @ ₹58. And track your order in the holdings. ',
      date: '2023-09-21T10:52:07.285Z',
      type: 'Buy'
    },
    {
      title: '₹500 has successfully deposited to your wallet',
      date: '2023-09-21T10:52:07.285Z',
      type: 'Deposit'
    },
    {
      title: 'Kohli is approaching a century, Track Kohli’s stock price in your portfolio',
      date: '2023-09-21T10:52:07.285Z',
      type: 'Announcement'
    },
    {
      title: '₹1000 has successfully withdrawn form your wallet to your bank',
      date: '2023-09-21T10:52:07.285Z',
      type: 'Withdrawal'
    },
    {
      title: '₹5000 has successfully deposited to your wallet',
      date: '2023-09-21T10:52:07.285Z',
      type: 'Deposit'
    },
    {
      title: 'Introducing instant withdrawal of your wallet',
      date: '2023-09-21T10:52:07.285Z',
      type: 'Info'
    }
  ];

  return (
    <BaseScreen>
      <View className="border-b border-[#404047]">
        <ScreenHeader
          title="Notifications"
          handleGoBack={() => navigation.goBack()}
          textClass="text-base"
          containerClass="mx-[30px] pt-[22px] pb-[20px]"
        />
      </View>
      <View className="mx-[30px] flex-1">
        <FlatList
          showsVerticalScrollIndicator={false}
          data={notifications}
          renderItem={({ item: notification }) => (
            <NotificationCard
              title={notification.title}
              date={formatDate(notification.date)}
              type={notification.type}
            />
          )}
        />
      </View>
    </BaseScreen>
  );
};

export default NotificationScreen;
