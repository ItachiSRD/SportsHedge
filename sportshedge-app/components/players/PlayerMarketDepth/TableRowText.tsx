import CustomText, { ICustomTextProps } from '@/components/general/Text';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface ITableRowTextProps extends ICustomTextProps {
    type?: 'buy' | 'sell';

}

const TableRowText = ({ type = 'buy', textClass, children, ...props }: ITableRowTextProps) => {
  const classes = twMerge(
    'flex-1 text-xs leading-[18px]',
    clsx({
      'text-global-green-40': type === 'buy',
      'text-global-red-40': type === 'sell',
    }),
    textClass
  );

  return (
    <CustomText {...props} textClass={classes}>{children}</CustomText>
  );
};

export default TableRowText;