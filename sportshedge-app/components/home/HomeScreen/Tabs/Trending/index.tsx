import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import PlayerDetails from '@/screens/players/PlayerDetails';
import { useAppDispatch, useAppSelector } from '@/store/index';
import { getPlayersAction } from '@/store/slices/players/action';
import { FlatList } from 'react-native-gesture-handler';
import FavoritePlayerCard from '../../FavoritePlayerCard';
import CustomLoader from '@/components/general/status/Loader/CustomLoader';

const HomeScreenTrending = () => {
  const dispatch = useAppDispatch();
  const { players, playerPrices, userHoldings } = useAppSelector((state) => state.playersSlice);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>();

  const loading = players.status === 'loading';

  const handleOpenPlayerDetails = useCallback((id: string) => {
    setSelectedPlayerId(id);
  }, []);

  const handleClosePlayerDetails = useCallback(() => {
    setSelectedPlayerId(undefined);
  }, []);
  

  useEffect(() => {
    dispatch(getPlayersAction());
  }, [dispatch]);
  
  if (loading) {
    return <CustomLoader />;
  }

  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Object.entries(players.data).map(([playerId, data]) => ({ playerId, ...data })).slice(0, 5)}
        keyExtractor={(item) => item.playerId}
        renderItem={({ item }) => (
          <FavoritePlayerCard
            player={item}
            playerPrice={playerPrices.data[item.playerId]}
            quantity={userHoldings.data[item.playerId]}
            onPress={() => handleOpenPlayerDetails(item.playerId)}
          />
        )}
      />
      <PlayerDetails
        closePlayerDetails={handleClosePlayerDetails}
        playerId={selectedPlayerId}
      />
    </View>
  );
};

export default HomeScreenTrending;