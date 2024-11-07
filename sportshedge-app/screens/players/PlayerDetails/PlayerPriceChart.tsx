import { View } from 'react-native';
import { useMemo, useState } from 'react';
import CustomText from '@/components/general/Text';
import Button from '@/components/general/buttons/Button';
import PlayerLineChart from '@/components/players/PlayerDetails/PriceLineChart';
import { NO_OF_GAMES_FILTER } from '@/constants/playerfilters';
import { PlayerPriceT } from '@/types/entities/player';
import { roundOffNumber } from '@/utils/number';
import { noOfGameListKeys } from '@/constants/players';

interface IPlayerPriceChartProps {
  performancePoints?: number[];
  playerPrice?: PlayerPriceT;
  selectedNoOfGames?: number;
  setSelectedNoOfGames?: (noOfGames: number) => void;
}

const PlayerPriceChart = ({ performancePoints = [], playerPrice , selectedNoOfGames, setSelectedNoOfGames}: IPlayerPriceChartProps) => {

  const data = useMemo(() => {
    return performancePoints
      .slice(0, Math.min(selectedNoOfGames || 7, performancePoints.length))
      .map((number, index) => ({
        x: index + 1,
        y: number
      }));
  }, [performancePoints, selectedNoOfGames]);

  let playerCurrentPrice: number| string = '';
  let percentageChange: number| string = '';
  if (playerPrice) {
    playerCurrentPrice = playerPrice.price;
    percentageChange = roundOffNumber(
      ((playerCurrentPrice - playerPrice[noOfGameListKeys[selectedNoOfGames || 7]]) /
        playerCurrentPrice) *
        100
    );
  }

  return (
    <View className="p-[30px] border-y border-theme-primary">
      <View className="flex-row justify-between">
        <View style={{ gap: 8 }} className="flex-row items-center">
          <CustomText
            fontWeight={500}
            textClass="text-[16px] text-global-gray-20 leading-[24px] tracking-[0.64px]">
            LTP
          </CustomText>
          <CustomText
            fontWeight={500}
            textClass="text-[16px] text-brand-content leading-[24px] tracking-[0.64px]">
            ₹ {playerCurrentPrice || ''}
          </CustomText>
          {percentageChange ? (
            <CustomText className="text-[16px] text-[#28BD68] leading-[24px] tracking-[0.64px]">
              +{percentageChange}%
            </CustomText>
          ) : null}
        </View>
        {/* <Button
          variant="ghost"
          title="How scoring works?"
          containerClass="border-b border-theme-content-secondary self-center"
          textClass="text-brand-content text-xs leading-[18px] tracking-[0.48px]"
        /> */}
      </View>
      <PlayerLineChart containerProps={{ className: 'h-[80px] mb-4 mt-3' }} data={data} />
      <View className="flex-row items-center justify-between">
        {NO_OF_GAMES_FILTER.map((noOfGame) => (
          <Button
            key={noOfGame}
            variant={selectedNoOfGames === noOfGame ? 'outlined' : 'ghost'}
            shape="pill"
            containerClass="border-brand-content py-[3px] px-3"
            textClass="text-brand-content text-xs leading-[18px] tracking-[0.48px]"
            title={`${noOfGame} Games`}
            onPress={() => setSelectedNoOfGames && setSelectedNoOfGames(noOfGame)}
          />
        ))}
      </View>
    </View>
  );
};

export default PlayerPriceChart;