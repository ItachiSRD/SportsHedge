import CustomText, { ICustomTextProps } from '@/components/general/Text';
import { twMerge } from 'tailwind-merge';


const HeaderText = ({ textClass, children, ...props }: ICustomTextProps) => {
  const classes = twMerge(
    'flex-1 text-xs text-theme-content-active leading-[18px] tracking-[0.48px]',
    textClass
  );

  return (
    <CustomText {...props} textClass={classes}>{children}</CustomText>
  );
};

export default HeaderText;