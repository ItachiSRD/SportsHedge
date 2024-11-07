import { View } from 'react-native';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import CustomBottomSheet from '@/components/general/BottomSheet';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import PlayerStockAvailability from '@/components/players/PlayerDetails/PlayerStockAvailability';
import Button from '@/components/general/buttons/Button';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { TransactionSideT } from '@/types/entities/order';
import { useAppDispatch, useAppSelector } from '@/store/index';
import { startPollingPlayerDetailsAction, stopPollingPlayerDetailsAction, toggleFavoritePlayersAction } from '@/store/slices/players/action';
import { IPlayerBasicInfo } from '@/types/entities/player';
import { PlayerDetailSliceDataT } from '@/types/reducers/players';
import CustomLoader from '@/components/general/status/Loader/CustomLoader';
import ChvronRightIcon from '@/assets/icons/chevron-right.svg';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackListT } from '@/types/navigation/RootStackParams';
import { NO_OF_GAMES_FILTER } from '@/constants/playerfilters';
import PlayerPriceChart from '@/screens/players/PlayerDetails/PlayerPriceChart';
import BeesDetailCard from './DetailCard';
import CustomText from '@/components/general/Text';
import { colors } from '@/styles/theme/colors';
import PressableBtn from '@/components/general/buttons/PressableBtn';
import { RootStackParamList } from '@/types/navigation/RootStackParams';

type navigationPropT = StackNavigationProp<ProfileStackListT & RootStackParamList>;

interface IBowlerBeesDetailsProps {
  playerId?: string;
  closePlayerDetails?: () => void;
  bottomSheetRef: React.RefObject<BottomSheetModal>;
}

const BowlerBeesDetails = (props: IBowlerBeesDetailsProps) => {

  const [selectedNoOfGames, setSelectedNoOfGames] = useState(NO_OF_GAMES_FILTER[3]);
  
  const { playerId, closePlayerDetails , bottomSheetRef} = props;
  console.log('playerId', playerId);
  console.log('closePlayerDetails', closePlayerDetails);
  const playerDetailRef = useRef<BottomSheetModal>(null);
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();
  const navigation = useNavigation<navigationPropT>();
  const dispatch = useAppDispatch();
  const { players, favoritePlayers, playerPrices, playerDetails } = useAppSelector((state) => state.playersSlice);

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
      ref={bottomSheetRef}
      index={1}
      snapPoints={['30%', '60%', '70%']}>
        <View className='flex-1'>
          <BeesDetailCard
            name='Bowler Bees'
            quantity={10}
            isFavorite={isFavoritePlayer}
            toggleFavorite={toggleFavoritePlayer}
          />
          <View className='mx-[30px] mb-[24px] flex-row'>
            <CustomText fontWeight={700} className=' text-[12px] leading-[18px] tracking-[0.48px] text-theme-content-primary'>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
            </CustomText>
            <Button
            variant="ghost"
            title="Read More"
            containerClass="border-b border-theme-content-secondary self-center"
            textClass="text-brand-content text-xs leading-[18px] tracking-[0.48px]"
            />
          </View>
          {playerDetail?.status === 'loading' ? (
            <CustomLoader containerClass="w-full justify-center items-center" />
          ) : (
            <BottomSheetScrollView>
              <PlayerPriceChart
                playerPrice={playerPrices.data[playerId!]}
                performancePoints={playerDetail?.data?.performancePoints}
                selectedNoOfGames={selectedNoOfGames}
                setSelectedNoOfGames={setSelectedNoOfGames}
              />
              <View style={{ gap: 30 }}>
              <View className='border-b border-theme-primary'>
                <PressableBtn className='py-[24px]' onPress={() => (
                  navigation.navigate('BowlerBees'),
                  bottomSheetRef.current?.close()
                )}>
                  <View className='flex-row justify-between items-center px-[30px]'>
                    <CustomText className='text-brand-content text-[14px] leading-[21px] tracking-[0.56px]'>
                      Rationale for the Portfolio
                    </CustomText>
                    <ChvronRightIcon fill={colors['theme-content-active']} width={24} height={24} />
                  </View>
                </PressableBtn>
                </View>
                {playerDetail?.data?.isPlaying ? null : (
                  <View className='px-[30px]'>
                    <PlayerStockAvailability
                    buyAvailability={playerDetail?.data?.stockAvailability.buy}
                    sellAvailability={playerDetail?.data?.stockAvailability.sell}
                      />
                  </View>
                )}
                <View style={{ gap: 30 }} className="flex-row items-center px-[30px]">
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
            </BottomSheetScrollView>
          )}
        </View>
    </CustomBottomSheet>
  );
};

export default BowlerBeesDetails;