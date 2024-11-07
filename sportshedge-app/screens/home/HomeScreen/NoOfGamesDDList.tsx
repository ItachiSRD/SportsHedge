import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import DropwDownItem from '@/components/general/inputs/DropDown/DropwDownItem';
import { noOfGamesList } from '@/constants/players';

interface INoOfGamesDDListProps {
    selectedNoOfGames: number;
    handleSelect: (item: number) => void;
}

const NoOfGamesDDList = ({ selectedNoOfGames, handleSelect }: INoOfGamesDDListProps) => {
  return (
    <BottomSheetFlatList
      contentContainerStyle={{ gap: 20, paddingVertical: 32 }}
      showsVerticalScrollIndicator={false}
      data={noOfGamesList}
      keyExtractor={(item) => `${item}`}
      renderItem={({ item }) => (
        <DropwDownItem
          text={item + ' Games'}
          focused={item === selectedNoOfGames}
          onPress={() => handleSelect(item)}
        />
      )}
    />
  );
};

export default NoOfGamesDDList;