import DropwDownItem from '@/components/general/inputs/DropDown/DropwDownItem';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React from 'react';

interface IPlayersSort {
  sortBy: string[];
  selectedOrder: string;
  handleSelect: (item: string) => void;
}

const PlayersSortDDList = ({ sortBy, selectedOrder, handleSelect }: IPlayersSort) => {
  return (
    <BottomSheetFlatList
      contentContainerStyle={{ gap: 20, paddingVertical: 32 }}
      showsVerticalScrollIndicator={false}
      data={sortBy}
      keyExtractor={(item) => `${item}`}
      renderItem={({ item }) => (
        <DropwDownItem
          text={item}
          focused={item === selectedOrder}
          onPress={() => handleSelect(item)}
        />
      )}
    />
  );
};

export default PlayersSortDDList;
