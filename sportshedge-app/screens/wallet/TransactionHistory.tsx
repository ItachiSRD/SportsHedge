import FundDepositIcon from '@/assets/icons/fund_deposit.svg';
import FundWithdrawnIcon from '@/assets/icons/fund_withdrawn.svg';
import FundWithdrawnWaitingIcon from '@/assets/icons/fund_withdrawn_waiting.svg';
import WalletIcon from '@/assets/icons/wallet 1.svg';
import CustomText from '@/components/general/Text';
import { useAppSelector } from '@/store/index';
import { fetchAndLogUserAddress, getTransactionHistory, getUserBalance } from '@/store/slices/blockchain';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

type Transaction = {
  status: 'initiated' | 'processing' | 'processed';
  type: 'debit' | 'credit';
  amount: number;
  title: string;
  date: string;
};


const TransactionHistory = () => {
  const isDebit = (transaction: Transaction) => transaction.type === 'debit';
  const isProcessing = (transaction: Transaction) => transaction.status === 'processing';

  const [userDetails, setUserDetails] = useState({ address: '', txnLength:  0, txnAmount: '', txn: []});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAppSelector((state) => state.userSlice);

  const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(/(\d+:\d+\s[APMapm]{2})/, (_, match) => match.toUpperCase());


  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      const address = await fetchAndLogUserAddress(user?.id ?? '');
      const txn = await getTransactionHistory('shedg1jz2d2ae58yjl5he948qvpk2qzu2rwrwxsmaq95');
      setUserDetails({ address: address , txnLength: txn.length, txnAmount: txn[0]?.body?.messages[0]?.amount, txn: txn });
      setIsLoading(false);
    };

    fetchDetails();
  }, [user?.id]);

  return (
    <>
      <View style={{ flex: 1 }}>
        {userDetails.txn?.length === 0 ? (
          <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <WalletIcon width={100} height={100} className="" />
            <CustomText textClass="text-[14px] text-theme-reverse tracking-[0.64px] leading-[21px] text-center">
              Add Funds and
            </CustomText>
            <CustomText textClass="text-[18px] text-theme-reverse tracking-[0.64px] leading-[27px] text-center pt-2 pb-20">
              Start Trading!
            </CustomText>
          </View>
        ) : (
          <View className="px-[30px] flex-1 border-t border-global-gray-80">
            <CustomText textClass="text-[14px] py-6 text-theme-reverse tracking-[0.64px] leading-[21px]">
              History
            </CustomText>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={userDetails.txn}
              renderItem={({ item: transaction }) => (
                <View
                  style={{ display: 'flex', flexDirection: 'row' }}
                  className="flex flex-row h-[44px] my-3.5">
                  <View className="w-[20%]">
                    <View className="bg-theme-primary w-[44px] h-[44px] flex-1 justify-center items-center rounded-md">
                      {isDebit(transaction) && isProcessing(transaction) && (
                        <FundWithdrawnWaitingIcon />
                      )}
                      {isDebit(transaction) && !isProcessing(transaction) && <FundWithdrawnIcon />}
                      {!isDebit(transaction) && !isProcessing(transaction) && <FundDepositIcon />}
                    </View>
                  </View>
                  <View className="w-[80%] flex flex-column justify-center">
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <CustomText textClass="text-[16px] text-theme-reverse tracking-[0.64px] leading-[24px]">
                        {transaction.title} {transaction.type === 'credit' ? 'Credited' : 'Debited'}
                      </CustomText>
                      <CustomText
                        textClass={`text-[16px] ${
                          isDebit(transaction) ? 'text-global-red-40' : 'text-global-green-40'
                        } tracking-[0.64px] leading-[24px] ml-auto`}>
                        {isDebit(transaction) ? '-' : '+'} 
                        {transaction.amount.toLocaleString('en-IN')} {transaction?.denomination ?? ''}
                      </CustomText>
                    </View>
                    <CustomText textClass="text-[12px] text-theme-content-active tracking-[0.64px] leading-[18px]">
                    {isProcessing(transaction)
                      ? 'Request processing...'
                      : formatDate(transaction.date)}
                  </CustomText>
                  </View>
                </View>
              )}
            />
          </View>
        )}
      </View>
      {/* {isLoading && (
        <CustomLoader
          containerClass="fixed bottom-0 w-full h-auto flex items-center justify-center bg-black"
        />
      )} */}
    </>
  );
};

export default TransactionHistory;
