import React from 'react';
import { View } from 'react-native';
import ScreenHeader from '@/components/general/ScreenHeader';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackListT } from '@/types/navigation/RootStackParams';
import BaseScreen from '@/screens/BaseScreen';
import { ScrollView } from 'react-native-gesture-handler';
import CustomText from '@/components/general/Text';

type FantasyPointScoringSystemScreenPropsT = StackScreenProps<ProfileStackListT, 'FantasyPointScoringSystem'>;

const FantasyPointScoringSystemScreen = ({navigation}: FantasyPointScoringSystemScreenPropsT) => {
  return (
    <BaseScreen>
      <View className="mx-[30px] mt-[22px] mb-[28px]">
        <ScreenHeader
          title="Fantasy Points Scoring System"
          handleGoBack={() => navigation.goBack()}
          textClass="text-[16px] leading-[24px] tracking-[0.64px]"
        />
      </View>
      <ScrollView className='border-t border-global-gray-80 p-[30px]' showsVerticalScrollIndicator={false}>
        <CustomText className='text-global-gray-20 text-[16px] leading-[24px] tracking-[0.64px]'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </CustomText>
      </ScrollView>
    </BaseScreen>
  )
}

export default FantasyPointScoringSystemScreen;