import AvatarIcon from '@/assets/icons/avatar.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import WarningIcon from '@/assets/icons/exlamation-triangle.svg';
import GiftIcon from '@/assets/icons/gift.svg';
import CustomText from '@/components/general/Text';
import Button from '@/components/general/buttons/Button';
import PressableBtn from '@/components/general/buttons/PressableBtn';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, ViewProps } from 'react-native';
import ThumbnailBtn from './ThumbnailBtn';
import { colors } from '@/styles/theme/colors';

interface IProfileThumbnailProps extends ViewProps {
  name: string;
  phoneNumber?: string | number;
  kycDone?: boolean;
  fundsAvailable?: number;
  onProfilePress?: () => void;
  onKycPress?: () => void;
  onFundsPress?: () => void;
  onRewardsPress?: () => void;
}

const ProfileThumbnail = ({
  name,
  phoneNumber,
  onProfilePress,
  onKycPress,
  onFundsPress,
  onRewardsPress,
  kycDone = false,
  fundsAvailable = 0
}: IProfileThumbnailProps) => {
  return (
    <LinearGradient
      colors={['#484848', 'rgba(79, 79, 79, 0.50)', 'rgba(77, 77, 77, 0.51)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.5914, 1.1832]}
      style={{ flex: 1, borderRadius: 20 }}
    >
      <View style={{ gap: 16 }} className="p-[30px] rounded-[20px] flex-1 justify-between">
        <View>
          <AvatarIcon />
          <PressableBtn onPress={onProfilePress} pressableClasses="flex-row items-center justify-between mt-4">
            <CustomText
              fontWeight={500}
              textClass="text-[28px] text-brand-content tracking-[1.12px] leading-[42px]">
              {name}
            </CustomText>
            <ChevronRightIcon fill={colors['theme-content-active']} width={24} height={24} />
          </PressableBtn>
          <CustomText className="text-brand-content leading-[21px] tracking-[0.56px]">
            {phoneNumber}
          </CustomText>
        </View>
        <View style={{ gap: 16 }} className="flex-1 justify-between">
          {!kycDone ? (
            <Button
              onPress={onKycPress}
              containerClass="justify-between"
              variant="ghost"
              textClass="text-brand-content"
              leadingIcon={<WarningIcon />}
              trailingIcon={<ChevronRightIcon fill={colors['theme-content-active']} width={24} height={24} />}
              title="Your account KYC is pending"
            />
          ) : null}
          <ThumbnailBtn onPress={onFundsPress}>
            <CustomText textClass="text-brand-content text-base tracking-[0.64px]">Funds</CustomText>
            <CustomText textClass="text-brand-content text-base tracking-[0.64px]">
              ₹ {fundsAvailable}
            </CustomText>
          </ThumbnailBtn>
          <ThumbnailBtn onPress={onRewardsPress}>
            <CustomText textClass="text-global-green-40 text-base tracking-[0.64px]">
              Refer & Earn
            </CustomText>
            <GiftIcon />
          </ThumbnailBtn>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ProfileThumbnail;
