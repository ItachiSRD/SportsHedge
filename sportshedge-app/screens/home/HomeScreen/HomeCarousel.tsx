import { View, Dimensions } from 'react-native';
import { useState, useMemo } from 'react';
import Carousel from 'react-native-snap-carousel';
import HomeCarouselDots from '@/components/home/HomeScreen/HomeCarouselDots';
import VideoModal from '@/components/general/video/VideoModal';
import YoutubeIcon from '@/assets/icons/youtube.svg';
import HomeCarouselItem from '@/components/home/HomeScreen/HomeCarouselItem';
import { LERN_MORE_VIDEO } from '@/constants/videos';

const HomeCarousel = () => {
  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const slides = useMemo(() => [
    {
      id: '1',
      title: 'Why pay 20% on fantasy sports?',
      desc: 'Trade with the lowest transaction fee on SportsHedge',
      highlightText: 'Just pay 1.5%',
    },
    {
      id: '2',
      title: 'Referring is rewarding!',
      desc: 'Refer and earn part of their revenue',
      highlightText: '20% Forever',
    },
    {
      id: '3',
      title: 'Trading is easier than you think',
      desc: 'Pick and profit',
      highlightText: 'Learn',
      icon: <YoutubeIcon />,
      isClickable: true,
      onPress: () => setModalVisible(true)
    }
  ], []) ;
  
  
  return (
    <>
      <View className="mt-[37px] items-center">
        <Carousel
          autoplay
          loop
          data={slides}
          renderItem={({ item }) => (
            <HomeCarouselItem {...item} />
          )}
          sliderWidth={Dimensions.get('window').width -60}
          itemWidth={Dimensions.get('window').width - 60}
          onSnapToItem={setIndex}
          pagingEnabled
        />
        <HomeCarouselDots noOfSlide={slides.length} currentActiveIndex={index} />
      </View>
      <VideoModal videoId={LERN_MORE_VIDEO} modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </>
  );
};

export default HomeCarousel;