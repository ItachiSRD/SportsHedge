import DropDownBottomSheet from '@/components/general/inputs/DropDown/DropDownBottomSheet';
import SearchAndSort, { ISearchAndSort } from '@/components/general/inputs/Search';
import PlayersSortDDList from '@/components/players/PlayersLanding/PlayersSortDDList';
import { PLAYER_SORT_BY } from '@/constants/playerfilters';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useRef, useState } from 'react';

interface IPlayersSearch extends ISearchAndSort {}

const PlayersSearchSort = ({
  searchText,
  setSearchText,
  handleOnSubmit,
  handleSearchClear
}: IPlayersSearch) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectOrder, setSelectOrder] = useState<string>(PLAYER_SORT_BY[0]);

  return (
    <>
      <SearchAndSort
        searchIconWidth={15}
        searchIconHeight={15}
        placeHolder="Search Holdings"
        label="Search"
        searchText={searchText}
        setSearchText={setSearchText}
        handleSortTap={() => bottomSheetRef?.current?.present()}
        handleOnSubmit={(text) => handleOnSubmit && handleOnSubmit(text)}
        handleSearchClear={handleSearchClear}
      />
      <DropDownBottomSheet title="Sort by" ref={bottomSheetRef} snapPoints={[324]}>
        <PlayersSortDDList
          sortBy={PLAYER_SORT_BY}
          selectedOrder={selectOrder}
          handleSelect={(item) => (setSelectOrder(item), bottomSheetRef?.current?.close())}
        />
      </DropDownBottomSheet>
    </>
  );
};

export default PlayersSearchSort;
