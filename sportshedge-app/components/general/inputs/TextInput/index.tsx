import {
  View,
  Image,
  TextInput as RNTextInput,
  TextInputProps,
  ViewProps
} from 'react-native';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { textInputStyles } from './style';
import { colors } from '../../../../styles/theme/colors';
import CustomText from '../../Text';

interface IContainerProps extends ViewProps {
  className: string;
}

interface ITextInputProps extends TextInputProps {
  containerProps?: IContainerProps;
  rootContainerClass?: string;
  textClass?: string;
  shape?: 'rounded' | 'pill';
  status?: 'disabled' | 'error' | 'success' | 'loading' | 'default';
  statusMsg?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const TextInput = ({
  textClass,
  shape,
  status,
  statusMsg,
  prefix,
  suffix,
  rootContainerClass,
  containerProps,
  ...props
}: ITextInputProps) => {
  const classes = twMerge('flex-1 text-sm caret-brand text-theme-content-primary', textClass);

  const containerClasses = twMerge(
    'flex-row items-center py-[10.5] pl-4 pr-2 bg-theme-primary',
    clsx({
      'rounded-[10px]': shape === 'rounded',
      'rounded-[30px]': shape === 'pill',
      'border border-negative': status === 'error',
      'border border-positive': status === 'success',
      'border border-transparent': status === 'default'
    }),
    containerProps?.className
  );

  const statusTextClasses = twMerge(
    'text-xs mt-1',
    clsx({
      'text-negative': status === 'error',
      'text-positive': status === 'success'
    })
  );

  return (
    <View className={rootContainerClass}>
      <View {...containerProps} style={[containerProps?.style, { gap: 8 }]} className={containerClasses}>
        {prefix || null}
        <RNTextInput
          testID="input"
          placeholder="Type here"
          placeholderTextColor={colors['theme-content-secondary']}
          selectionColor={colors.brand}
          {...props}
          style={[props.style, textInputStyles.input]}
          className={classes}
        />
        {status === 'success' ? (
          <Image
            className="w-5 h-5 min-w-5 min-h-5"
            source={require('../../../../assets/icons/TickRoundedGreen.png')}
          />
        ) : null}
        {suffix || null}
      </View>
      {status && ['error', 'success', 'default'].includes(status) ? (
        <CustomText textClass={statusTextClasses}>{statusMsg}</CustomText>
      ) : null}
    </View>
  );
};

export default TextInput;
