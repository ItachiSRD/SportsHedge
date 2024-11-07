import { View, PressableProps } from 'react-native';
import React from 'react';
import PressableBtn from '@/components/general/buttons/PressableBtn';
import { twMerge } from 'tailwind-merge';
import ChvronRightIcon from '@/assets/icons/chevron-right.svg';
import CustomText from '@/components/general/Text';
import { colors } from '@/styles/theme/colors';

interface IBottomSheetLaunchCardProps extends PressableProps {
    providerIcon: React.ReactNode;
    providerName: string;
    containerClass?: string;
    textClass?: string;
}

const BottomSheetLaunchCard = ({ containerClass, providerIcon, providerName, textClass, ...props }: IBottomSheetLaunchCardProps) => {
  const classes = twMerge(
    'flex-row justify-between items-center py-[18px] px-5 rounded-[10px] bg-theme-primary',
    containerClass
  );
  const textClasses = twMerge(
    "text-brand-content leading-[21px] ml-5",
    textClass
  );
  return (
    <PressableBtn {...props} pressableClasses={classes}>
      <View className="flex-row items-center">
        {providerIcon}
        <CustomText fontWeight={500} textClass={textClasses}>{providerName}</CustomText>
      </View>
      <ChvronRightIcon fill={colors['theme-content-active']} width={20} height={20} />
    </PressableBtn>
  );
};

export default BottomSheetLaunchCard;