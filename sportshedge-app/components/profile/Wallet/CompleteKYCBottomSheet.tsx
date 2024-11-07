import CompleteKYC from '@/assets/icons/complete_kyc.svg';
import CustomBottomSheet from '@/components/general/BottomSheet';
import CustomText from '@/components/general/Text';
import Button from '@/components/general/buttons/Button';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';

type ICompleteKYCBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
};

const CompleteKYCBottomSheet = ({ bottomSheetRef }: ICompleteKYCBottomSheetProps) => (
  <CustomBottomSheet ref={bottomSheetRef} containerClass="px-0">
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#17171A', 'rgba(61, 61, 61, 0.4)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}>
        <View className="flex-1 justify-end items-center pb-6">
          <CompleteKYC width={250} height={100} />
        </View>
      </LinearGradient>
    </View>
    <View style={{ flex: 1 }} className="px-[30px] pt-[30px]">
      <CustomText
        fontWeight={700}
        textClass="text-[16px] text-theme-reverse tracking-[0.64px] leading-[24px]">
          Complete KYC to withdraw funds
      </CustomText>
      <CustomText textClass="text-[14px] text-global-gray-20 tracking-[0.64px] leading-[21px] py-2">
          To withdraw funds, KYC is required for bank transfers as per government regulations
      </CustomText>
      <View className="flex-1 flex-row justify-between pt-6">
        <Button
          containerClass="border-brand-content rounded-lg w-[45%]"
          textClass="text-base text-brand-content tracking-[0.64px] leading-[24px]"
          textProps={{ fontWeight: 500 }}
          variant="outlined"
          size="large"
          title="Cancel"
          onPress={() => bottomSheetRef?.current?.close()}
        />
        <Button
          containerClass="border-theme-reverse bg-theme-reverse rounded-lg w-[45%]"
          textClass="text-secondary text-base tracking-[0.64px] leading-[24px]"
          textProps={{ fontWeight: 500 }}
          variant="outlined"
          size="large"
          title="Do KYC Now"
          onPress={() => bottomSheetRef?.current?.close()}
        />
      </View>
    </View>
  </CustomBottomSheet>
);

export default CompleteKYCBottomSheet;
