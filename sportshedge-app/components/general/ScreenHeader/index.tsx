import { View } from 'react-native';
import React from 'react';
import ChevronIcon from '@/assets/icons/chevron-right.svg';
import CustomText from '@/components/general/Text';
import PressableBtn from '@/components/general/buttons/PressableBtn';
import { twMerge } from 'tailwind-merge';

interface ScreenHeaderProps {
  handleGoBack?: () => void;
  title?: string;
  containerClass?: string;
  textClass?: string;
  icon?: React.ReactNode;
}

const ScreenHeader = ({
  handleGoBack,
  title,
  containerClass,
  textClass,
  icon,
}: ScreenHeaderProps) => {

  const containerClasses = twMerge(
    'relative flex-row items-center justify-center',
    containerClass
  );
  const textClasses = twMerge(
    'text-brand-content leading-[21px] tracking-[0.56px] self-center',
    textClass
  );

  return (
    <View className={containerClasses}>
      <PressableBtn pressableClasses="absolute left-0" onPress={handleGoBack}>
        <ChevronIcon width={24} height={24} fill="#FFF" className="rotate-180 w-6 h-6" />
      </PressableBtn>
      <CustomText textClass={textClasses}>{title}</CustomText>
      <View className='absolute right-0'>{icon}</View>
    </View>
  );
};

export default ScreenHeader;
