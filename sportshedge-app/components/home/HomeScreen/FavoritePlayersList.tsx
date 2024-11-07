import React from 'react';
import { IPlayers, PlayerPricesT, UserPlayersHoldingT } from '@/types/entities/player';
import CustomLoader from '@/components/general/status/Loader/CustomLoader';
import { View } from 'react-native';
import FavoritePlayerCard from '@/components/home/HomeScreen/FavoritePlayerCard';

interface IFavoritePlayersListProps {
  loading?: boolean;
  favoritePlayers: string[];
  players: IPlayers;
  playerHoldings: UserPlayersHoldingT;
  playerPrices: PlayerPricesT;
  selectedNoOfGame: number;
  handlePlayerSelect: (id: string) => void;
}

const FavoritePlayersList = ({ loading, favoritePlayers, players, playerHoldings, playerPrices, selectedNoOfGame, handlePlayerSelect }: IFavoritePlayersListProps) => {


  
  if (loading) {
    return <CustomLoader />;
  }

  return (
    <View className="pb-5">
      {favoritePlayers.map((playerId) => (
        <FavoritePlayerCard
          key={playerId}
          player={players[playerId]}
          playerPrice={playerPrices[playerId]}
          quantity={playerHoldings[playerId]}
          selectedNoOfGame={selectedNoOfGame}
          onPress={() => handlePlayerSelect(playerId)}
        />
      ))}
    </View>
  );
};

export default FavoritePlayersList;