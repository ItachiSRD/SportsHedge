import React from 'react';
import { IPlayers, PlayerPricesT } from '@/types/entities/player';
import CustomLoader from '@/components/general/status/Loader/CustomLoader';
import { View, FlatList } from 'react-native';
import TopPerformingPlayerCard from './TopPerformingPlayerCard';

interface ITopPerformersListProps {
  loading?: boolean;
  topPerformers: string[];
  players: IPlayers;
  playerPrices: PlayerPricesT;
  selectedNoOfGame: number;
  handlePlayerSelect: (id: string) => void;
}

const TopPerformersList = ({
  loading,
  topPerformers,
  players,
  playerPrices,
  selectedNoOfGame,
  handlePlayerSelect
}: ITopPerformersListProps) => {


  
  if (loading) {
    return <CustomLoader />;
  }

  return (
    <View className="pb-5">
      <FlatList
        contentContainerStyle={{ gap: 30, paddingHorizontal: 30 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={topPerformers}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TopPerformingPlayerCard
            name={players[item].name}
            playerPrice={playerPrices[item]}
            selectedNoOfGame={selectedNoOfGame}
            onPress={() => handlePlayerSelect(item)}
          />
        )}
      />
    </View>
  );
};

export default TopPerformersList;
