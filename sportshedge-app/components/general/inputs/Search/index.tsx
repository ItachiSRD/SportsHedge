import SortIcon from '@/assets/icons/Arrow-up-arrow-down.svg';
import CrossIcon from '@/assets/icons/X.svg';
import SearchIcon from '@/assets/icons/search.svg';
import Tag from '@/components/general/Tag';
import CustomText, { ICustomTextProps } from '@/components/general/Text';
import Button from '@/components/general/buttons/Button';
import PressableBtn from '@/components/general/buttons/PressableBtn';
import TextInput from '@/components/general/inputs/TextInput';
import { colors } from '@/styles/theme/colors';
import { useState } from 'react';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export interface ISearchAndSort {
  searchIconWidth?: number;
  searchIconHeight?: number;
  searchText?: string;
  setSearchText?: (text: string) => void;
  handleSortTap?: () => void;
  handleSearchClear?: () => void;
  handleOnSubmit?: (text: string) => void;
  placeHolder?: string;
  label?: string;
  textClass?: string;
  textProps?: ICustomTextProps;
}

const SearchAndSort = ({
  searchIconWidth = 18,
  searchIconHeight = 18,
  placeHolder = '',
  searchText,
  setSearchText,
  handleSortTap,
  handleOnSubmit,
  label,
  textClass,
  textProps,
  handleSearchClear
}: ISearchAndSort) => {
  const [showSearch, setShowSearch] = useState(false);
  const [text, setText] = useState('');

  const handleClearSearch = () => {
    setText('');
    if (setSearchText) setSearchText('');
    if (handleSearchClear) handleSearchClear();
  };

  const handleCloseSearchBox = () => {
    handleClearSearch();
    setShowSearch(false);
  };

  const handleTextChange = (text: string) => {
    setText(text);
    if (setSearchText) setSearchText(text);
  };

  const handleSubmit = () => {
    setShowSearch(false);
    if (handleOnSubmit) handleOnSubmit(text);
  };

  if (showSearch) {
    return (
      <View className="h-[74px] justify-center border-b border-theme-primary pl-[11.5px] pr-[20.5px]">
        <TextInput
          autoFocus
          textClass="text-theme-content-secondary leading-[21px] tracking-[0.56px]"
          suffix={
            <PressableBtn onPress={handleCloseSearchBox}>
              <CrossIcon width={24} height={24} fill={colors['theme-content-secondary']} />
            </PressableBtn>
          }
          containerProps={{
            className: 'py-3 bg-transparent'
          }}
          onChangeText={handleTextChange}
          placeholder={placeHolder}
          onSubmitEditing={handleSubmit}
        />
      </View>
    );
  }

  const userInpText = searchText || text;

  const textClasses = twMerge(
    'text-global-gray-20 text-[14px] leading-[21px] tracking-[0.64px]',
    textClass
  );

  return (
    <View className="h-[74px] justify-center border-b border-theme-primary px-[30px]">
      <View className="flex-row items-center justify-between">
        {userInpText ? (
          <Tag title={userInpText} showRemove handleRemove={handleClearSearch} />
        ) : (
          <PressableBtn
            onPress={() => setShowSearch(true)}
            style={{ gap: 10 }}
            className="flex flex-1 flex-row p-2 items-center">
            <SearchIcon
              width={searchIconWidth}
              height={searchIconHeight}
              fill={colors['global-gray-20']}
            />
            {label ? (
              <CustomText {...textProps} textClass={textClasses}>
                {label}
              </CustomText>
            ) : (
              <></>
            )}
          </PressableBtn>
        )}
        <Button
          variant="ghost"
          style={{ gap: 10 }}
          textProps={{ fontWeight: 500 }}
          containerClass="p-2"
          leadingIcon={<SortIcon />}
          textClass="text-global-gray-20 leading-[21px] tracking-[0.56px]"
          title="Sort"
          onPress={handleSortTap}
        />
      </View>
    </View>
  );
};

export default SearchAndSort;
