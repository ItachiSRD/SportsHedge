import { forwardRef, RefObject } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import BottomsheetHeader from '@/components/general/BottomSheet/BottomsheetHeader';
import CustomBottomSheet from '@/components/general/BottomSheet';
import CustomText from '@/components/general/Text';
import { LIMIT_TRANSACTION_FEE_PERCENTAGE } from '@/constants/order';

import InfoCircle from '@/assets/icons/info-circle.svg';

interface IPriceDetailsBottomSheetProps {
  handleSheetChanges?: (index: number) => void;
  orderValue?: number;
  transactionFee?: number;
}

const PriceDetailsBottomSheet = forwardRef<BottomSheetModal, IPriceDetailsBottomSheetProps>(
  function PriceDetailsBottomSheet(props, ref) {
    // ref
    const bottomSheetModalRef = ref as RefObject<BottomSheetModal>;

    const { orderValue = 0, transactionFee = 0 } = props;

    return (
      <CustomBottomSheet containerClass="p-0 mt-0" ref={bottomSheetModalRef} customHeader contentHeight={250}>
        <View className="flex-1">
          <BottomsheetHeader
            title="Trade Details"
            handleClose={() => bottomSheetModalRef.current?.close()}
          />
          <View style={{ gap: 20 }} className="flex-1 p-[30px]">
            <View className="flex-row items-center justify-between">
              <CustomText textClass="text-global-gray-20">Order Value</CustomText>
              <CustomText textClass="text-global-gray-20">{orderValue}</CustomText>
            </View>
            <View className="flex-row items-center justify-between">
              <View style={{ gap: 4 }} className="flex-row items-center">
                <CustomText textClass="text-global-gray-20">Fee ({LIMIT_TRANSACTION_FEE_PERCENTAGE}%)</CustomText>
                <InfoCircle width={16} height={16}/>
              </View>
              <CustomText textClass="text-global-gray-20">{transactionFee}</CustomText>
            </View>
            <View className="h-[1px] bg-theme-primary" />
            <View className="flex-row items-center justify-between">
              <CustomText fontWeight={500} textClass="text-brand-content text-base">
                Total
              </CustomText>
              <CustomText fontWeight={500} textClass="text-brand-content text-base">
                ₹ {orderValue + transactionFee}
              </CustomText>
            </View>
          </View>
        </View>
      </CustomBottomSheet>
    );
  }
);

export default PriceDetailsBottomSheet;
