  import TrendingPlayers from '@/components/players/PlayersLanding/TrendingPlayers';
import BaseScreen from '@/screens/BaseScreen';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PlayersFilter from './PlayersFilter';
import PlayersSearchSort from './PlayersSearchSort';
import { useAppDispatch, useAppSelector } from '@/store/index';
import { FilterPLayersByT, filterPlayers, mapPlayersToArrayFromObj } from './util/player';
import { useIsFocused } from '@react-navigation/native';
import { appendLtpPlayerList, removePlayersFromLtpList } from '@/store/slices/players/reducer';

const PlayersLandingScreen = () => {
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>();
  const [filterBy, setFilterBy] = useState<FilterPLayersByT>({});
  const [searchCompleted, setSearchCompleted] = useState<boolean>(false);
  const { players, playerPrices, userHoldings } = useAppSelector((state) => state.playersSlice);

  const playersArr = useMemo(() => mapPlayersToArrayFromObj(players.data), [players.data]);

  const filteredPlayers = useMemo(() => filterPlayers(filterBy, playersArr), [filterBy, playersArr]);

  useEffect(() => {
    const playerIds = Object.keys(players.data);
    if (isFocused) {
      dispatch(appendLtpPlayerList({ playerIds, replace: true })); 
    } else {
      dispatch(removePlayersFromLtpList({ playerIds, initialState: true }));
    }
  }, [isFocused]);
  
  const handleOpenPlayerDetails = useCallback((id: string) => {
    setSelectedPlayerId(id);
  }, []);

  const handleClosePlayerDetails = useCallback(() => {
    setSelectedPlayerId(undefined);
  }, []);

  const handleSearchClear = () => {
    setFilterBy((prev) => ({ ...prev, search: undefined }));
    setSearchCompleted(false);
  };

  const handleSearchSubmit = (text: string) => {
    const searchText = text?.trim();
    setFilterBy((prev) => ({ ...prev, search: searchText }));
    setSearchCompleted(true);
  };
  console.log('filteredPlayers', filteredPlayers);
  return (
    <BaseScreen>
      <PlayersSearchSort
        searchIconWidth={15}
        searchIconHeight={15}
        placeHolder="Search Holdings"
        label="Search"
        handleOnSubmit={handleSearchSubmit}
        handleSearchClear={handleSearchClear}
      />
      <PlayersFilter setFilterBy={setFilterBy} />
      <TrendingPlayers
        players={filteredPlayers}
        playerPrices={playerPrices.data}
        playerHoldings={userHoldings.data}
        listTitle={
          !searchCompleted
            ? 'Trending'
            : `${filteredPlayers.length} Result${filteredPlayers.length == 1 ? '' : 's'} Found`
        }
        handlePlayerSelect={handleOpenPlayerDetails}
        closePlayerDetails={handleClosePlayerDetails}
        selectedPlayerId={selectedPlayerId}
      />
    </BaseScreen>
  );
};

export default PlayersLandingScreen;
