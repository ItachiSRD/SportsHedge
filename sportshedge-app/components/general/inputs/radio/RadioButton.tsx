import { View } from 'react-native';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface IRadioButtonProps {
    focused?: boolean;
}

const RadioButton = ({ focused = false }: IRadioButtonProps) => {
  const containerClass = twMerge(
    'justify-center items-center w-5 h-5 rounded-full border border-outline-primary p-0.5',
    clsx({
      'border-brand-content': focused
    })
  );

  return (
    <View className={containerClass}>
      {focused ? <View className="w-3 h-3 rounded-full bg-brand-content" /> : null}
    </View>
  );
};

export default RadioButton;