import clsx from 'clsx';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ICarouselDotProps {
    active?: boolean;
}

const CarouselDot = ({ active }: ICarouselDotProps) => {
  const classes = twMerge(
    'w-2 h-1 rounded-[50px] bg-outline-secondary mr-2 last-of-type:mr-0',
    clsx({
      'w-[13.3px] bg-theme-content-active': active
    })
  );
  return (
    <View className={classes} />
  );
};

export default CarouselDot;