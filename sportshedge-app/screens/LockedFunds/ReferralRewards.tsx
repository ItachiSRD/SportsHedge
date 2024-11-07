import CustomText from '@/components/general/Text';
import Button from '@/components/general/buttons/Button';
import { REFERRAL_REWARDS } from '@/constants/referral-rewards';
import { colors } from '@/styles/theme/colors';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import LockedFundCard from '@/components/profile/LockedFunds/LockedFundCard';
import LockedFundBanner from '@/components/profile/LockedFunds/LockedFundBanner';


const ReferralRewards = () => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const availableMonths = Object.keys(REFERRAL_REWARDS)?.length ?? 0;
  const [visibleMonths, setVisibleMonths] = useState(2);
  const [loading, setLoading] = useState(false);
  
  const handleShowMore = () => {
    setLoading(true);
  
    setTimeout(() => {
      setLoading(false);
      setVisibleMonths((prev) => prev + 2);
    }, 1000);
  };
  
  return (
    <View className="flex-1">
      <LockedFundBanner infoText="Trade for ₹ 5,000 this month to unlock ₹ 500" />
      <View className='py-[8px] border-b-[1px] border-theme-primary'>
        <CustomText className='text-theme-content-active text-xs leading-[18px] tracking-[0.48px] self-center'>
              If you don’t unlock every month Referral Bonus will lapse
        </CustomText>
      </View>
      <View className="px-[30px] flex-1">
        <FlatList
          keyExtractor={(item) => item[0]}
          contentContainerStyle={{ paddingTop: 24 }}
          data={Object.entries(REFERRAL_REWARDS).slice(
            0,
            Math.min(availableMonths, visibleMonths)
          )}
          ListFooterComponent={
            visibleMonths < availableMonths ? (
              <Button
                onPress={handleShowMore}
                containerClass="border-global-gray-20 rounded-[10px] my-4"
                variant="outlined"
                title="Show More"
                loading={loading}
                loaderColor={colors['global-gray-20']}
                disabled={loading}
                textClass="text-global-gray-20 text-[16px] tracking-[0.64px] leading-[24px] py-[13px]"
                trailingIcon={<ChevronLeftIcon width={20} height={20} className="-rotate-90" />}
              />
            ) : (
              null
            )
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item: [key, value] }) => (
            <View className='gap-[30px]'>
              <CustomText textClass="text-global-gray-50 text-[12px] tracking-[0.48px] leading-[18px]">
                {key.includes(currentMonth) ? 'This Month' : key}
              </CustomText>
              <FlatList
                keyExtractor={(item, index) => `${item.title}-${index}`}
                data={value}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: { title, date, amount, type } }) => (
                  <LockedFundCard title={title} date={date} amount={amount} type={type as 'Transfer' | 'Deposit' | 'Lapse'} />
                )}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default ReferralRewards;
