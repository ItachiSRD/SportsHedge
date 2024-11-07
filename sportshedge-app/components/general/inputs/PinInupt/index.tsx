import { View, Animated, ViewProps, StyleProp, ViewStyle } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  RenderCellOptions
} from 'react-native-confirmation-code-field';
import pinInputStyles from './styles';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import CustomText from '../../Text';
import { FONTS } from '@/styles/theme/fonts';

const { Text: AnimatedText } = Animated;

interface IPinInputProps extends ViewProps {
  cellCount?: number;
  containerStyle?: StyleProp<ViewStyle>;
  secret?: boolean;
  shape?: 'rounded' | 'pill';
  status?: 'error' | 'disabled';
  statusMessage?: string;
  rootContainerClassName?: string;
  cellClassName?: string;
  textClassName?: string;
  disabled?: boolean;
  value?: string;
  showPlaceHolder?: boolean;
  setValue: (text: string) => void;
}

const PinInput = ({
  cellCount = 4,
  secret = false,
  disabled = false,
  showPlaceHolder = false,
  value,
  setValue,
  shape,
  status,
  statusMessage,
  cellClassName,
  textClassName,
  rootContainerClassName,
  containerStyle
}: IPinInputProps) => {
  const ref = useBlurOnFulfill({ value, cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue
  });
  const renderCell = ({ index, symbol, isFocused }: RenderCellOptions) => {
    const cellClass = twMerge(
      'flex-1 flex-row items-center justify-center text-center rounded-2 bg-theme-primary border border-theme-reverse-content-secondary h-10',
      clsx({
        rounded: shape === 'rounded',
        'rounded-full': shape === 'pill',
        'border-negative': status === 'error',
        'border-theme-content-active': isFocused,
        'bg-disabled-primary border-0': disabled
      }),
      cellClassName
    );

    const textClasses = twMerge(
      'w-full h-full text-brand  leading-6 p-2 text-center',
      textClassName
    );
    return (
      <View key={index} className={cellClass} onLayout={getCellOnLayoutHandler(index)}>
        {symbol ? (
          <>
            {secret ? (
              <View className="flex-1 rounded-full bg-theme-content-primary" />
            ) : (
              <CustomText textClass={`${disabled ? 'text-disabled-primary' : 'text-theme-content-primary'} text-base leading-6`}>{symbol}</CustomText>
            )}
          </>
        ) : (
          <AnimatedText
            className={textClasses}
            style={{ fontFamily: FONTS.urbanist[400] }}
          >
            {(isFocused && !disabled) ? <Cursor /> : null}
            {showPlaceHolder ? <CustomText textClass="text-theme-content-secondary">-</CustomText> : null}
          </AnimatedText>
        )}
      </View>
    );
  };

  return (
    <View className={rootContainerClassName}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={cellCount}
        rootStyle={[pinInputStyles.codeFiledRoot, containerStyle]}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
      {status === 'error' ? <CustomText textClass="text-negative text-xs">{statusMessage}</CustomText> : null}
    </View>
  );
};

export default PinInput;
