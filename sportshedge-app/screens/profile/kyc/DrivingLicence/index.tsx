import { View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackListT } from '@/types/navigation/RootStackParams';
import ScreenHeader from '@/components/general/ScreenHeader';
import Label from '@/components/general/inputs/Label';
import TextInput from '@/components/general/inputs/TextInput';
import React, { useState } from 'react';
import Button from '@/components/general/buttons/Button';
import BaseScreen from '@/screens/BaseScreen';
import DateField from '@/components/general/inputs/DateField';

type DrivingLicenceScreenPropsT = StackScreenProps<ProfileStackListT, 'DrivingLicenceKYC'>;

const DrivingLicenceScreen = ({navigation}: DrivingLicenceScreenPropsT) => {
  const [drivingLicenceNumber, setDrivingLicenceNumber] = useState('');

  const [date, setDate] = useState('');
  return(
    <BaseScreen>
      <View className="mx-[30px] mt-[22px]">
        <ScreenHeader
          title="Driving Licence Verification"
          handleGoBack={() => navigation.goBack()}
          textClass="text-[16px] leading-[24px] tracking-[0.64px]"
        />
        <View className="mt-[36px]">
          <Label
            labelTitleProps={{ className: 'text-theme-content-primary mb-[4px]', fontWeight: 400 }}
            title="Driving Licence Number"
          />
          <View className="flex-row w-full">
            <TextInput
              shape="rounded"
              maxLength={13}
              rootContainerClass="flex-1"
              autoFocus
              containerProps={{ className: 'py-3 border-[1px] border-theme-primary focus:border-theme-content-active' }}
              placeholder="Enter Driving Licence Number"
              inputMode="text"
              value={drivingLicenceNumber}
              onChangeText={(text) => setDrivingLicenceNumber(text.toUpperCase())}
            />
          </View>
          <View className="my-[40px]">
            <Label
              labelTitleProps={{ className: 'text-theme-content-primary mb-[4px]', fontWeight: 400 }}
              title="Date of Birth"
            />
            <View className="flex-row w-full">
              <DateField
                shape="rounded"
                rootContainerClass="flex-1"
                containerProps={{ className: 'border-[1px] border-outline-primary focus:border-theme-content-active' }}
                placeholder="dd-mm-yyyy"
                inputMode="numeric"
                value={date}
                onChangeText={setDate}
                isRange={false}
                maxLength={10}
              />
            </View>                  
          </View>
          <Button
            containerClass="border-theme-reverse rounded-[10px]"
            textClass="text-theme-reverse text-[16px] leading-[24px] tracking-[0.64px]"
            shape="rounded"
            variant="outlined"
            size="large"
            title="Confirm"
          />
        </View>
      </View>
    </BaseScreen>
  );
};

export default DrivingLicenceScreen;