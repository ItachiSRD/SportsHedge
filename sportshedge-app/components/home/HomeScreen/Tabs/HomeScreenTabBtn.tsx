import React from 'react';
import PressableBtn, { IPressableBtnProps } from '@/components/general/buttons/PressableBtn';
import CustomText from '@/components/general/Text';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface IHomeScreenTabBtnProps extends IPressableBtnProps {
    tabName: string;
    isActive?: boolean;
}

const HomeScreenTabBtn = ({ tabName, isActive, pressableClasses, ...props }: IHomeScreenTabBtnProps) => {
  const classes = twMerge(
    'py-3 px-4 w-1/2 justify-center items-center border-b border-transparent',
    clsx({
      'border-global-gray-20': isActive
    }),
    pressableClasses
  );

  const textClasses = clsx({
    'text-global-gray-20': isActive,
    'text-theme-content-secondary': !isActive
  });
  return (
    <PressableBtn
      {...props}
      style={{ gap: 4 }}
      pressableClasses={classes}>
      <CustomText
        fontWeight={700}
        textClass={`text-[14px] leading-[21px] text-center tracking-[0.56px] ${textClasses}`}
      >
        {tabName}
      </CustomText>
    </PressableBtn>
  );
};

export default HomeScreenTabBtn;