import { View } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import CustomBottomSheet from '@/components/general/BottomSheet';
import EnvelopeIcon from '@/assets/icons/envelope.svg';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import CustomText from '@/components/general/Text';
import PinInput from '@/components/general/inputs/PinInupt';
import ResendOtpTimer from '@/components/auth/ResendOtpTimer';
import Button from '@/components/general/buttons/Button';

interface IEmailVerificationBottomSheetProps {
  onResend?: () => void;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>
}

const EmailVerificationBottomSheet = ({ onResend, code, setCode }: IEmailVerificationBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [resendOtp, setResendOtp] = useState(false);

  useEffect(() => {
    bottomSheetRef.current?.present();
  }, [bottomSheetRef.current]);

  return (
    <CustomBottomSheet snapPoints={['5%', '70%']} ref={bottomSheetRef}>
      <View style={{ gap: 30 }}>
        <View className="items-center">
          <EnvelopeIcon />
          <CustomText textClass="mt-2 text-brand-content leading-[21px] tracking-[0.56px] text-center">We have sent OTP on darshansuthar@live.in Please check your email inbox</CustomText>
        </View>
        <View>
          <PinInput
            cellClassName="h-[50px] border-0"
            containerStyle={{ gap: 6 }}
            textClassName="py-3"
            cellCount={6}
            value={code}
            setValue={setCode}
            shape="rounded"
          />
          <View className="mt-3 flex-row items-center justify-between">
            {!resendOtp ? <ResendOtpTimer timeOut={120} canResendOtp={setResendOtp} text="Resend OTP in" /> : (
              <Button
                textClass="theme-content-active text-xs leading-[18px] tracking-[0.48px]"
                containerClass="self-start"
                variant="ghost"
                title="Resend OTP"
                onPress={onResend}
              />
            )}
            {/* {confirmationState.status === 'failed' ? <CustomText textClass="text-global-red-50 text-xs">{confirmationState.message}</CustomText> : null} */}
          </View>
        </View>
        <Button
          variant="outlined"
          size="large"
          shape="rounded"
          containerClass="border-brand-content"
          textClass="text-brand-content"
          title="confirm"
        />
      </View>
    </CustomBottomSheet>
  );
};

export default EmailVerificationBottomSheet;