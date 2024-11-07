import { useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import BottomSheetLaunchCard from '../../general/BottomSheet/BottomSheetLaunchCard';
import Button from '@/components/general/buttons/Button';
import CustomBottomSheet from '@/components/general/BottomSheet';
import useSocialAuthLogin from '@/hooks/auth/useSocialAuthLogin';
import ChvronRightIcon from '@/assets/icons/chevron-right.svg';
import GoogleLogoOld from '@/assets/icons/google.svg';
import AppleLogo from '@/assets/icons/apple-logo.svg';
import CustomText from '@/components/general/Text';
import { colors } from '@/styles/theme/colors';
import { View } from 'react-native';

import GoogleLogo from '@/assets/icons/google-new.svg';
import LogoButton from '../LogoButton';

const AuthProviders = () => {
  // const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { signInWithGoogle, signInWihApple } = useSocialAuthLogin();

  return (
    <View style={{gap: 17}} className='items-center'>
      <CustomText className='text-theme-content-active text-[12px] leading-[18px] tracking-[0.48px]'>Continue With</CustomText>
      <View style={{gap: 30}} className='flex-row'>
        <LogoButton providerIcon={<GoogleLogo />} onPress={signInWithGoogle} />
        <LogoButton providerIcon={<AppleLogo />} onPress={signInWihApple} />
      </View>
    </View>
  );
};

export default AuthProviders;

//If bottomsheet is needed onPress the button,then use this codebase:
{/* <CustomBottomSheet snapPoints={['15%', '40%']} ref={bottomSheetRef}>
        <CustomText textClass="text-base text-brand-content">Register with,</CustomText>
        <BottomSheetLaunchCard
          containerClass="my-[30px]"
          providerName="Google"
          providerIcon={<GoogleLogoOld />}
          onPress={signInWithGoogle}
        />
        <BottomSheetLaunchCard
          providerName="Apple"
          providerIcon={<AppleLogo />}
          onPress={signInWihApple}
        />
      </CustomBottomSheet> */}