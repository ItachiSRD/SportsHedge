import { View, Dimensions, ActivityIndicator } from 'react-native';
import React from 'react';
import BaseScreen from '@/screens/BaseScreen';
import BackgroundImage from '@/assets/images/place-order/order-status-bg.svg';
import OrderedPlayerInfo from '@/components/players/PlaceOrder/OrderedPlayerInfo';
import OrderPlacedMessage from '@/components/players/PlaceOrder/OrderPlacedMessage';
import Button from '@/components/general/buttons/Button';
import { TransactionSideT } from '@/types/entities/order';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '@/store/index';
import { updatePlaceOrderStatus } from '@/store/slices/order/reducer';

interface IPlaceOrderStatusProps {
  price: number;
  qty: number;
  side: TransactionSideT
  playerName: string;
  status: 'success' | 'loading'
}

const PlaceOrderStatus = ({ price, qty, side, playerName, status }: IPlaceOrderStatusProps) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const width = Dimensions.get('window').width;

  const handleDone = () => {
    dispatch(updatePlaceOrderStatus({ status: 'init' }));
    navigation.goBack();
  };

  return (
    <BaseScreen style={{ position: 'relative' }}>
      <View className="flex-1 justify-center items-center z-[1] p-[30px] py-[22px]">
        {status === 'loading' ? (
          <ActivityIndicator size={24} color="#FFF" />
        ) : (
          <>
            <OrderedPlayerInfo
              name={playerName}
              transactionType={side}
              qty={qty}
              orderPlacedAtPrice={price}
            />
            <View style={{ gap: 48 }} className="w-full">
              <OrderPlacedMessage />
              <Button
                variant="outlined"
                size="large"
                title="Done"
                containerClass="w-full border-brand-content rounded-[10px]"
                textClass="text-brand-content"
                onPress={handleDone}
              />
            </View>
          </>
        )}
      </View>
      <BackgroundImage
        width={width}
        className={`absolute ${status === 'loading' ? '' : '-top-[60px]'}`}
      />
    </BaseScreen>
  );
};

export default PlaceOrderStatus;