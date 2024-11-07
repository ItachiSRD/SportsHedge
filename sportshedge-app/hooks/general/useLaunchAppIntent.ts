import { Linking } from 'react-native';
import { CONTACT_US } from '@/constants/config';

export const useLaunchAppIntent = () => {
  const launchApp = (url: string, errorMessage: string) => {
    Linking.openURL(url)
      .then(() => {
        console.log(`Communication method opened with URL: ${url}`);
      })
      .catch((err) => {
        console.error(`Error opening communication method: ${errorMessage}`, err);
      });
  };
  
  const openWhatsAppWithNumber = (message?: string) => {
    let whatsappURL = 'whatsapp://send?text= ';

    if (message) {
      const encodedMessage = encodeURIComponent(message);
      whatsappURL += `?text=${encodedMessage}`;
    }
    launchApp(whatsappURL, 'WhatsApp');
  };
  
  const openTelegramWithPhoneNumber = () => {
    const telegramURL = `tg://resolve?domain=${CONTACT_US.telegram}`;
    launchApp(telegramURL, 'Telegram is not installed on this device.');
  };
  
  const openEmail = () => {
    const url = `mailto:${CONTACT_US.email}`;
    launchApp(url, 'Email');
  };
  
  return {
    openWhatsAppWithNumber,
    openTelegramWithPhoneNumber,
    openEmail,
  };
};