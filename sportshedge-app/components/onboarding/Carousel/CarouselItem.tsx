import { View, ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ICarouselItemProps extends ViewProps {
    className?: string;
}

const CarouselItem = ({ className, children, ...props }: ICarouselItemProps) => {
  const classes = twMerge(
    'flex-1 bg-transparent justify-between px-[30px]',
    className
  );
  return (
    <View {...props} className={classes}>
      <View className="flex-1 mb-[46px]">
        {children}
      </View>
    </View>
  );
};

export default CarouselItem;