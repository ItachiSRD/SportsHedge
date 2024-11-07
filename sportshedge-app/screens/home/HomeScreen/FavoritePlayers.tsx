import React from 'react';
import { View } from 'react-native';
import { useCallback, useRef, useState } from 'react';
import CustomText from '@/components/general/Text';
import DropDownBtn from '@/components/general/buttons/DropDownBtn';
import { colors } from '@/styles/theme/colors';
import NoOfGamesDDList from './NoOfGamesDDList';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import DropDownBottomSheet from '@/components/general/inputs/DropDown/DropDownBottomSheet';
import { noOfGamesList } from '@/constants/players';
import FavoritePlayersList from '@/components/home/HomeScreen/FavoritePlayersList';
import { useAppSelector } from '@/store/index';
import FavouritesSection from '@/components/home/HomeScreen/Tabs/Favourites';
import PlayerDetails from '@/screens/players/PlayerDetails';

interface IFavoritePlayers {
  handlePlayerSelect: (id: string) => void;
  selectedPlayerId?: string;
  setSelectedPlayerId: (id?: string) => void;
}

const FavoritePlayers = ({ handlePlayerSelect, setSelectedPlayerId, selectedPlayerId }: IFavoritePlayers) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { playerPrices, players, favoritePlayers, userHoldings } = useAppSelector((state) => state.playersSlice);
  console.log('favoritePlayers', favoritePlayers);
  const [selectedNoOfGame, setSelectedNoOfGame] = useState(noOfGamesList[3] || 30);

  const loading = favoritePlayers.status === 'loading' || players.status === 'loading';
  
  const handleClosePlayerDetails = useCallback(() => {
    setSelectedPlayerId(undefined);
  }, []);

  
  if (!favoritePlayers.data.length && !loading) {
    console.log("wem in");
    return <FavouritesSection />;
  }else{
    console.log("we our ");
  }



  return (
    <View>
      <View className="flex-row items-center justify-between mt-4">
        <CustomText textClass="text-xs text-theme-content-active leading-[18px] tracking-[0.48px]">
          Player
        </CustomText>
        <View style={{ gap: 8 }} className="flex-row items-center mt-2.5">
          <CustomText className="text-theme-content-active text-xs">Change in</CustomText>
          <DropDownBtn
            onPress={() => bottomSheetRef.current?.present()}
            iconProps={{ fill: colors['theme-content-active'] }}
            textProps={{ textClass: 'text-theme-content-active text-xs' }}
            title={`${selectedNoOfGame} Games`}
          />
        </View>
      </View>
      <FavoritePlayersList
        loading={loading}
        playerHoldings={userHoldings.data}
        playerPrices={playerPrices.data}
        players={players.data}
        favoritePlayers={favoritePlayers.data}
        selectedNoOfGame={selectedNoOfGame}
        handlePlayerSelect={handlePlayerSelect}
      />
      <DropDownBottomSheet title="Select Number of Matches" ref={bottomSheetRef} snapPoints={[280]}>
        <NoOfGamesDDList
          selectedNoOfGames={selectedNoOfGame}
          handleSelect={(item) => setSelectedNoOfGame(item)}
        />
      </DropDownBottomSheet>
      <PlayerDetails
        closePlayerDetails={handleClosePlayerDetails}
        playerId={selectedPlayerId}
      />
    </View>
  );
};

export default FavoritePlayers;
