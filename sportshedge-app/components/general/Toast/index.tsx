import React, { useEffect, useState } from 'react';
import { Animated, View, ViewProps } from 'react-native';
import CustomText from '../Text';
import WarningIcon from '@/assets/icons/warning.svg';
import InfoIcon from '@/assets/icons/info.svg';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export type ToastStateT = {
  visible: boolean;
  type?: 'error'  | 'info';
  message?: string;
}

interface IToastProps extends ViewProps {
  message?: string;
  type?: 'error' | 'info';
  visible?: boolean;
  duration?: number;
  bottomOffset?: number;
  onClose: () => void;
}

const icons = {
  error: WarningIcon,
  info: InfoIcon
};

const Toast = ({
  message = '',
  type,
  bottomOffset = 0,
  visible,
  duration = 3000,
  onClose
}: IToastProps) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false
      }).start();

      setTimeout(() => {
        onClose();
      }, duration);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      }).start();
    }
  }, [visible]);

  const containerClasses = twMerge(
    'p-2 rounded flex-row items-center bg-global-gray-80',
    clsx({
      'bg-negative': type === 'error'
    })
  );

  const textClasses = twMerge(
    'text-theme-content-primary leading-[21px] tracking-[0.56px]',
    clsx({
      'text-brand-content': type === 'error'
    })
  );

  const Icon = type && icons[type];

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        bottom: 16 + bottomOffset
      }}
      className="absolute w-full px-[30px]">
      <View style={{ gap: 8 }} className={containerClasses}>
        {Icon ? <Icon /> : null}
        <CustomText textClass={textClasses}>
          {message}
        </CustomText>
      </View>
    </Animated.View>
  );
};

export default Toast;
