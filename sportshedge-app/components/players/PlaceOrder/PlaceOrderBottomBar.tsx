import { View } from 'react-native';
import Button, { IButtonProps } from '@/components/general/buttons/Button';
import CustomText from '@/components/general/Text';
import { TransactionSideT } from '@/types/entities/order';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface IPlaceOrerBottomBarProps {
    transactionType: TransactionSideT;
    totalOrderValue?: number;
    handlePlaceOrder?: () => void;
    handleViewDetails?: () => void;
    btnProps?: IButtonProps;
}

const PlaceOrderBottomBar = ({ transactionType, btnProps, totalOrderValue = 0, handlePlaceOrder, handleViewDetails }: IPlaceOrerBottomBarProps) => {

  const btnTitle = transactionType === 'buy' ? 'Place Buy Order' : 'Place Sell Order';

  const containerClasses = twMerge(
    'rounded-[10px]',
    clsx({
      'bg-[#29A86D]': transactionType === 'buy',
      'bg-[#DA5C54]': transactionType === 'sell',
      'opacity-50': btnProps?.disabled
    })
  );

  return (
    <View className="p-[30px] flex-row items-center justify-between">
      <View style={{ gap: 5 }}>
        <CustomText fontWeight={700} textClass="text-base text-brand-content">₹ {totalOrderValue}</CustomText>
        <Button
          variant="ghost"
          title="View Details"
          onPress={handleViewDetails}
          textClass="text-theme-content-primary"
          textProps={{ fontWeight: 500 }}
        />
      </View>
      <Button
        {...btnProps}
        title={btnTitle}
        onPress={handlePlaceOrder}
        size="large"
        shape="rounded"
        containerClass={containerClasses}
        textClass='text-[16px] text-white'
        textProps={{ fontWeight: 700 }}
      />
    </View>
  );
};

export default PlaceOrderBottomBar;