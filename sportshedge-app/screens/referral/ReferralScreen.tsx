import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import ClipboardCopyIcon from '@/assets/icons/clipboard-copy.svg';
import GiftIcon from '@/assets/icons/gift.svg';
import ShareIcon from '@/assets/icons/share.svg';
import WhatsappIcon from '@/assets/icons/whatsapp.svg';
import CustomText from '@/components/general/Text';
import Button from '@/components/general/buttons/Button';
import BackButton from '@/components/general/buttons/Navigation/BackButton';
import ReferralSteps from '@/components/profile/Referral/ReferralSteps';
import { useLaunchAppIntent } from '@/hooks/general/useLaunchAppIntent';
import BaseScreen from '@/screens/BaseScreen';
import { useAppSelector } from '@/store/index';
import { colors } from '@/styles/theme/colors';
import { MainBottomTabListT, ProfileStackListT } from '@/types/navigation/RootStackParams';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useMemo } from 'react';
import { Clipboard, ScrollView, View } from 'react-native';

type IReferralScreenProps = CompositeScreenProps<
  StackScreenProps<ProfileStackListT, 'Referral'>,
  BottomTabScreenProps<MainBottomTabListT>
>;

const ReferralScreen = ({ navigation }: IReferralScreenProps) => {
  const totalRewards = 200;
  const user = useAppSelector((state) => state.userSlice.user);

  const referralCode = user?.referralCode || '';
  const { openWhatsAppWithNumber } = useLaunchAppIntent();
  const isExistingUser = useMemo(() => totalRewards && totalRewards > 0, []);

  const wappShareMsg = `Install sportshedge app from sportshedge.io and start earning.${
    user?.referralCode ? ` Use the referral code ${referralCode} to get 15% cashback` : ''
  }.`;
  return (
    <BaseScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View className="px-[30px] py-[25px]">
          <BackButton onGoBack={() => navigation.goBack()} />
          <View style={{ gap: 8 }} className="flex flex-column items-center py-8">
            <CustomText textClass="text-[12px] text-global-gray-20 tracking-[0.64px] leading-[18px] py-2">
              Copy & share your referral code
            </CustomText>
            <Button
              onPress={() => Clipboard.setString(referralCode)}
              style={{ gap: 6 }}
              variant="ghost"
              containerClass="justify-start"
              textClass="text-[18px] leading-[27px] tracking-[0.64px] text-theme-reverse"
              textProps={{ fontWeight: 500 }}
              title={referralCode}
              trailingIcon={<ClipboardCopyIcon width={20} height={20} />}
            />
          </View>
          <View className="bg-global-gray-70 border border-outline-secondary flex flex-column justify-center items-center rounded-[10px] my-4">
            <CustomText textClass="text-[12px] text-global-gray-20 tracking-[0.64px] leading-[18px] py-4">
              Share in your network
            </CustomText>
            <View className="flex flex-row">
              <Button
                onPress={() => console.log('Share Link')}
                variant="ghost"
                containerClass="w-[50%] border-t border-r border-outline-secondary py-[13px]"
                leadingIcon={<ShareIcon width={24} height={24} />}
                title="Share"
                textClass="text-[16px] leading-[24px] tracking-[0.64px] text-global-gray-20"
                textProps={{ fontWeight: 700 }}
              />
              <Button
                onPress={() => openWhatsAppWithNumber(wappShareMsg)}
                variant="ghost"
                containerClass="w-[50%] border-t border-outline-secondary py-[13px]"
                leadingIcon={<WhatsappIcon width={23} height={23} />}
                title="Whatsapp"
                textClass="text-[16px] leading-[24px] tracking-[0.64px] text-global-gray-20"
                textProps={{ fontWeight: 700 }}
              />
            </View>
          </View>
        </View>
        <View style={{ flex: 1, backgroundColor: colors['global-black'] }}>
          <View
            className={`flex flex-row items-center px-[30px] py-[36px] border-b ${
              isExistingUser ? 'border-global-gray-80' : 'border-global-gray-90'
            }`}
            style={{ gap: 21 }}>
            {isExistingUser ? (
              <>
                <CustomText
                  fontWeight={500}
                  textClass="flex-1 text-[14px] text-global-gray-20 tracking-[0.64px] leading-[21px]">
                  Total Referral Reward
                </CustomText>
                {/* For mvp disabled the btn an removed the arrow icon */}
                <Button
                  onPress={() => navigation.navigate('LockedFunds', { initialTab: 'Referral Bonus' })}
                  textProps={{ fontWeight: 700 }}
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                  variant="ghost"
                  containerClass='bg-black'
                  textClass="text-theme-reverse text-[24px] tracking-[0.64px] leading-[36px]"
                  // disabled
                  trailingIcon={<ChevronLeftIcon width={20} height={20} className="rotate-180" />}
                  title={`₹ ${totalRewards}`}
                />
              </>
            ) : (
              <>
                <GiftIcon width={30} height={30} />
                <View style={{ gap: 4 }}>
                  <CustomText textClass="text-[14px] text-theme-reverse tracking-[0.64px] leading-[21px]">
                    On successful referral’s trade you will
                  </CustomText>
                  <CustomText textClass="text-[20px] text-theme-reverse tracking-[0.64px] leading-[30px]">
                    Earn <CustomText fontWeight={700}>20%</CustomText> Fee Forever
                  </CustomText>
                </View>
              </>
            )}
          </View>
          <ReferralSteps
            borderColor={isExistingUser ? 'global-gray-80' : 'global-gray-90'}
            stepFillColor={isExistingUser ? 'global-gray-80' : 'global-gray-dark'}
            bgColor={isExistingUser ? 'theme-secondary' : 'global-dark'}
          />
        </View>
      </ScrollView>
    </BaseScreen>
  );
};

export default ReferralScreen;
