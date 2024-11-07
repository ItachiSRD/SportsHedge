import { View, Image } from 'react-native';
import { useState } from 'react';
import PressableBtn from '@/components/general/buttons/PressableBtn';
import VideoModal from '@/components/general/video/VideoModal';
import CustomText from '@/components/general/Text';
import PlayIcon from '@/assets/icons/PlayIcon.svg';
import clsx from 'clsx';

import VideoLoadIcon from '@/assets/icons/video-load.svg';

interface IHowToTradeVideoProps {
    noOfTimesWatched?: number;
    videoId: string;
}

const HowToTradeVideo = ({ noOfTimesWatched = 0, videoId }: IHowToTradeVideoProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  if (noOfTimesWatched >= 5) return null;

  const pressableClasses = clsx({
    'mx-[30px]': noOfTimesWatched > 0
  });
  
  return (
    <>
      <PressableBtn style={{marginBottom: 24}} pressableClasses={pressableClasses} onPress={() => setModalVisible(true)}>
        {noOfTimesWatched === 0 ? (
          <View className='justify-center items-center'>
            <Image source={require('@/assets/images/player-details/HowToTrade.png')} className='mx-auto w-[346px] h-[194px] rounded-[20px]'/>
            <View className='absolute p-[13px] border-[2px] border-white rounded-[90px]'>
              <VideoLoadIcon />
            </View>
          </View>
        ) : (
          <View className="p-2 rounded bg-global-gray-80 flex-row items-center justify-between mx-[30px]">
            <View style={{ gap: 8 }} className="flex-row items-center">
              <PlayIcon />
              <CustomText textClass="text-theme-content-primary">How to buy and sell?</CustomText>
            </View>
            <CustomText textClass="text-brand-content px-3">Watch Now</CustomText>
          </View>
        )}
      </PressableBtn>
      <VideoModal videoId={videoId} modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </>
  );
};

export default HowToTradeVideo;