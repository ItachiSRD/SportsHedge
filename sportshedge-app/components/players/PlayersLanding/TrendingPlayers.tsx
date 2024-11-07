import { View } from 'react-native';
import PlayerDetails from '@/screens/players/PlayerDetails';
import { IPlayerBasicInfo, PlayerPricesT, UserPlayersHoldingT } from '@/types/entities/player';
import React from 'react';
import TrendingPlayersList from './TrendingPlayersList';

type ITrendingPlayers = {
  players: IPlayerBasicInfo[];
  loading?: boolean;
  playerHoldings: UserPlayersHoldingT;
  playerPrices: PlayerPricesT;
  listTitle: string;
  selectedPlayerId?: string;
  handlePlayerSelect: (playerId: string) => void;
  closePlayerDetails?: () => void;
};

const TrendingPlayers = ({
  players,
  listTitle,
  playerHoldings,
  playerPrices,
  handlePlayerSelect,
  closePlayerDetails,
  selectedPlayerId
}: ITrendingPlayers) => {
  console.log('rerender');
  return (
    <>
      <View className="flex-1 px-[30px] py-[21px]">
        <TrendingPlayersList
          playerHoldings={playerHoldings}
          listTitle={listTitle}
          playerPrices={playerPrices}
          players={players}
          handlePlayerSelect={handlePlayerSelect}
        />
      </View>
      <PlayerDetails
        closePlayerDetails={closePlayerDetails}
        playerId={selectedPlayerId}
      />
    </>
  );
};

export default React.memo(TrendingPlayers);
