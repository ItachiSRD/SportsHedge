import React from 'react';
import { View } from 'react-native';
import HomeScreenTabBtn from './HomeScreenTabBtn';

interface IHomeScreenTabsProps {
  selectedTab: 'Trending' | 'Favourites';
  handleToggle: (tab: 'Trending' | 'Favourites') => void;
}

const HomeScreenTabs = ({ selectedTab, handleToggle }: IHomeScreenTabsProps) => {

  return (
    <View className="border-b flex-row items-stretch border-outline-secondary">
      <HomeScreenTabBtn
        tabName="Trending"
        isActive={selectedTab === 'Trending'}
        onPress={() => handleToggle('Trending')}
      />
      <HomeScreenTabBtn
        tabName="Favourites"
        isActive={selectedTab === 'Favourites'}
        onPress={() => handleToggle('Favourites')}
      />
    </View>
  );
};

export default HomeScreenTabs;
