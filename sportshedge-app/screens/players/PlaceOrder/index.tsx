import { ScrollView, View } from 'react-native';
import { useState, useRef, useCallback, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { PlayersStackT } from '@/types/navigation/RootStackParams';
import BaseScreen from '@/screens/BaseScreen';
import PlaceOrderPlayerInfo from '@/components/players/PlaceOrder/PlaceOrderPlayerInfo';
import SwitchTab from '@/components/general/Tab/SwitchTab';
import StockQuantityAndPrice from '@/components/players/PlaceOrder/StockQuantityAndPrice';
import AvailableFundsCard from '@/components/players/PlaceOrder/AvailableFundsCard';
import PlaceOrderBottomBar from '@/components/players/PlaceOrder/PlaceOrderBottomBar';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import PriceDetailsBottomSheet from '@/components/players/PlaceOrder/PriceDetailsBottomSheet';
import { LIMIT_TRANSACTION_FEE_PERCENTAGE, MARKET_TRANSACTION_FEE_PERCENTAGE } from '@/constants/order';
import { useModal } from '@/hooks/general/useModal';
import InsufficientBalance from '@/components/profile/Wallet/InsufficientBalance';
import Toast from '@/components/general/Toast';
import { TransactionSideT, TransactionTypeT } from '@/types/entities/order';
import ScreenHeader from '@/components/general/ScreenHeader';
import { useAppDispatch, useAppSelector } from '@/store/index';
import { validateOrderPlacement } from './util/order';
import { placeOrderAction } from '@/store/slices/order/action';
import { closePlaceOrderToast } from '@/store/slices/order/reducer';
import PlaceOrderStatus from './PlaceOrderStatus';
import ModalComponent from '@/components/general/Modal/ModalComponent';
import { roundOffNumber } from '@/utils/number';
import CustomText from '@/components/general/Text';
import InfoCircle from '@/assets/icons/info-circle.svg';

type PlaceOrderScreenProps = StackScreenProps<PlayersStackT, 'PlaceOrders'>;

const transactionSides = ['buy', 'sell'];
const transactionTypes: TransactionTypeT[] = ['market', 'limit'];

const PlaceOrderScreen = ({ route, navigation }: PlaceOrderScreenProps) => {
  const { playerData, transactionSide, playerId } = route.params;
  const dispatch = useAppDispatch();

  console.log('player', playerData, playerId);

  const priceBottomSheetRef = useRef<BottomSheetModal>(null);
  const { openModal, closeModal, isVisible } = useModal({});
  const availableBalance = useAppSelector((state) => state.userSlice.user?.funds) || 0;
  const { playerPrices, userHoldings } = useAppSelector((state) => state.playersSlice);
  const { placeOrder } = useAppSelector((state) => state.orderSlice);

  const price = playerPrices.data[playerId]?.price || 0;
  const playerHolding = userHoldings.data[playerId];

  const [trxSide, setTrxSide] = useState(transactionSide);
  console.log('trxSide', trxSide)
  const [trxType, setTrxType] = useState<TransactionTypeT>(transactionTypes[0]);
  console.log('trxType', trxType)
  const [stockQty, setStockQty] = useState(1);
  const [stockPrice, setStockPrice] = useState(price);

  // If the route has changed then update the state
  useEffect(() => {
    setTrxSide(transactionSide);
    setStockQty(1);
    setStockPrice(price);
  }, [route]);

  const incrementStockQty = useCallback(() => setStockQty((prev) => prev + 1), []);
  const decrementStockQty = useCallback(() => setStockQty((prev) => (prev <= 1 ? 1 : prev - 1)), []);

  const orderValue = (trxType === 'market' ? price : stockPrice) * stockQty;
  const trxFeePercentage = trxType === 'limit' ? LIMIT_TRANSACTION_FEE_PERCENTAGE : MARKET_TRANSACTION_FEE_PERCENTAGE;
  const transactionFee = roundOffNumber((trxFeePercentage / 100) * orderValue);

  const handlePlaceOrder = () => {
    const orderAmount = orderValue + transactionFee;
    const canPlaceOrder = validateOrderPlacement(trxSide, availableBalance, orderAmount);
    if (!canPlaceOrder) return openModal();
    dispatch(
      placeOrderAction({
        type: trxType,
        instrumentType:"PLAYER",
        side: trxSide,
        instrumentId: playerId,
        price: stockPrice,
        size: stockQty
      })
    );
  };

  if (placeOrder.status === 'loading' || placeOrder.status === 'success') {
    return (
      <PlaceOrderStatus
        playerName={playerData.name}
        status={placeOrder.status}
        price={stockPrice}
        side={trxSide}
        qty={stockQty}
      />
    );
  }

  return (
    <BaseScreen style={{ justifyContent: 'space-between', gap: 20 }}>
      <ScrollView>
        <View className="px-[30px] pt-[22px] flex-1">
          <ScreenHeader 
            title='Place Order' 
            handleGoBack={() => navigation.goBack()}
          />
          <View style={{ gap: 32 }} className="flex-1 py-[42px]">
            <PlaceOrderPlayerInfo
              name={playerData.name}
              countryCode={playerData.team}
              playerRole={playerData.role}
              quantity={playerHolding}
              price={price}
            />
            <SwitchTab
              tabs={transactionSides}
              activeTab={trxSide}
              setActiveTab={(tab) => setTrxSide(tab as TransactionSideT)}
            />
            <SwitchTab
              tabs={transactionTypes}
              tabsText={['Market Order', 'Limit Order']}
              activeTab={trxType}
              setActiveTab={(tab) => setTrxType(tab as TransactionTypeT)}
            />
            <StockQuantityAndPrice
              stockPrice={stockPrice}
              handlePriceChange={setStockPrice}
              stockQty={stockQty}
              handleStockQty={setStockQty}
              canChangePrice={trxType === 'limit'}
              handleDecrementStockQty={decrementStockQty}
              handleIncrementStockQty={incrementStockQty}
            />
            {trxSide === 'buy' && (
              <View style={{gap: 8}} className='flex-row items-center'>
                <CustomText fontWeight={500} className='text-[12px] text-brand-content leading-[18px] tracking-[0.48px]'>
                  You can hold up to 7 games max
                </CustomText>
                <InfoCircle width={16} height={16}/>
            </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View>
        <AvailableFundsCard fundBalance={availableBalance} />
        <View className="h-[1px] bg-global-gray-50" />
        <PlaceOrderBottomBar
          transactionType={trxSide as TransactionSideT}
          totalOrderValue={orderValue + transactionFee}
          handleViewDetails={() => priceBottomSheetRef.current?.present()}
          handlePlaceOrder={handlePlaceOrder}
          btnProps={{
            disabled: trxSide === 'sell' && stockQty > playerHolding,
          }}
        />
      </View>
      <PriceDetailsBottomSheet
        orderValue={orderValue}
        transactionFee={transactionFee}
        ref={priceBottomSheetRef}
      />
      <ModalComponent isVisible={isVisible} onClose={closeModal}>
        <InsufficientBalance text="You don't have sufficient money to place the order" />
      </ModalComponent>
      <Toast
        type={placeOrder.status === 'error' ? 'error' : 'info'}
        bottomOffset={141}
        visible={placeOrder.showToast}
        message={placeOrder.toastMessagge}
        
        onClose={() => dispatch(closePlaceOrderToast())}
      />
    </BaseScreen>
  );
};

export default PlaceOrderScreen;
