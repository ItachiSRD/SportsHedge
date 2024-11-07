import { View, ViewProps } from 'react-native';
import React from 'react';
import CustomText, { ICustomTextProps } from '../Text';
import PressableBtn from '../buttons/PressableBtn';
import CrossIcon from '@/assets/icons/X.svg';
import { colors } from '@/styles/theme/colors';
import { twMerge } from 'tailwind-merge';
import { SvgProps } from 'react-native-svg';

interface ITagProps extends ViewProps {
  title: string;
  showRemove?: boolean;
  handleRemove?: () => void;
  containerClass?: string;
  textClass?: string;
  textProps?: ICustomTextProps;
  iconProps?: SvgProps;
}

const Tag = ({
  title,
  showRemove = false,
  handleRemove,
  containerClass,
  textClass,
  textProps,
  iconProps,
  style,
  ...props
}: ITagProps) => {
  const classes = twMerge(
    'flex-row items-center bg-global-gray-80 rounded-[20px] py-[3px] px-3',
    containerClass
  );

  const textClasses = twMerge(
    'text-brand-content text-xs leading-[18px] tracking-[0.48px]',
    textClass
  );

  return (
    <View {...props} style={[{ gap: 8 }, style]} className={classes}>
      <CustomText {...textProps} textClass={textClasses}>
        {title}
      </CustomText>
      {showRemove ? (
        <PressableBtn onPress={handleRemove}>
          <CrossIcon fill={colors['brand-content']} width={12} height={12} {...iconProps} />
        </PressableBtn>
      ) : null}
    </View>
  );
};

export default Tag;
