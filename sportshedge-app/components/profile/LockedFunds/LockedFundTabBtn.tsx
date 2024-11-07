import React from 'react';
import PressableBtn, { IPressableBtnProps } from '@/components/general/buttons/PressableBtn';
import CustomText from '@/components/general/Text';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface ILockedFundTabBtnProps extends IPressableBtnProps {
    tabName: string;
    amount: number;
    isActive?: boolean;
}

const LockedFundTabBtn = ({ tabName, amount, isActive, pressableClasses, ...props }: ILockedFundTabBtnProps) => {
  const classes = twMerge(
    'py-3 px-4 w-1/2 justify-center items-center border-b border-transparent',
    clsx({
      'border-global-gray-20': isActive
    }),
    pressableClasses
  );

  const textClasses = clsx({
    'text-brand-content': isActive,
    'text-theme-content-secondary': !isActive
  });
  return (
    <PressableBtn
      {...props}
      style={{ gap: 4 }}
      pressableClasses={classes}>
      <CustomText
        fontWeight={500}
        textClass={`text-lg leading-[27px] text-center tracking-[0.72px] ${textClasses}`}
      >
        {tabName}
      </CustomText>
      <CustomText
        fontWeight={500}
        textClass={`text-base tracking-[0.64px] leading-[24px] ${textClasses}`}>
            ₹ {amount.toLocaleString('en-IN')}
      </CustomText>
    </PressableBtn>
  );
};

export default LockedFundTabBtn;