import AddFundsIcon from '@/assets/icons/add-funds.svg';
import CustomBottomSheet from '@/components/general/BottomSheet';
import CustomText from '@/components/general/Text';
import Button from '@/components/general/buttons/Button';
import Label from '@/components/general/inputs/Label';
import TextInput from '@/components/general/inputs/TextInput';
import { useKeyboardListener } from '@/hooks/general/useKeyboardListener';
import { colors } from '@/styles/theme/colors';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { View } from 'react-native';

const AddFunds = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [snapIndex, setSnapIndex] = useState(0);

  useKeyboardListener({
    kbdHideCallBack: () => setSnapIndex(0),
    kbdShowCallBack: () => setSnapIndex(1)
  });

  const handleAmountChange = (amount: string) => {
    setAmount(amount);
    if (!amount) return setError('');

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) return setError('Please input a valid amount!');

    if (error) setError('');
  };

  const handleAmountSubmit = () => {
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0 || error) return;

    setLoading(true);

    setLoading(false);
  };

  return (
    <View className="w-[45%]">
      <Button
        containerClass="border-[#A1F0C3] bg-[#A1F0C3] rounded-xl py-3"
        textClass="text-[#043D1F] font-bold text-base tracking-[0.64px]"
        shape="rounded"
        variant="outlined"
        size="large"
        title="Add Funds"
        leadingIcon={<AddFundsIcon width={16} height={16} />}
        onPress={() => bottomSheetRef.current?.present()}
      />

      <CustomBottomSheet index={snapIndex} snapPoints={[271]} ref={bottomSheetRef}>
        <Label labelTitleProps={{ fontWeight: 400 }} title="Amount" />
        <TextInput
          containerProps={{ className: 'mt-2' }}
          autoFocus
          inputMode="numeric"
          placeholder="Enter Amount"
          shape="rounded"
          rootContainerClass="w-full"
          value={amount}
          status={!error ? 'default' : 'error'}
          statusMsg={error}
          onChangeText={handleAmountChange}
        />
        <CustomText className="text-xs leading-[18px] mt-2 text-theme-content-active">
          You will be redirected for payment
        </CustomText>
        <Button
          containerClass="border-brand-content mt-2 rounded-lg"
          textClass="text-base text-brand-content tracking-[0.64px]"
          variant="outlined"
          size="large"
          title="Add Funds"
          onPress={handleAmountSubmit}
          loading={loading}
          loaderColor={colors['global-gray-20']}
          disabled={loading}
        />
      </CustomBottomSheet>
    </View>
  );
};

export default AddFunds;
