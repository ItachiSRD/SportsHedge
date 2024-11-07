import React from 'react';
import PressableBtn, { IPressableBtnProps } from '../../buttons/PressableBtn';
import CustomText from '../../Text';
import RadioButton from '../radio/RadioButton';

interface IDropDownItemProps extends IPressableBtnProps {
    text: string;
    focused?: boolean;
}

const DropwDownItem = ({ text, focused = false, ...props }: IDropDownItemProps) => {
  return (
    <PressableBtn {...props} pressableClasses="flex-row items-center justify-between">
      <CustomText
        fontWeight={focused ? 500 : 400}
        textClass={`text-sm leading-[21px] tracking-[0.56px] ${focused ? 'text-brand-content' : 'text-global-gray-20'}`}>
        {text}
      </CustomText>
      <RadioButton focused={focused} />
    </PressableBtn>
  );
};

export default DropwDownItem;