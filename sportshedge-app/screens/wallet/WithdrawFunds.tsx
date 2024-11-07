import WithdrawIcon from '@/assets/icons/withdraw.svg';
import CustomBottomSheet from '@/components/general/BottomSheet';
import Button from '@/components/general/buttons/Button';
import Label from '@/components/general/inputs/Label';
import TextInput from '@/components/general/inputs/TextInput';
import { useModal } from '@/hooks/general/useModal';
import { colors } from '@/styles/theme/colors';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import CompleteKYCBottomSheet from '../../components/profile/Wallet/CompleteKYCBottomSheet';
import InsufficientBalance from '../../components/profile/Wallet/InsufficientBalance';
import PaymentProcessing from '../../components/profile/Wallet/PaymentProcessing';
import ModalComponent from '@/components/general/Modal/ModalComponent';

type IWithdrawFunds = {
  kycDone: boolean;
};

const WithdrawFunds = ({ kycDone }: IWithdrawFunds) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const balance: number = 50;
  const messageModal = useModal({ defaultState: false });
  const { isVisible, openModal, closeModal } = messageModal;

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

    if (parsedAmount > balance) {
      setAmount('');
      bottomSheetRef?.current?.close();
      return openModal();
    }

    setLoading(true);

    setLoading(false);
  };

  return (
    <View className="w-[45%]">
      <Button
        containerClass="border-global-gray-20 rounded-xl py-3"
        textClass="text-global-gray-20 font-bold text-base tracking-[0.64px]"
        shape="rounded"
        variant="outlined"
        size="large"
        title="Withdraw"
        leadingIcon={<WithdrawIcon width={16} height={16} />}
        onPress={() => bottomSheetRef.current?.present()}
      />

      <ModalComponent isVisible={isVisible} onClose={closeModal}>
        {error ? <PaymentProcessing /> : <InsufficientBalance />}
      </ModalComponent>

      {kycDone ? (
        <CustomBottomSheet snapPoints={['5%', '70%']} ref={bottomSheetRef}>
          <Label labelTitleProps={{ fontWeight: 400 }} title="Amount" />
          <TextInput
            containerProps={{ className: 'mt-2' }}
            autoFocus
            inputMode="numeric"
            placeholder="Enter Amount"
            shape="rounded"
            status={!error ? 'default' : 'error'}
            statusMsg={error ?? ''}
            rootContainerClass="w-full"
            value={amount}
            onChangeText={handleAmountChange}
          />
          <Button
            containerClass="border-brand-content mt-4 rounded-lg"
            textClass="text-base text-brand-content tracking-[0.64px]"
            variant="outlined"
            size="large"
            title="Withdraw"
            onPress={handleAmountSubmit}
            loading={loading}
            loaderColor={colors['global-gray-20']}
            disabled={loading}
          />
        </CustomBottomSheet>
      ) : (
        <CompleteKYCBottomSheet bottomSheetRef={bottomSheetRef} />
      )}
    </View>
  );
};

export default WithdrawFunds;
