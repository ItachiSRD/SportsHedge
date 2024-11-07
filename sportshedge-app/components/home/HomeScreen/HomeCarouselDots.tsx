import { View } from 'react-native';
import HomeCarouselDot from './HomeCarouselDot';

interface IHomeCarouselDotsProps {
    noOfSlide: number;
    currentActiveIndex: number;
}

const HomeCarouselDots = ({ noOfSlide, currentActiveIndex }: IHomeCarouselDotsProps) => {
  const slidesArr = new Array(noOfSlide).fill(0);
  return (
    <View style={{ gap: 10 }} className="flex-row items-center mt-[19px] mb-[18px] ">
      {slidesArr.map((_, index) => <HomeCarouselDot key={index} active={index === currentActiveIndex} />)}
    </View>
  );
};

export default HomeCarouselDots;