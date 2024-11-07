import { View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackListT } from '@/types/navigation/RootStackParams';
import ScreenHeader from '@/components/general/ScreenHeader';
import Label from '@/components/general/inputs/Label';
import TextInput from '@/components/general/inputs/TextInput';
import React, { useState } from 'react';
import CustomText from '@/components/general/Text';
import Button from '@/components/general/buttons/Button';
import BaseScreen from '@/screens/BaseScreen';
import { colors } from '@/styles/theme/colors';
import PinInput from '@/components/general/inputs/PinInupt';
import ResendOtpTimer from '@/components/auth/ResendOtpTimer';

type AadharScreenPropsT = StackScreenProps<ProfileStackListT, 'AadharKYC'>;

const AadharScreen = ({navigation}: AadharScreenPropsT) => {

  const [aadharNumber, setAadharNumber] = useState('');
  const confirmAadhar = false;
  const [resendOtp, setResendOtp] = useState(false);
  const [code, setCode] = useState('');

  return(
    <BaseScreen>
      <View className="mx-[30px] mt-[22px]">
        <ScreenHeader
          title="Aadhar Card Verification"
          handleGoBack={() => navigation.goBack()}
          textClass="text-[16px] leading-[24px] tracking-[0.64px]"
        />
        {!confirmAadhar ? (
          <>
            <View className="my-[36px]">
              <Label
                labelTitleProps={{ className: 'text-theme-content-primary mb-[4px]', fontWeight: 400 }}
                title="Aadhar Card Number"
              />
              <View className="flex-row w-full">
                <TextInput
                  shape="rounded"
                  maxLength={12}
                  rootContainerClass="flex-1"
                  autoFocus
                  containerProps={{ className: 'bg-theme-primary py-3 border-[1px] border-theme-primary focus:border-theme-content-active' }}
                  placeholder="Enter Aadhar Card Number"
                  inputMode="tel"
                  value={aadharNumber}
                  onChangeText={setAadharNumber}
                />
              </View>
              <CustomText textClass="text-xs leading-[18px] tracking-[0.48px] text-theme-content-active mt-[8px]">
                                        You will receive OTP on your registered mobile number
              </CustomText>
              <Button
                containerClass="border-theme-reverse mt-[40px] rounded-[10px]"
                textClass="text-theme-reverse text-[16px] leading-[24px] tracking-[0.64px]"
                shape="rounded"
                variant="outlined"
                size="large"
                title="Continue"
              />
                                
            </View>
            <CustomText textClass="text-[16px] leading-[24px] tracking-[0.64px] text-theme-reverse">
                                Referral Rewards
            </CustomText>
          </>
        ) : (
          <> 
            <View className="mt-[36px]">
              <CustomText textClass="text-[14px] leading-[21px] tracking-[0.56px] text-theme-reverse">
                                    Please enter OTP sent to your Aadhar registered mobile number
              </CustomText>
              <PinInput
                rootContainerClassName="my-[20px]"
                cellClassName="h-[50px] border-0 rounded-[10px]"
                textClassName="py-3"
                cellCount={6}
                containerStyle={{ gap: 6 }}
                value={code}
                setValue={setCode}
                shape="rounded"
              />
              <View className="flex-row items-center justify-between">
                {!resendOtp ? <ResendOtpTimer textClass="leading-[18px] tracking-[0.48px]" timeOut={120} canResendOtp={setResendOtp} text="Resend OTP in" /> : (
                  <Button
                    textClass="text-brand-content text-xs leading-[18px]"
                    containerClass="self-start"
                    variant="ghost"
                    title="Resend OTP"
                  />
                )}
              </View>
              <Button
                containerClass="border-theme-reverse mt-[44px] rounded-[10px]"
                textClass="text-theme-reverse text-[16px] leading-[24px] tracking-[0.64px]"
                shape="rounded"
                variant="outlined"
                size="large"
                title="Confirm"
                loaderColor={colors['theme-reverse']}
              />
            </View>
          </>
        )}
      </View>
    </BaseScreen>
  );
};
export default AadharScreen;