import { View } from 'react-native';
import React from 'react';
import CustomText from '@/components/general/Text';
import PlayerMarketDepthTable from '@/components/players/PlayerMarketDepth/PlayerMarketDepthTable';

interface IPlayerMarketDepthProps {
  bids?: number[][];
  offers?: number[][];
}

const PlayerMarketDepth = ({ bids = [], offers = [] }: IPlayerMarketDepthProps) => {
  return (
    <View style={{ gap: 16 }} className="px-[30px] pb-5">
      <CustomText textClass="text-brand-content leading-[21px] tracking-[0.56px]">
        Market Depth
      </CustomText>
      <PlayerMarketDepthTable bids={bids} offers={offers} />
    </View>
  );
};

export default PlayerMarketDepth;