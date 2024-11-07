import { View, FlatList, ActivityIndicator } from 'react-native';
import { useState, useRef, useMemo } from 'react';
import SearchAndSort from '@/components/general/inputs/Search';
import PortfolioOrderCard from '@/components/portfolio/PortfolioOrderCard';
import DropDownBottomSheet from '@/components/general/inputs/DropDown/DropDownBottomSheet';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import DropwDownItem from '@/components/general/inputs/DropDown/DropwDownItem';
import { SORT_ORDER_OPTIONS } from '@/constants/portfolio';
import { sortFilterOrders } from './util/order';
import { useModal } from '@/hooks/general/useModal';
import CancelOrerPopup from '@/components/portfolio/CancelOrerPopup';
import { useAppDispatch, useAppSelector } from '@/store/index';
import { cancelOrderAction, getOrdersAction } from '@/store/slices/order/action';
import { IOrderData } from '@/types/entities/order';
import ModalComponent from '@/components/general/Modal/ModalComponent';
import { updateCanelOrderStatus } from '@/store/slices/order/reducer';
import { colors } from '@/styles/theme/colors';

const PortfolioOrders = () => {
  const dispatch = useAppDispatch();
  const { cancelOrder, orders } = useAppSelector((state) => state.orderSlice);
  const players = useAppSelector((state) => state.playersSlice.players);

  const [searchText, setSearchText] = useState('');
  const [tappedOrder, setTappedOrder] = useState<IOrderData>();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [sortBy, setSortBy] = useState(SORT_ORDER_OPTIONS[1]);
  const { openModal, closeModal, isVisible } = useModal({});

  const orderStatus = tappedOrder && cancelOrder[tappedOrder.orderId]?.status;
  if (orderStatus && (orderStatus === 'success' || orderStatus === 'error')) {
    closeModal();
    setTappedOrder(undefined);
    dispatch(updateCanelOrderStatus({ orderId: tappedOrder.orderId, status: 'init' }));
  }

  const filteredOrders = useMemo(
    () => sortFilterOrders(orders.data, players.data, searchText, sortBy),
    [searchText, orders.data, sortBy]
  );

  const fetchOrder = () => {
    if (orders.hasMoreData) {
      dispatch(getOrdersAction({ pageNo: orders.pageNo + 1 }));
    }
  };

  const filterOrders = (filterText: string) => {
    setSearchText(filterText);
  };

  const clearFilter = () => setSearchText('');

  const handleSort = (sortBy: string) => {
    setSortBy(sortBy);
    bottomSheetRef.current?.close();
  };

  const handleOpenOrderTapped = (order: IOrderData) => {
    setTappedOrder(order);
    openModal();
  };

  const cancelOrderGoBack = () => {
    closeModal();
    setTappedOrder(undefined);
  };

  const handleCancelOrder = () => {
    dispatch(cancelOrderAction({ orderId: tappedOrder!.orderId }));
  };

  return (
    <View className="flex-1">
      <SearchAndSort
        label="Search"
        handleSearchClear={clearFilter}
        handleOnSubmit={filterOrders}
        placeHolder="Search Orders"
        handleSortTap={() => bottomSheetRef.current?.present()}
      />
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.orderId}
        onEndReached={fetchOrder}
        onEndReachedThreshold={0.1} // Trigger the `onEndReached` callback when the end of the content is within 10% of the visible content
        contentContainerStyle={{ gap: 6, paddingHorizontal: 30, paddingBottom: 22 }}
        renderItem={({ item }) => (
          <PortfolioOrderCard
            transactionType={item.side}
            orderStatus={item.status}
            orderPlacedAt={item.date}
            orderedAtPrice={item.price}
            playerName={players.data[item.instrument]?.name}
            qty={item.size}
            ltp={item.price}
            handleOnPress={() => handleOpenOrderTapped(item)}
          />
        )}
        ListFooterComponent={
          orders.status === 'loading' ? (
            <ActivityIndicator size={24} color={colors['brand-content']} />
          ) : null
        }
      />
      <DropDownBottomSheet title="Sort Orders by" ref={bottomSheetRef} snapPoints={[324]}>
        <BottomSheetFlatList
          contentContainerStyle={{ gap: 20, paddingVertical: 32 }}
          showsVerticalScrollIndicator={false}
          data={SORT_ORDER_OPTIONS}
          keyExtractor={(item) => `${item}`}
          renderItem={({ item }) => (
            <DropwDownItem text={item} focused={item === sortBy} onPress={() => handleSort(item)} />
          )}
        />
      </DropDownBottomSheet>
      <ModalComponent customModal isVisible={isVisible}>
        {tappedOrder ? (
          <CancelOrerPopup
            {...tappedOrder}
            playerName={players.data[tappedOrder.instrument]?.name}
            transactionSide={tappedOrder.side}
            qty={tappedOrder.size}
            handleGoBack={cancelOrderGoBack}
            handleCancelOrer={handleCancelOrder}
            cancellingOrder={cancelOrder[tappedOrder.orderId]?.status === 'loading'}
          />
        ) : null}
      </ModalComponent>
    </View>
  );
};

export default PortfolioOrders;
