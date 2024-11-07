import { View } from 'react-native';
import { useRef, useState } from 'react';
import CustomText from '@/components/general/Text';
import DropDownBtn from '@/components/general/buttons/DropDownBtn';
import Button from '@/components/general/buttons/Button';
import { colors } from '@/styles/theme/colors';
import DropDownBottomSheet from '@/components/general/inputs/DropDown/DropDownBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import NoOfGamesDDList from './NoOfGamesDDList';
import { noOfGamesList } from '@/constants/players';
import { useNavigation } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainBottomTabListT } from '@/types/navigation/RootStackParams';
import { useAppSelector } from '@/store/index';
import TopPerformersList from '@/components/home/HomeScreen/TopPerformersList';

interface ITopPerformingPlayers {
  handlePlayerSelect: (id: string) => void;
}

type HomeScreenProps = BottomTabScreenProps<MainBottomTabListT, 'Home'>;

const TopPerformingPlayers = ({ handlePlayerSelect }: ITopPerformingPlayers) => {
  const { playerPrices, players, topPerformers } = useAppSelector((state) => state.playersSlice);
  console.log("from top performing players");
  console.log('playerPrices', playerPrices);
  console.log('players', players);
  console.log('topPerformers', topPerformers);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedNoOfGame, setSelectedNoOfGame] = useState(noOfGamesList[3]);

  const naviation = useNavigation<HomeScreenProps['navigation']>();

  return (
    <View style={{ gap: 24 }} className="mt-8">
      <View className="flex-row px-[30px] justify-between items-center">
        <View style={{ gap: 8 }} className="flex-row items-center">
          <CustomText textClass="leading-[21px] tracking-[0.56px] text-brand-content">
            Top Performer in
          </CustomText>
          <DropDownBtn
            onPress={() => bottomSheetRef.current?.present()}
            iconProps={{ fill: colors['brand-content'] }}
            textProps={{ textClass: 'text-brand-content' }}
            title={`${selectedNoOfGame} Games`}
          />
        </View>
        <Button
          variant="ghost"
          textClass="leading-[21px] tracking-[0.56px] text-brand-content"
          title="See All"
          onPress={() => naviation.navigate('PlayersStack', { screen: 'PlayersLanding' })}
        />
      </View>
      <TopPerformersList
        loading={players.status === 'loading'}
        topPerformers={topPerformers.data}
        playerPrices={playerPrices.data}
        players={players.data}
        selectedNoOfGame={selectedNoOfGame}
        handlePlayerSelect={handlePlayerSelect}
      />
      {/* <DropDownBottomSheet title="Select Number of Matches" ref={bottomSheetRef} snapPoints={[280]}>
        <NoOfGamesDDList
          selectedNoOfGames={selectedNoOfGame}
          handleSelect={(item) => setSelectedNoOfGame(item)}
        />
      </DropDownBottomSheet> */}
    </View>
  );
};

export default TopPerformingPlayers;
