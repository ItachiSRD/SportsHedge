import React from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import CustomBottomSheet from '@/components/general/BottomSheet';
import CustomText from '@/components/general/Text';
import BottomSheetLaunchCard from '@/components/general/BottomSheet/BottomSheetLaunchCard';
import WhatsAppLogo from '@/assets/icons/whatsapp-icon.svg';
import TelegramLogo from '@/assets/icons/telegram-icon.svg';
import EmailLogo from '@/assets/icons/envelope-icon.svg';
import { View } from 'react-native';
import { useLaunchAppIntent } from '@/hooks/general/useLaunchAppIntent';


interface ContactUsBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
}

const ContactUsBottomSheet: React.FC<ContactUsBottomSheetProps> = ({ bottomSheetRef }) => {
  const { openWhatsAppWithNumber, openTelegramWithPhoneNumber, openEmail } = useLaunchAppIntent();

  return (
    <CustomBottomSheet ref={bottomSheetRef}>
      <View style={{ gap: 30 }}>
        <CustomText textClass="text-base text-brand-content"> Connect with Us,</CustomText>
        <BottomSheetLaunchCard
          providerName="WhatsApp"
          providerIcon={<WhatsAppLogo />}
          onPress={openWhatsAppWithNumber}
        />
        <BottomSheetLaunchCard
          providerName="Telegram"
          providerIcon={<TelegramLogo />}
          onPress={openTelegramWithPhoneNumber}
        />
        <BottomSheetLaunchCard
          providerName="Email"
          providerIcon={<EmailLogo />}
          onPress={openEmail}
        />
      </View>
    </CustomBottomSheet>
  );
};

export default ContactUsBottomSheet;
