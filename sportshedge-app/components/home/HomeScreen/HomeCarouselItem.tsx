import { View } from 'react-native';
import React from 'react';
import PressableBtn, { IPressableBtnProps } from '@/components/general/buttons/PressableBtn';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from '@/components/general/Text';

interface IHomeCarouselItemProps extends IPressableBtnProps {
  title?: string;
  desc?: string;
  highlightText?: string;
  icon?: React.ReactNode;
  isClickable?: boolean;
}

const HomeCarouselItem = ({
  title = '',
  desc = '',
  highlightText = '',
  icon,
  isClickable = false,
  ...props
}: IHomeCarouselItemProps) => {
  return (
    <PressableBtn pressableClasses={isClickable ? 'active:opacity-60' : 'active:opacity-100'} {...props}>
        <View style={{ gap: 6 }} className="h-[85px] border border-theme-primary rounded-[20px]">
          <View style={{ gap: 6 }}>
            <CustomText
              fontWeight={500}
              textClass="text-[16px] text-brand-content leading-[24px] tracking-[0.64px]">
              {title}
            </CustomText>
            <CustomText
              fontWeight={500}
              textClass="text-xs text-theme-content-active leading-[18px] tracking-[0.48px]">
              {desc}
            </CustomText>
          </View>
          <View style={{ gap: 10 }} className="flex-row items-center">
            {icon || null}
            <CustomText
              fontWeight={700}
              className="text-[18px] text-brand-content leading-[27px] tracking-[0.72px]">
              {highlightText}
            </CustomText>
          </View>
        </View>
    </PressableBtn>
  );
};

export default HomeCarouselItem;
