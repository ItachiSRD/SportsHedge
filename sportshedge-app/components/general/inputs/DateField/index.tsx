import {
  View,
  TextInput as RNTextInput,
  TextInputProps,
  ViewProps,
} from 'react-native';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { DateFieldStyles } from './style';
import { colors } from '../../../../styles/theme/colors';
import CustomText from '../../Text';
  
import CalendarIcon from '@/assets/icons/Calendar.svg';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg';
import DatePicker from 'react-native-date-picker';
import ErrorIcon from '@/assets/icons/error-icon.svg';
  
interface IContainerProps extends ViewProps {
  className: string;
}

interface IDateFieldProps extends TextInputProps {
  containerProps?: IContainerProps;
  rootContainerClass?: string;
  textClass?: string;
  shape?: 'rounded' | 'pill';
  status?: 'disabled' | 'error' | 'success' | 'loading' | 'default';
  statusMsg?: string;
  isRange?: boolean;
}

const DateField = ({
  textClass,
  shape,
  status,
  statusMsg,
  isRange,
  rootContainerClass,
  containerProps,
  ...props
}: IDateFieldProps) => {
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const toggleCalendar = () => {
    setShowDatePicker(!showDatePicker);
  };
  
  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    setInputValue(formatDate(newDate)); 
  };
  const handleInputChange = (text: string) => {
    setInputValue(text);
  };
  
  const textclasses = twMerge(
    'flex-1 text-sm text-theme-content-primary leading-[21px] tracking-[0.56px]',
    textClass
  );
  const containerClasses = twMerge(
    'flex-row items-center py-3 pl-4 pr-2 bg-theme-primary',
    clsx({
      'rounded-[10px]': shape === 'rounded',
      'rounded-[30px]': shape === 'pill',
      'border border-negative': status === 'error',
      'border border-positive': status === 'success',
      'border border-transparent': status === 'default',
    }),
    containerProps?.className
  );
  
  const statusTextClasses = twMerge(
    'text-xs mt-1',
    clsx({
      'text-negative': status === 'error',
      'text-positive': status === 'success',
    })
  );
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };
  
  return (
    <View className={rootContainerClass}>
      <View
        {...containerProps}
        style={[containerProps?.style, { gap: 8 }]}
        className={containerClasses}
      >
        <RNTextInput
          testID="input1"
          placeholder="Type here"
          placeholderTextColor={colors['theme-content-secondary']}
          selectionColor={colors.brand}
          {...props}
          style={[props.style, DateFieldStyles.input]}
          className={textclasses}
          onChangeText={handleInputChange}
          value={inputValue}
        />
        {isRange ? (
          <>
            <ArrowRightIcon
              width={20}
              height={20}
              fill={colors['theme-content-secondary']}
            />
            <RNTextInput
              testID="input2"
              placeholder="Type here"
              placeholderTextColor={colors['theme-content-secondary']}
              selectionColor={colors.brand}
              {...props}
              style={[props.style, DateFieldStyles.input]}
              className={textclasses}
            />
          </>
        ) : null}
        {status === 'error' ? (
          <ErrorIcon className="w-5 h-5 min-w-5 min-h-5" />
        ) : null}
        <CalendarIcon
          onPress={toggleCalendar} 
          width={20}
          height={20}
          fill={colors['theme-content-secondary']}
        />
      </View>
      <View>
        {!isRange && showDatePicker && (
          <DatePicker
            modal
            open={showDatePicker}
            mode="date"
            date={date ? date : new Date()}
            locale="en-GB"
            onCancel={toggleCalendar}
            onConfirm={handleDateChange}
            fadeToColor="none"
            textColor={colors['theme-content-primary']}
            title={null}
            theme='dark'
          />
        )}
      </View>
          
      {status && ['error', 'success', 'default'].includes(status) ? (
        <CustomText textClass={statusTextClasses}>{statusMsg}</CustomText>
      ) : null}
    </View>
  );
};
  
export default DateField;