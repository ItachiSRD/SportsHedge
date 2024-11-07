import { View } from 'react-native';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import CustomBottomSheet from '@/components/general/BottomSheet';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import PlayerDetailCard from '@/components/players/PlayerDetails/PlayerDetailCard';
import PlayerPriceChart from './PlayerPriceChart';
import PlayerStockAvailability from '@/components/players/PlayerDetails/PlayerStockAvailability';
import Button from '@/components/general/buttons/Button';
import PlayerMarketDepth from './PlayerMarketDepth';
import HowToTradeVideo from '@/components/players/PlayerDetails/HowToTradeVideo';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { TransactionSideT } from '@/types/entities/order';
import PlayerPerformance from '@/components/players/PlayerDetails/PlayerPerformance';
import { useAppDispatch, useAppSelector } from '@/store/index';
import { startPollingPlayerDetailsAction, stopPollingPlayerDetailsAction, toggleFavoritePlayersAction } from '@/store/slices/players/action';
import { IPlayerBasicInfo } from '@/types/entities/player';
import { PlayerDetailSliceDataT } from '@/types/reducers/players';
import CustomLoader from '@/components/general/status/Loader/CustomLoader';
import { HOW_TO_USE_VIDEO } from '@/constants/videos';
import InfoHelpButton from '@/components/players/PlayerDetails/InfoHelpButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackListT } from '@/types/navigation/RootStackParams';
import { NO_OF_GAMES_FILTER } from '@/constants/playerfilters';
import React from 'react';

type navigationPropT =  StackNavigationProp<ProfileStackListT>;

interface IPlayerDetailsProps {
  playerId?: string;
  closePlayerDetails?: () => void;
}

const PlayerDetails = (props: IPlayerDetailsProps) => {

  const [selectedNoOfGames, setSelectedNoOfGames] = useState(NO_OF_GAMES_FILTER[3]);
  
  const { playerId, closePlayerDetails } = props;
  console.log('playerId', playerId);
  console.log('closePlayerDetails', closePlayerDetails);
  const playerDetailRef = useRef<BottomSheetModal>(null);
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();
  const navigation = useNavigation<navigationPropT>();
  const dispatch = useAppDispatch();
  const { players, favoritePlayers, playerPrices, userHoldings, playerDetails } = useAppSelector((state) => state.playersSlice);

  useLayoutEffect(() => {
    if (playerId) {
      playerDetailRef.current?.present();
      dispatch(startPollingPlayerDetailsAction(playerId));
    }
  }, [playerId]);

  const isFavoritePlayer = useMemo(
    () => favoritePlayers.data.some((favPlayerId) => favPlayerId === playerId),
    [favoritePlayers, playerId]
  );

  let playerData: IPlayerBasicInfo | undefined = undefined;
  let playerDetail: PlayerDetailSliceDataT | undefined = undefined;
  if (playerId) {
    playerData = players.data[playerId];
    playerData.id = playerId;
    playerDetail = playerDetails[playerId];
  }

  const handleOrder = (transactionSide: TransactionSideT) => {
    navigate('PlayersStack', { screen: 'PlaceOrders', params: { playerData, transactionSide, playerId } });
    playerDetailRef.current?.close();
  };

  const toggleFavoritePlayer = () => {
    if (playerId) dispatch(toggleFavoritePlayersAction({ playerId, isFavorite: isFavoritePlayer }));
  };

  const handleDismiss = () => {
    dispatch(stopPollingPlayerDetailsAction());
    if (closePlayerDetails){
      closePlayerDetails();
    }
  };

  return (
    <CustomBottomSheet
      enableDynamicSizing={false}
      onDismiss={handleDismiss}
      containerClass="px-0"
      ref={playerDetailRef}
      index={1}
      snapPoints={['30%', '60%', '90%']}>
      {playerData ? (
        <>
          <PlayerDetailCard
            name={playerData.name}
            countryCode={playerData.team}
            playerRole={playerData.role}
            quantity={userHoldings.data[playerId!]}
            isFavorite={isFavoritePlayer}
            toggleFavorite={toggleFavoritePlayer}
          />
          {playerDetail?.status === 'loading' ? (
            <CustomLoader containerClass="w-full justify-center items-center" />
          ) : (
            <BottomSheetScrollView>
              <HowToTradeVideo noOfTimesWatched={0} videoId={HOW_TO_USE_VIDEO} />
              <PlayerPriceChart
                playerPrice={playerPrices.data[playerId!]}
                performancePoints={playerDetail?.data?.performancePoints}
                selectedNoOfGames={selectedNoOfGames}
                setSelectedNoOfGames={setSelectedNoOfGames}
              />
              <View style={{ gap: 30 }} className="px-[30px] py-10">
                {/* <View style={{gap: 12}} className='flex-row justify-between'>
                <InfoHelpButton 
                  text='Scoring System' 
                  onPress={() => {
                    navigation.navigate('FantasyPointScoringSystem');
                    playerDetailRef.current?.close();
                  }}
                />
                <InfoHelpButton 
                  text='Pricing Model' 
                  onPress={() => {
                    navigation.navigate('PricingModel');
                    playerDetailRef.current?.close();
                  }}
                />
                </View> */}
                <PlayerPerformance
                  fantasyPoints={playerDetail?.data?.fantasyPoints}
                  performanceAvg={playerDetail?.data?.performanceAverage}
                  noOfGames={selectedNoOfGames || 0}
                />
                {playerDetail?.data?.isPlaying ? null : (
                  <PlayerStockAvailability
                    buyAvailability={playerDetail?.data?.stockAvailability.buy}
                    sellAvailability={playerDetail?.data?.stockAvailability.sell}
                  />
                )}
                <View style={{ gap: 30 }} className="flex-row items-center">
                  <Button
                    variant="solid"
                    size="large"
                    containerClass="flex-1 bg-[#29A86D] rounded-[10px]"
                    textClass="text-[16px] text-brand-content leading-[24px] tracking-[0.64px]"
                    title="Buy"
                    textProps={{
                      fontWeight: 700
                    }}
                    onPress={() => handleOrder('buy')}
                  />
                  <Button
                    variant="solid"
                    size="large"
                    containerClass="flex-1 bg-[#DA5C54] rounded-[10px]"
                    textClass="text-[16px] text-brand-content leading-[24px] tracking-[0.64px]"
                    title="Sell"
                    onPress={() => handleOrder('sell')}
                    textProps={{
                      fontWeight: 700
                    }}
                  />
                </View>
              </View>
              <PlayerMarketDepth
                bids={playerDetail?.data?.marketDepth.bids}
                offers={playerDetail?.data?.marketDepth.offers}
              />
            </BottomSheetScrollView>
          )}
        </>
      ) : null}
    </CustomBottomSheet>
  );
};

export default PlayerDetails;