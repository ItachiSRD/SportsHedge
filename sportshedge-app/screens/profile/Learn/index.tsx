import React, { useState } from 'react';
import { View } from 'react-native';
import ScreenHeader from '@/components/general/ScreenHeader';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackListT } from '@/types/navigation/RootStackParams';
import BaseScreen from '@/screens/BaseScreen';
import { ScrollView } from 'react-native-gesture-handler';

import { LEARN } from '@/constants/Learn/learn';
import ChvronRightIcon from '@/assets/icons/chevron-right.svg';
import CustomText from '@/components/general/Text';
import { colors } from '@/styles/theme/colors';
import PressableBtn from '@/components/general/buttons/PressableBtn';
import WebViewModal from '@/components/general/Modal/WebViewModal';

type LearnScreenPropsT = StackScreenProps<ProfileStackListT, 'Learn'>;

const LearnScreen = ({ navigation }: LearnScreenPropsT) => {

  const [selectedURL, setSelectedURL] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCardPress = (params: string) => {
    if (params === 'PricingModel' || params === 'FantasyPointScoringSystem') {
      navigation.navigate(params);
    } else {
      const url = `https://sportshedge.io/${params}`;
      setSelectedURL(url);
      setModalVisible(true);
    }
  };
  return (
    <>
    <BaseScreen>
      <View className="mx-[30px] mt-[22px] mb-[28px]">
        <ScreenHeader
          title="Learn"
          handleGoBack={() => navigation.goBack()}
          textClass="text-[16px] leading-[24px] tracking-[0.64px]"
        />
      </View>
      <ScrollView className='border-t border-global-gray-80' showsVerticalScrollIndicator={false}>
        <View style={{gap: 40}} className='mt-[27px]'>
        {LEARN.map((item, index) => (
          <PressableBtn key={index} onPress={() => handleCardPress(item.navigateTo ?? '')}>
            <View className='flex-row justify-between mx-[30px]'>
              <CustomText className='text-white text-[16px] leading-[24px] tracking-[0.64px]'>{item.title}</CustomText>
              <ChvronRightIcon fill={colors['theme-reverse-content-secondary']} width={20} height={20} />
            </View>
          </PressableBtn>
        ))}
        </View>
      </ScrollView>
    </BaseScreen>
    <WebViewModal modalVisible={modalVisible} setModalVisible={setModalVisible} selectedURL={selectedURL}  />
    </>
  );
};

export default LearnScreen;