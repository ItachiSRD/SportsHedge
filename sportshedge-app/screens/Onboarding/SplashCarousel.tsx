import Carousel from 'react-native-snap-carousel';
import { Dimensions, View } from 'react-native';
import { useRef, useState } from 'react';
import CarouselItem from '@/components/onboarding/Carousel/CarouselItem';
import { SPLASH_USP_DATA } from '@/constants/splash';
import CarouselDots from '@/components/onboarding/Carousel/CarouselDots';
import USPsSlide from '@/components/onboarding/Carousel/USPsSlide';
import Button from '@/components/general/buttons/Button';

const SplashCarousel = ({ onFinalSlide }: { onFinalSlide: () => void }) => {
  const [index, setIndex] = useState(0);
  const carouselRef = useRef<Carousel<any>>(null); 

  const goToNextSlide = () => {
    if (carouselRef.current) {
      if (index >= SPLASH_USP_DATA.length - 1) {
        onFinalSlide();
      } else {
        carouselRef.current.snapToNext();
      }
    }
  };
  return (
    <View className="items-center mx-[30px] pb-[30px] justify-between h-full">
      <View className='flex-1'>
      <Carousel
        ref={carouselRef}
        data={SPLASH_USP_DATA}
        renderItem={({ item }) => <CarouselItem key={item.index}><USPsSlide backgroundTheme={item.backgroundTheme} title={item.title} description={item.description}/></CarouselItem>}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width}
        onSnapToItem={setIndex}
        pagingEnabled
        scrollEnabled={false}
      />
      </View>
      <CarouselDots noOfSlide={3} currentActiveIndex={index}/>
      <Button
        containerClass="px-[12px] py-[13px] border border-global-gray-50 rounded-[20px] w-full"
        textClass="text-white text-[16px] leading-[24px] tracking-[0.64px]"
        variant="ghost"
        title="Next"
        onPress={goToNextSlide}
      />
    </View>
  );
};

export default SplashCarousel;
