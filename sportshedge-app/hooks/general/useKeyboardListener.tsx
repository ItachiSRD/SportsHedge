import { useEffect } from 'react';
import { Keyboard } from 'react-native';

type IUseKeyboardListenerProps = {
    kbdShowCallBack?: () => void;
    kbdHideCallBack?: () => void;
}

export const useKeyboardListener = ({ kbdHideCallBack, kbdShowCallBack }: IUseKeyboardListenerProps) => {
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (kbdShowCallBack) kbdShowCallBack(); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (kbdHideCallBack) kbdHideCallBack(); // or some other action
      }
    );
    
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
};