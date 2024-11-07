import { View, TextInput, TextInputProps, ViewProps } from 'react-native';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { colors } from '../../../../styles/theme/colors';
import { textAreaStyles } from './style';
import CustomText from '../../Text';

interface IContainerProps extends ViewProps {
  className: string;
}

interface ITextAreaProps extends TextInputProps {
  maxChars?: number;
  status?: 'error' | 'disabled';
  statusMessage?: string;
  className?: string;
  containerProps?: IContainerProps;
  disabled?: boolean;
}

const TextArea = ({
  maxChars,
  status,
  disabled = false,
  value,
  onChangeText,
  className,
  statusMessage,
  containerProps,
  ...props
}: ITextAreaProps) => {
  const [text, setText] = useState(value || '');

  const handleTextChange = (txt: string) => {
    if (maxChars && txt.length > maxChars) return;
    setText(txt);
    if (onChangeText) {
      onChangeText(txt);
    }
  };

  const classes = twMerge('flex-1 text-sm caret-brand max-h-[100px] overflow-auto', className);

  const containerClasses = twMerge(
    'w-full py-2 px-4 bg-theme-primary rounded border border-outline-primary',
    clsx({
      'border border-negative': status === 'error',
      'border-0 bg-disabled-secondary': disabled
    }),
    containerProps?.className
  );

  return (
    <View className="w-full">
      <View className={containerClasses}>
        <View className="w-full flex-row">
          <TextInput
            multiline
            placeholder="Type here"
            placeholderTextColor={
              disabled ? colors['disabled-primary'] : colors['theme-content-secondary']
            }
            style={[
              props.style,
              textAreaStyles.input,
              disabled && { color: colors['disabled-primary'] }
            ]}
            selectionColor={colors.brand}
            {...props}
            value={text}
            onChangeText={handleTextChange}
            inputMode="text"
            className={classes}
          />
        </View>
        {maxChars ? (
          <CustomText
            textClass={`mt-1 text-xs self-end leading-[18px] ${
              disabled ? 'text-disabled-primary' : 'text-theme-content-secondary'
            }`}>
            ({text.length}/{maxChars})
          </CustomText>
        ) : null}
      </View>
      {status === 'error' ? (
        <CustomText textClass="text-xs text-negative mt-1">{statusMessage}</CustomText>
      ) : null}
    </View>
  );
};

export default TextArea;
