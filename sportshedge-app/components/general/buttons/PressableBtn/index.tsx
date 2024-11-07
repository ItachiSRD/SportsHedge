import { Pressable, PressableProps } from 'react-native';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface IPressableBtnProps extends PressableProps {
   pressableClasses?: string;
}

const PressableBtn = ({ pressableClasses, children, ...props }: IPressableBtnProps) => {
  const classes = twMerge(
    'active:opacity-60',
    pressableClasses
  );

  return (
    <Pressable {...props} className={classes} accessibilityRole="button">
      {children}
    </Pressable>
  );
};

export default PressableBtn;