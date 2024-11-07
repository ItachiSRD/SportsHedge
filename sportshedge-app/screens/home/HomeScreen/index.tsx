import { View, ScrollView } from 'react-native';
import HomeScreenHeader from '@/components/home/HomeScreen/HomeScreenHeader';
import HomeCarousel from './HomeCarousel';
import { useEffect, useMemo, useState } from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainBottomTabListT } from '@/types/navigation/RootStackParams';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation/RootStackParams';
import { CompositeScreenProps } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/store/index';
import { getFavoritePlayersAction, getPlayerPricesAction, getPlayersAction, getTopPerformersAction, getUserHoldingsAction, pollPricesAction, stopPollingPlayerPricesAction } from '@/store/slices/players/action';
import { playerIdsToFetchPricesFor } from './util/general';
import { useAuthStateContext } from '../../../context/auth';
import React from 'react';
import HomeScreenTabs from '@/components/home/HomeScreen/Tabs/HomeScreenTabs';
import HomeScreenTrending from '@/components/home/HomeScreen/Tabs/Trending';
import HomeScreenBanner from '@/components/home/HomeScreen/HomeScreenBanner';
import HomeScreenModal from '@/components/home/HomeScreen/Modal';
import FavoritePlayers from './FavoritePlayers';

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainBottomTabListT, 'Home'>,
  StackScreenProps<RootStackParamList>
>;

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const dispatch = useAppDispatch();
  const { authUser } = useAuthStateContext();
  const { playerPrices, favoritePlayers, topPerformers } = useAppSelector((state) => state.playersSlice);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>();

  const playerIds = useMemo(
    () =>
      playerIdsToFetchPricesFor(playerPrices.data, [...new Set([
        ...favoritePlayers.data,
        ...topPerformers.data
      ])]),
    [favoritePlayers.data, topPerformers.data]
  );

  useEffect(() => {
    dispatch(getPlayersAction());
    dispatch(getFavoritePlayersAction());
    dispatch(getTopPerformersAction());
    dispatch(getUserHoldingsAction());
    dispatch(pollPricesAction());

    return () => {
      dispatch(stopPollingPlayerPricesAction());
    };
  }, []);

  useEffect(() => {
    if (playerIds.length) {
      dispatch(getPlayerPricesAction({ playerIds }));
    }
  }, [playerIds]);


  const handleOpenPlayerDetails = (id: string) => {
    setSelectedPlayerId(id);
  };

  const [selectedTab, setSelectedTab] = useState<'Trending' | 'Favourites'>('Trending');
  return (
      <View className="flex-1">
          <View className='bg-theme-primary pt-[60px]'>
            <HomeScreenHeader
              userName={authUser?.displayName || ''}
              onSearchPress={() => navigation.navigate('PlayersStack', { screen: 'PlayersLanding' })}
              onNotificationPress={() => navigation.navigate('Notifications')}
            />
            <HomeCarousel />
          </View>
          <HomeScreenBanner />
          <View className='mx-[30px] flex-1 mt-[9px]'>
            <HomeScreenTabs selectedTab={selectedTab} handleToggle={setSelectedTab} />
            <View className="bg-theme-secondary flex-1">
              {selectedTab == 'Trending' ? <HomeScreenTrending /> : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <FavoritePlayers selectedPlayerId={selectedPlayerId} setSelectedPlayerId={setSelectedPlayerId} handlePlayerSelect={handleOpenPlayerDetails} />
                </ScrollView>
              )} 
            </View>
          </View>
          <HomeScreenModal/>
      </View>
  );
};

export default HomeScreen;
