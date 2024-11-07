import { ICustomTextProps } from '@/components/general/Text';
import { PRICE_FILTER, ROLE_FILTER, ROLE_FILTER_TEXT, TEAM_FILTER, TEAM_FILTER_TEXT } from '@/constants/playerfilters';
import { useFilterDD } from '@/hooks/general/useFilterDD';
import { colors } from '@/styles/theme/colors';
import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { FilterPLayersByT, FilterTermsT } from './util/player';

const textProps: ICustomTextProps = {
  textClass: 'text-[14px] leading-[21px] tracking-[0.64px] text-global-gray-20'
};

const iconProps: SvgProps = {
  style: { marginTop: 2 },
  fill: colors['global-gray-50'],
  width: 15,
  height: 15,
  rotation: 90
};

interface IPlayerFilterProps {
  setFilterBy: React.Dispatch<React.SetStateAction<FilterPLayersByT>>;
}

const PlayersFilter = ({ setFilterBy }: IPlayerFilterProps) => {
  const [defaultTeamOption, defaultRoleOption, defaultPriceOption] = [
    TEAM_FILTER[0],
    ROLE_FILTER[0],
    PRICE_FILTER[0]
  ];

  const handleFilter = useCallback((filterBy: FilterTermsT, value: string) => {
    setFilterBy((prev) => ({ ...prev, [filterBy]: value === 'all' ? undefined : value }));
  }, []);

  const {
    FilterComponent: TeamFilterComponent,
    DropDownBottomSheetComponent: TeamDDBottomSheetComponent
  } = useFilterDD({
    title: 'Team',
    filterList: TEAM_FILTER,
    filterListText: TEAM_FILTER_TEXT,
    handleFilter: (value) => handleFilter('team', value),
    snapPoints: [588],
    defaultOrder: defaultTeamOption,
    pressableClass: 'w-1/3 border-b border-global-gray-90 py-[19.5px]',
    textProps,
    iconProps
  });

  const {
    FilterComponent: RoleFilterComponent,
    DropDownBottomSheetComponent: RoleDDBottomSheetComponent
  } = useFilterDD({
    title: 'Role',
    snapPoints: [319],
    filterList: ROLE_FILTER,
    filterListText: ROLE_FILTER_TEXT,
    handleFilter: (value) => handleFilter('role', value),
    defaultOrder: defaultRoleOption,
    pressableClass: 'w-1/3 border-b border-l border-r border-global-gray-90 py-[19.5px]',
    textProps,
    iconProps
  });

  const {
    FilterComponent: PriceFilterComponent,
    DropDownBottomSheetComponent: PriceDDBottomSheetComponent
  } = useFilterDD({
    title: 'Price',
    snapPoints: [319],
    filterList: PRICE_FILTER,
    defaultOrder: defaultPriceOption,
    pressableClass: 'w-1/3 border-b border-global-gray-90 py-[19.5px]',
    textProps,
    iconProps
  });

  return (
    <>
      <View className="flex flex-row">
        {TeamFilterComponent}
        {RoleFilterComponent}
        {PriceFilterComponent}
      </View>
      {TeamDDBottomSheetComponent}
      {RoleDDBottomSheetComponent}
      {PriceDDBottomSheetComponent}
    </>
  );
};

export default memo(PlayersFilter);
