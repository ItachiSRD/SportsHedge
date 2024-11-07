import { View } from 'react-native';
import React from 'react';
import CarouselDot from './CarouselDot';

interface ICarouselDotsProps {
    noOfSlide: number;
    currentActiveIndex: number;
}

const CarouselDots = ({ noOfSlide, currentActiveIndex }: ICarouselDotsProps) => {
  const slidesArr = new Array(noOfSlide).fill(0);
  return (
    <View className="flex-row items-center mb-[58px]">
      {slidesArr.map((_, index) => <CarouselDot key={index} active={index === currentActiveIndex} />)}
    </View>
  );
};

export default CarouselDots;