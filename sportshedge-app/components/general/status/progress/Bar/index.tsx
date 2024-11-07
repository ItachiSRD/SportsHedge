import { View, ViewProps, DimensionValue } from 'react-native';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface IProgressBarProps extends ViewProps {
    progress?: number;
    containerClass?: string;
    progressClass?: string;
}

const ProgressBar = ({ progress = 10, containerClass, progressClass, ...props }: IProgressBarProps) => {
  const classes = twMerge(
    'flex-1 bg-[#ffffff1a] rounded overflow-hidden h-1 relative',
    containerClass
  );

  const progressClasses = twMerge(
    'absolute top-0 left-0 h-full bg-global-gray-20 rounded',
    progressClass
  );
  const progressWidth: DimensionValue = `${progress}%`;
  return (
    <View {...props} className={classes}>
      <View style={{ width: progressWidth }} className={progressClasses} />
    </View>
  );
};

export default ProgressBar;