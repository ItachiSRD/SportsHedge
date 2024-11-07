import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import CustomText from '@/components/general/Text';
import { IPlayerBasicInfo, PlayerPricesT, UserPlayersHoldingT } from '@/types/entities/player';
import FavoritePlayerCard from '@/components/home/HomeScreen/FavoritePlayerCard';

interface ITrendingPlayersListProps {
    listTitle?: string;
    players: IPlayerBasicInfo[];
    playerPrices: PlayerPricesT;
    handlePlayerSelect: (playerId: string) => void;
    playerHoldings: UserPlayersHoldingT;
}

const TrendingPlayersList = ({ listTitle, players, playerPrices, handlePlayerSelect, playerHoldings }: ITrendingPlayersListProps) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <CustomText textClass="text-[12px] leading-[18px] tracking-[0.64px] text-global-gray-50 pb-[10px]">
          {listTitle}
        </CustomText>
      }
      data={players}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <FavoritePlayerCard
          player={item}
          playerPrice={playerPrices[item.id]}
          quantity={playerHoldings[item.id]}
          onPress={() => handlePlayerSelect(item.id)}
        />
      )}
    />
  );
};

export default React.memo(TrendingPlayersList);