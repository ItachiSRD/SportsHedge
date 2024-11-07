import { View, ScrollView } from 'react-native';
import React from 'react';
import BaseScreen from '@/screens/BaseScreen';
import ProfileThumbnail from '@/components/profile/Thumbnail';
import ProfileMenuCard from '@/components/profile/Menu/MenuCard';
import HeadPhoneIcon from '@/assets/icons/headphone.svg';
import BookIcon from '@/assets/icons/book.svg';
import { CompositeScreenProps } from '@react-navigation/core';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ProfileStackListT, RootStackParamList } from '@/types/navigation/RootStackParams';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppSelector } from '@/store/index';

import { useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ContactUsBottomSheet from '@/components/profile/ContactUsBottomSheet';
import KycBottomSheet from '@/components/profile/KycBottomsheet';

type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<ProfileStackListT, 'Profile'>,
  StackScreenProps<RootStackParamList>
>;

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const KycBottomSheetRef = useRef<BottomSheetModal>(null);
  const ContactUsBottomSheetRef = useRef<BottomSheetModal>(null);
  const { user } = useAppSelector((state) => state.userSlice);
  console.log('user', user);
  return (
    <BaseScreen>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View className="flex-1 px-[30px] py-[25px] pb-0">
          <ProfileThumbnail
            onProfilePress={() => navigation.navigate('EditProfile')}
            name={user?.firstName || ''}
            fundsAvailable={user?.funds || 0}
            phoneNumber={user?.phone}
            onFundsPress={() => navigation.navigate('Funds')}
            onRewardsPress={() => navigation.navigate('Referral')}
            onKycPress={() => KycBottomSheetRef.current?.present()}
          />
          <View className="py-9">
            <View style={{ gap: 30 }} className="flex-row">
              <ProfileMenuCard
                icon={<HeadPhoneIcon />}
                title="Customer Support"
                desc="Whatsapp, Email, Telegram"
                onPress={() => ContactUsBottomSheetRef.current?.present()}
              />
              <ProfileMenuCard
                icon={<BookIcon />}
                title="Learn"
                desc="Rules, T&C, Privacy Policy, FAQs"
                onPress={() => navigation.navigate('Learn')}
              />
          
              <ContactUsBottomSheet bottomSheetRef={ContactUsBottomSheetRef} />
              <KycBottomSheet bottomSheetRef={KycBottomSheetRef} />
            </View>
          </View>
        </View>
      </ScrollView>
    </BaseScreen>
  );
};

export default ProfileScreen;
