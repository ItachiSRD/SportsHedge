import { View, FlatList } from 'react-native';
import { useState, useRef } from 'react';
import SearchAndSort from '@/components/general/inputs/Search';
import DropDownBottomSheet from '@/components/general/inputs/DropDown/DropDownBottomSheet';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import DropwDownItem from '@/components/general/inputs/DropDown/DropwDownItem';
import { SORT_HOLDING_OPTIONS, dummyHoldings } from '@/constants/portfolio';
import PortfolioHoldingCard from '@/components/portfolio/PortfolioHoldingCard';
import { sortHoldings } from './util/holdings';

const PortfolioHoldings = () => {
  const [filteredHoldings, setFilteredHoldings] = useState(dummyHoldings);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [sortBy, setSortBy] = useState(SORT_HOLDING_OPTIONS[1]);

  const filterHoldings = (filterText: string) => {
    setFilteredHoldings(
      dummyHoldings.filter((holding) => holding.playerName.toLowerCase().includes(filterText.toLowerCase()))
    );
  };

  const clearFilter = () => setFilteredHoldings(dummyHoldings);

  const handleSort = (sortBy: string) => {
    setSortBy(sortBy);
    const sortedHoldings = sortHoldings(filteredHoldings, sortBy);
    setFilteredHoldings(sortedHoldings!);
    bottomSheetRef.current?.close();
  };

  return (
    <View className="flex-1">
      <SearchAndSort
        handleSearchClear={clearFilter}
        label="Search"
        handleOnSubmit={filterHoldings}
        placeHolder="Search Holdings"
        handleSortTap={() => bottomSheetRef.current?.present()}
      />
      <FlatList
        data={filteredHoldings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 6, paddingHorizontal: 30, paddingBottom: 22 }}
        renderItem={({ item }) => <PortfolioHoldingCard {...item} />}
      />
      <DropDownBottomSheet title="Sort Holdings by" ref={bottomSheetRef} snapPoints={[324]}>
        <BottomSheetFlatList
          contentContainerStyle={{ gap: 20, paddingVertical: 32 }}
          showsVerticalScrollIndicator={false}
          data={SORT_HOLDING_OPTIONS}
          keyExtractor={(item) => `${item}`}
          renderItem={({ item }) => (
            <DropwDownItem text={item} focused={item === sortBy} onPress={() => handleSort(item)} />
          )}
        />
      </DropDownBottomSheet>
    </View>
  );
};

export default PortfolioHoldings;
