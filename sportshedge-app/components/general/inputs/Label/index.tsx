import { View, Image, Pressable, ImageSourcePropType, GestureResponderEvent } from 'react-native';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import Badge from '../../status/Badge';
import CustomText, { ICustomTextProps } from '../../Text';

interface ILabelTitleProps extends ICustomTextProps {
    className?: string;
}

interface IHelperTextProps extends ICustomTextProps {
    className?: string;
}

interface ILabelProps {
    required?: boolean;
    title: string;
    iconSrc?: ImageSourcePropType;
    onIconPress?: ((event: GestureResponderEvent) => void) | null | undefined;
    helperText?: string;
    labelTitleProps?: ILabelTitleProps;
    helperTextProps?: IHelperTextProps;
}

const Label = ({ required, title, iconSrc, onIconPress, helperText, labelTitleProps, helperTextProps }: ILabelProps) => {
  const labelClasses = twMerge(
    'text-sm leading-[21px] tracking-[0.56px] text-theme-content-primary',
    labelTitleProps?.className
  );

  const helperTextClasses = twMerge(
    'text-xs text-theme-content-secondary',
    helperTextProps?.className
  );

  return (
    <View>
      <View className="gap-1 flex-row items-center">
        {required ? <Badge testID='badge' /> : null}
        <CustomText fontWeight={700} {...labelTitleProps} textClass={labelClasses}>{title}</CustomText>
        {iconSrc ? (
          <Pressable testID='icon' onPress={onIconPress} className="active:opacity-70">
            <Image className="w-6 h-6" source={iconSrc} />
          </Pressable>
        ) : null}
      </View>
      {helperText ? <CustomText textClass={helperTextClasses} {...helperTextProps}>{helperText}</CustomText> : null}
    </View>
  );
};

export default Label;