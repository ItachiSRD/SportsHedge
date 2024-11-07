import CustomText from '@/components/general/Text';
import PressableBtn, { IPressableBtnProps } from '@/components/general/buttons/PressableBtn';
import { noOfGameListKeys } from '@/constants/players';
import { PlayerPriceT } from '@/types/entities/player';
import { roundOffNumber } from '@/utils/number';
import { View } from 'react-native';

interface ITopPerformingPlayerCardProps extends IPressableBtnProps {
  name: string;
  playerPrice?: PlayerPriceT;
  selectedNoOfGame: number;
}

const TopPerformingPlayerCard = ({
  name,
  playerPrice,
  selectedNoOfGame,
  ...props
}: ITopPerformingPlayerCardProps) => {
  let playerCurrentPrice: number| null = null;
  let percentageChange: number| null = null;
  if (playerPrice) {
    playerCurrentPrice = playerPrice.price;
    percentageChange = roundOffNumber(
      ((playerCurrentPrice - playerPrice[noOfGameListKeys[selectedNoOfGame]]) /
        playerCurrentPrice) *
        100
    );
  }
  return (
    <PressableBtn {...props} style={{ gap: 5 }} pressableClasses="justify-between bg-theme-primary w-[197px] pt-[15px] pb-3 px-4 rounded-[10px]">
      <CustomText fontWeight={500} textClass="text-brand-content leading-[21px] tracking-[0.56px]">
        {name}
      </CustomText>
      <View style={{ gap: 6 }} className="flex-row items-center">
        <CustomText
          fontWeight={500}
          textClass="text-xs leading-[18px] tracking-[0.48px] text-brand-content">
          ₹ {playerCurrentPrice || ''}
        </CustomText>
        {percentageChange ? <CustomText textClass="text-green-500 text-xs leading-[18px] tracking-[0.48px]">
          {percentageChange < 0 ? '-' : '+'}{Math.abs(percentageChange)}%
        </CustomText> : null}
      </View>
    </PressableBtn>
  );
};

export default TopPerformingPlayerCard;
