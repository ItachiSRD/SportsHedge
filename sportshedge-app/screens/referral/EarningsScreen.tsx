import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import CustomText from '@/components/general/Text';
import Button from '@/components/general/buttons/Button';
import BackButton from '@/components/general/buttons/Navigation/BackButton';
import { REFERRAL_EARNINGS } from '@/constants/referral-earnings';
import BaseScreen from '@/screens/BaseScreen';
import { colors } from '@/styles/theme/colors';
import { MainBottomTabListT, ProfileStackListT } from '@/types/navigation/RootStackParams';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';

type IEarningsScreenProps = CompositeScreenProps<
  StackScreenProps<ProfileStackListT, 'Earnings'>,
  BottomTabScreenProps<MainBottomTabListT>
>;

const EarningsScreen = ({ navigation }: IEarningsScreenProps) => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const availableMonths = Object.keys(REFERRAL_EARNINGS)?.length ?? 0;
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
    <BaseScreen>
      <View style={{ flex: 1 }} className="pb-[25px]">
        <View className="flex flex-row px-[30px] py-[25px] justify-center items-center border-b border-global-gray-80">
          <BackButton
            className="mr-auto"
            title=""
            onGoBack={() => navigation.navigate('Referral')}
          />
          <CustomText textClass="mr-auto inline-block	text-[16px] text-theme-reverse tracking-[0.64px] leading-[24px]">
            Referral Rewards
          </CustomText>
        </View>
        <View style={{ flex: 1 }} className="px-[30px]">
          <FlatList
            keyExtractor={(item) => item[0]}
            data={Object.entries(REFERRAL_EARNINGS).slice(
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
                <></>
              )
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item: [key, value] }) => (
              <View>
                <CustomText textClass="text-global-gray-50 text-[14px] tracking-[0.64px] leading-[21px] pt-5 pb-2.5">
                  {key.includes(currentMonth) ? 'This Month' : key}
                </CustomText>
                <FlatList
                  keyExtractor={(item) => item.name}
                  data={value}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item: { name, rewards, amount } }) => (
                    <View className="flex flex-column py-5">
                      <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <CustomText textClass="text-theme-reverse text-[16px] tracking-[0.64px] leading-[24px]">
                          {name}
                        </CustomText>
                        <CustomText
                          fontWeight={500}
                          textClass="text-global-green-40 text-[16px] tracking-[0.64px] leading-[24px] ml-auto">
                          + ₹{amount}
                        </CustomText>
                      </View>
                      <CustomText textClass="text-theme-content-active text-[12px] tracking-[0.64px] leading-[18px] mt-[1px]">
                        {rewards} Trade Rewards
                      </CustomText>
                    </View>
                  )}
                />
              </View>
            )}
          />
        </View>
      </View>
    </BaseScreen>
  );
};

export default EarningsScreen;
