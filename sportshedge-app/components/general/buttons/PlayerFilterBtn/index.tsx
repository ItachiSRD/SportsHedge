import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import ActiveFilterIcon from '@/assets/icons/active-filter.svg';
import CustomText, { ICustomTextProps } from '@/components/general/Text';
import React from 'react';
import { SvgProps } from 'react-native-svg';
import { playerFilterBtnStyles } from './styles';
import PressableBtn, { IPressableBtnProps } from '@/components/general/buttons/PressableBtn';
import { twMerge } from 'tailwind-merge';
import { View } from 'react-native';

interface IPlayerFilterProps extends IPressableBtnProps {
  title?: string;
  iconProps?: SvgProps;
  textProps?: ICustomTextProps;
  filterChanged?: boolean;
}

const PlayersFilterBtn = ({
  title,
  iconProps,
  style,
  pressableClasses,
  textProps,
  filterChanged,
  ...props
}: IPlayerFilterProps) => {
  const pressableStyles =
    typeof style === 'object'
      ? { ...playerFilterBtnStyles.pressable, ...style }
      : playerFilterBtnStyles.pressable;

  const pressableClass = twMerge('flex-row justify-center items-center', pressableClasses);

  return (
    <PressableBtn {...props} style={pressableStyles} pressableClasses={pressableClass}>
      <View className="relative">
        <CustomText {...textProps}>{title}</CustomText>
        {filterChanged ? <ActiveFilterIcon className="absolute -right-2" /> : <></>}
      </View>
      <ChevronRightIcon {...iconProps} />
    </PressableBtn>
  );
};

export default PlayersFilterBtn;
