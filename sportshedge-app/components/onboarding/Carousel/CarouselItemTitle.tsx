import CustomText, { ICustomTextProps } from '@/components/general/Text';
import { twMerge } from 'tailwind-merge';

interface ICarouselItemTitle extends ICustomTextProps {
  title?: string;
  className?: string;
}

const CarouselItemTitle = ({
  title,
  className,
  ...props
}: ICarouselItemTitle) => {

  const classes = twMerge(
    'text-brand-content text-[22px] leading-[33px] tracking-[1.1px]',
    className
  );
  return (
    <CustomText fontWeight={300} {...props} textClass={classes}>{title}</CustomText>
  );
};

export default CarouselItemTitle;
