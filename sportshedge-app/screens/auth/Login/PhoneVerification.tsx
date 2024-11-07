import { useState } from 'react';
import { View } from 'react-native';
import { usePhoneVerification } from '@/hooks/auth/usePhoneVerification';
import TextInput from '@/components/general/inputs/TextInput';
import Button from '@/components/general/buttons/Button';
import PinInput from '@/components/general/inputs/PinInupt';
import ResendOtpTimer from '@/components/auth/ResendOtpTimer';
import Referral from '@/components/onboarding/Referral';
import AuthProviders from '@/components/onboarding/AuthProviders';
import { colors } from '@/styles/theme/colors';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import CustomText from '@/components/general/Text';
import { saveUserDataToLocalStorage } from '@/utils/local-storage';
import { useAppSelector } from '@/store/index';

interface IPhoneVerificationProps {
  onlyPhoneVerification?: boolean;
  linkAccount?: boolean;
}

const PhoneVerification = ({ onlyPhoneVerification, linkAccount }: IPhoneVerificationProps) => {
  const countryCode = '+91';
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [resendOtp, setResendOtp] = useState(false);
  const { code, confirm, setConfirm, setCode, phoneLoginState, confirmationState, verifyPhoneNumber, confirmCode } = usePhoneVerification();
  const { registartionStatus } = useAppSelector((state) => state.userSlice);

  const handleSubmitPhoneNumber = async () => {
    if (!phoneNumber) return;
    await verifyPhoneNumber(`${countryCode}${phoneNumber}`);
    await saveUserDataToLocalStorage({
      userInp: { referralCode: referralCode || undefined, countryCode, number: phoneNumber }
    });
  };

  const handleOtpSubmit = async () => {
    return confirmCode(linkAccount);
  };

  const handleGoback = () => setConfirm(undefined);

  if (!confirm) {
    return (
      <View style={{gap: 102}} className='items-center'>
        <View className='items-center'>
          <View style={{gap: 12}} className="flex-row w-full items-center">
            <CustomText disabled={phoneLoginState.status === 'pending'} textClass="px-4 py-[13px] text-theme-content-primary bg-theme-primary rounded-[10px] leading-[24px]">
              {countryCode}
            </CustomText>
            <TextInput
              shape="rounded"
              maxLength={10}
              rootContainerClass="flex-1"
              containerProps={{ className: 'bg-theme-primary py-3' }}
              placeholder="Enter Mobile Number"
              inputMode="tel"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <Button
              containerClass="border-theme-reverse rounded-[10px]"
              textClass="text-theme-reverse"
              shape="rounded"
              variant="outlined"
              size="large"
              onPress={handleSubmitPhoneNumber}
              loading={phoneLoginState.status === 'pending'}
              disabled={phoneLoginState.status === 'pending'}
              loaderColor={colors['theme-reverse']}
              trailingIcon={<ChevronRightIcon fill={colors['brand-content']} />}
            />
          </View>
          <CustomText textClass="text-xs leading-[18px] text-theme-content-active mt-3">
            You will receive an OTP for verification
          </CustomText>
        </View>
        {!onlyPhoneVerification ? (
          <>
            <AuthProviders />
            <Referral referralCode={referralCode} setReferralCode={setReferralCode} />
          </>
        ) : null}
      </View>
    );
  }

  const confirmationLoading = confirmationState.status === 'pending' || registartionStatus === 'loading';

  return (
    <View className="w-full">
      <Button
        containerClass="self-start mb-9"
        textClass="text-theme-content-active text-left text-xs"
        leadingIcon={<ChevronRightIcon fill={colors['theme-content-active']} className="rotate-180" />}
        variant="ghost"
        title="Back"
        onPress={handleGoback}
      />
      <View className="flex-row items-center mb-4">
        <CustomText textClass="text-xs text-theme-content-active">OTP sent to {phoneNumber}</CustomText>
        <Button
          textClass="text-brand-content text-xs leading-[18px]"
          containerClass="ml-2.5"
          variant="ghost"
          title="Change Number"
          onPress={handleGoback}
        />
      </View>
      <PinInput
        cellClassName="h-[50px] border-0"
        textClassName="py-3"
        cellCount={6}
        containerStyle={{ gap: 6 }}
        value={code}
        setValue={setCode}
        shape="rounded"
      />
      <View className="mt-4 flex-row items-center justify-between">
        {!resendOtp ? <ResendOtpTimer timeOut={120} canResendOtp={setResendOtp} text="Resend OTP in" /> : (
          <Button
            textClass="text-brand-content text-xs leading-[18px]"
            containerClass="self-start"
            variant="ghost"
            title="Resend OTP"
            onPress={handleSubmitPhoneNumber}
          />
        )}
        {confirmationState.status === 'failed' ? <CustomText textClass="text-global-red-50 text-xs">{confirmationState.message}</CustomText> : null}
      </View>
      <Button
        containerClass="border-theme-reverse mt-6 rounded-[10px]"
        textClass="text-theme-reverse"
        shape="rounded"
        variant="outlined"
        size="large"
        title="Confirm"
        onPress={handleOtpSubmit}
        loaderColor={colors['theme-reverse']}
        loading={confirmationLoading}
        disabled={confirmationLoading}
      />
    </View>
  );
};

export default PhoneVerification;