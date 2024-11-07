import React from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import CustomBottomSheet from '@/components/general/BottomSheet';
import CustomText from '@/components/general/Text';
import BottomSheetLaunchCard from '@/components/general/BottomSheet/BottomSheetLaunchCard';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackListT } from '@/types/navigation/RootStackParams';

type navigationPropT =  StackNavigationProp<ProfileStackListT>;

interface IKycBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
}

const KycBottomSheet: React.FC<IKycBottomSheetProps> = ({ bottomSheetRef }) => {
  const navigation = useNavigation<navigationPropT>();
  return (
    <CustomBottomSheet ref={bottomSheetRef}>
      <View style={{ gap: 30 }}>
        <CustomText textClass="text-base text-brand-content"> Complete KYC with,</CustomText>
        <BottomSheetLaunchCard
          providerName="Aadhar Card"
          providerIcon={undefined}
          textClass='ml-0 pl-[4px]'
          onPress={() => {
            bottomSheetRef.current?.dismiss();
            navigation.navigate('AadharKYC')
          }}
        />
        <BottomSheetLaunchCard
          providerName="Driving Licence"
          providerIcon={undefined}
          textClass='ml-0 pl-[4px]'
          onPress={() => {
            bottomSheetRef.current?.dismiss();
            navigation.navigate('DrivingLicenceKYC')
          }}
        />
      </View>
    </CustomBottomSheet>
  );
};

export default KycBottomSheet;