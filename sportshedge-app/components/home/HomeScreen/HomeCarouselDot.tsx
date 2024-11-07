import clsx from 'clsx';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface IHomeCarouselDotProps {
    active?: boolean;
}

const HomeCarouselDot = ({ active }: IHomeCarouselDotProps) => {
  const classes = twMerge(
    'w-2.5 h-[5px] rounded-full bg-theme-reverse-content-secondary',
    clsx({
      'bg-global-gray-20': active
    })
  );

  return (
    <View className={classes} />
  );
};

export default HomeCarouselDot;