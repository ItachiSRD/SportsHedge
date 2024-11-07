import { View, ViewProps } from 'react-native';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import CustomText, { ICustomTextProps } from '../../Text';

interface ITextProps extends ICustomTextProps {
  className: string;
}

interface IBadgeProrps extends ViewProps {
  type?: 'dot' | 'text';
  text?: string;
  className?: string;
  textProps?: ITextProps;
}

const Badge = ({ type = 'dot', text, className, textProps, ...props }: IBadgeProrps) => {
  const classes = twMerge(
    'bg-negative',
    clsx({
      'py-[1px] px-1 rounded-2 border border-theme-primary': type === 'text',
      'w-2 h-2 rounded-full': type === 'dot'
    }),
    className
  );

  const textClasses = twMerge('text-white text-[10px]', textProps?.className);

  return (
    <View {...props} className={classes}>
      {type === 'text' ? (
        <CustomText {...textProps} textClass={textClasses}>
          {text}
        </CustomText>
      ) : null}
    </View>
  );
};

export default Badge;
