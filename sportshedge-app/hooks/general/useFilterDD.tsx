import { ICustomTextProps } from '@/components/general/Text';
import PlayersFilterBtn from '@/components/general/buttons/PlayerFilterBtn';
import DropDownBottomSheet from '@/components/general/inputs/DropDown/DropDownBottomSheet';
import DropwDownItem from '@/components/general/inputs/DropDown/DropwDownItem';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useRef, useState } from 'react';
import { SvgProps } from 'react-native-svg';

type IUseFilterDD = {
  title: string;
  filterList: string[];
  filterListText?: { [key: string]: string };
  handleFilter?: (value: string) => void;
  defaultOrder?: string;
  iconProps?: SvgProps;
  textProps?: ICustomTextProps;
  pressableClass?: string;
  snapPoints?: (string | number)[];
};

export const useFilterDD = ({
  title,
  filterList,
  filterListText,
  handleFilter,
  defaultOrder,
  iconProps,
  textProps,
  pressableClass,
  snapPoints = ['10%']
}: IUseFilterDD) => {
  const defaultOption = defaultOrder ?? filterList?.[0];
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedOrder, setSelectedOrder] = useState<string>(defaultOption);

  const handleSelect = (item: string) => {
    setSelectedOrder(item);
    if (handleFilter) {
      handleFilter(item);
    }
    bottomSheetRef?.current?.close();
  };

  const FilterComponent = (
    <PlayersFilterBtn
      onPress={() => bottomSheetRef?.current?.present()}
      pressableClasses={pressableClass}
      filterChanged={defaultOption !== selectedOrder}
      title={title}
      textProps={textProps}
      iconProps={iconProps}
    />
  );

  const DropDownBottomSheetComponent = (
    <DropDownBottomSheet title={`Select ${title}`} ref={bottomSheetRef} snapPoints={snapPoints}>
      <BottomSheetFlatList
        contentContainerStyle={{ gap: 20, paddingVertical: 32 }}
        showsVerticalScrollIndicator={false}
        data={filterList}
        keyExtractor={(item) => `${item}`}
        renderItem={({ item }) => (
          <DropwDownItem
            text={filterListText ?  filterListText[item] : item}
            focused={item === selectedOrder}
            onPress={() => handleSelect(item)}
          />
        )}
      />
    </DropDownBottomSheet>
  );

  return {
    selectedOption: selectedOrder,
    FilterComponent,
    DropDownBottomSheetComponent
  };
};
