import { View, ViewProps, ActivityIndicator } from 'react-native';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { colors } from '@/styles/theme/colors';

interface ICustomLoaderProps extends ViewProps {
  containerClass?: string;
  color?: string;
  size?: number;
}

const CustomLoader = ({
  containerClass,
  color = colors['brand-content'],
  size = 30
}: ICustomLoaderProps) => {
  const classes = twMerge('py-5 px-5', containerClass);
  return (
    <View className={classes}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default CustomLoader;
