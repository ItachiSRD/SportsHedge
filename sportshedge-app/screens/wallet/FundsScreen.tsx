import SecureIcon from '@/assets/icons/secure.svg';
import CustomText from '@/components/general/Text';
import BackButton from '@/components/general/buttons/Navigation/BackButton';
import PressableBtn from '@/components/general/buttons/PressableBtn';
import BaseScreen from '@/screens/BaseScreen';
import AddFunds from '@/screens/wallet/AddFunds';
import TransactionHistory from '@/screens/wallet/TransactionHistory';
import WithdrawFunds from '@/screens/wallet/WithdrawFunds';
import { MainBottomTabListT, ProfileStackListT } from '@/types/navigation/RootStackParams';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import LockIcon from '@/assets/icons/lock-icon.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import { colors } from '@/styles/theme/colors';
import { useAppSelector } from '@/store/index';
import { fetchAndLogUserAddress, getUserAddress, getUserBalance } from '@/store/slices/blockchain';
import CustomLoader from '@/components/general/status/Loader/CustomLoader';

type FundsScreenProps = CompositeScreenProps<
  StackScreenProps<ProfileStackListT, 'Funds'>,
  BottomTabScreenProps<MainBottomTabListT>
>;

const FundsScreen = ({ navigation }: FundsScreenProps) => {
  const [userDetails, setUserDetails] = useState({ address: '', balance: '0' });
  const [isLoading, setIsLoading] = useState(true);
  
  const kycDone = false;
  const repeatUser = false;
  let { user } = useAppSelector((state) => state.userSlice);
  // console.log('userDetails', user?.id);
  
  useEffect(() => {
    let fetchDetails = async () => {
      setIsLoading(true);
      const address = await fetchAndLogUserAddress(user?.id ?? '');
      let balance = await getUserBalance('shedg1jz2d2ae58yjl5he948qvpk2qzu2rwrwxsmaq95');
      setUserDetails({ address: address , balance: balance ?? '0' });
      setIsLoading(false);
    };
  
    fetchDetails();
  }, [user?.id]);

  return (
    <>
    <BaseScreen>
      <View className="px-[30px] pt-[22px]">
        <BackButton onGoBack={() => navigation.goBack()} />
        <View>
          <View className="mt-[28px] p-[1.675rem] bg-[#202025] border border-[#F2F2F285] rounded-xl">
            <View className="pt-[29px] items-center border-b-[1px] border-b-global-gray-80">
              <CustomText
                fontWeight={500}
                textClass="text-[16px] text-brand-content tracking-[0.64px] leading-[24px] text-center">
                Available SHT
              </CustomText>
              <CustomText
                fontWeight={700}
                textClass="text-[32px] text-brand-content tracking-[1.28px] leading-[48px] text-center mb-[22px]">
                {userDetails?.balance}
              </CustomText>
            </View>
            {repeatUser && (
              <PressableBtn pressableClasses="pt-[15px] pb-4 pl-[15.5px] pr-[14px] flex-row justify-between" onPress={() => navigation.navigate('LockedFunds', { initialTab: 'Deposit Bonus' })}>
              <View className="flex-row items-center gap-[12px]">
                <LockIcon width={18} height={18}/>
                <CustomText
                  fontWeight={500}
                  textClass="text-base text-brand-content tracking-[0.64px] leading-[24px]">
                    Locked Fund
                </CustomText>
                <CustomText
                  fontWeight={500}
                  textClass="text-lg text-brand-content tracking-[0.72px] leading-[27px]">
                    ₹ 25,000
                </CustomText>
              </View>
              <ChevronRightIcon fill={colors['theme-reverse']} width={24} height={24} />
            </PressableBtn>
            )}
          </View>
          <View className="my-8 flex flex-row justify-between">
            <WithdrawFunds kycDone={kycDone} />
            <AddFunds />
          </View>
          <View className="mt-2 mb-4 flex flex-row justify-center">
            <SecureIcon width={16} height={16} className="mr-1" />
            <Text className="ml-1 text-xs tracking-[0.64px] text-theme-reverse leading-[18px]">
              Secure and hassle free transaction
            </Text>
          </View>
        </View>
      </View>
      <TransactionHistory />
    </BaseScreen>
    {isLoading && (
      <CustomLoader
        containerClass="fixed bottom-0 w-full h-full flex items-center justify-center bg-black absolute"
      />
    )}
    </>
  );
};

export default FundsScreen;
