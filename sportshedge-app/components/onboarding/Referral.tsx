import XIcon from '@/assets/icons/X.svg';
import CustomBottomSheet from '@/components/general/BottomSheet';
import CustomText from '@/components/general/Text';
import Button from '@/components/general/buttons/Button';
import PressableBtn from '@/components/general/buttons/PressableBtn';
import TextInput from '@/components/general/inputs/TextInput';
import { useKeyboardListener } from '@/hooks/general/useKeyboardListener';
import { colors } from '@/styles/theme/colors';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { View } from 'react-native';

interface IReferralProps {
    referralCode?: string;
    setReferralCode?: (code: string) => void;
}

const Referral = ({ referralCode, setReferralCode }: IReferralProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [text, setText] = useState('');
  const [snapIndex, setSnapIndex] = useState(0);

  useKeyboardListener({
    kbdHideCallBack: () => setSnapIndex(0),
    kbdShowCallBack: () => setSnapIndex(1)
  });

  const saveReferralCode = () => {
    if (setReferralCode) {
      setReferralCode(text);
    }
  };

  const clearReferralCode = () => {
    setText('');
    if (setReferralCode) setReferralCode('');
  };


  if (referralCode) {
    return (
      <View className="flex-row w-full items-center border border-theme-primary rounded-[16px] px-4 py-[10px] justify-between">
        <View style={{gap: 4}}>
          <CustomText fontWeight={500} textClass="text-[14px] leading-[21px] tracking-[0.56px] text-positive">{referralCode}</CustomText>
          <CustomText className='text-theme-content-active text-[10px] leading-[15px] tracking-[0.4px]'>Referral Code Applied</CustomText>
        </View>
        <PressableBtn onPress={clearReferralCode} pressableClasses="ml-2.5">
          <XIcon fill={colors['theme-content-secondary']} />
        </PressableBtn>
      </View>
    );
  }

  return (
    <View>
      <Button
        containerClass="self-start px-[20px] py-[16px] border border-global-gray-80 rounded-[60px]"
        textClass="text-global-gray-20"
        variant="ghost"
        title="Someone has referred you?"
        onPress={() => bottomSheetRef.current?.present()}
      />

      <CustomBottomSheet index={snapIndex} snapPoints={[270]} ref={bottomSheetRef}>
        <CustomText fontWeight={500} className='text-global-gray-20 text-[16px] leading-[24px] tracking-[0.64px] mb-[30px]'>Someone has referred you?</CustomText>
        <TextInput
          autoFocus
          placeholder="Enter Referral Code"
          shape="rounded"
          rootContainerClass="w-full"
          value={text}
          onChangeText={setText}
        />
        <View style={{gap: 30}} className='flex-row justify-between mt-[35px] '>
         <Button
            containerClass="border-brand-content flex-1"
            textClass="text-brand-content text-[16px]"
            shape="rounded"
            variant="outlined"
            size="large"
            title="Cancel"
            onPress={()=> bottomSheetRef.current?.close()}
          />
          <Button
            containerClass="border-brand-content bg-white flex-1"
            textClass="text-theme-secondary text-[16px]"
            shape="rounded"
            variant="outlined"
            size="large"
            title="Apply"
            onPress={saveReferralCode}
          />
        </View>
      </CustomBottomSheet>
    </View>
  );
};

export default Referral;