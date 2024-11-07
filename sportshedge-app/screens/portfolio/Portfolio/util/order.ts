import { SORT_ORDER_OPTIONS } from '@/constants/portfolio';
import { IOrderData } from '@/types/entities/order';
import { IPlayers } from '@/types/entities/player';

export const filterOrdersBySearch = (orders: IOrderData[], players: IPlayers, searchText?: string) => {
  if (!searchText) return orders;

  const regexMatch = new RegExp(searchText, 'gi');
  return orders.filter((order) => players[order.instrument]?.name.match(regexMatch));
};


// TODO: Fix all the types while integration

export const sortByOrderStatus = (orders: IOrderData[]) => {
  const statusOrder: { [key: string]: number } = {
    INIT: 1,
    OPEN: 1,
    FULFILLED: 2,
    REJECTED: 3,
    CANCELLED: 4
  };

  return orders.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
};

export const sortByTransactionType = (orders: IOrderData[]) => {
  const buySellOrder: { [key: string]: number } = {
    buy: 1,
    sell: 2
  };

  return orders.sort((a, b) => buySellOrder[a.side] - buySellOrder[b.side]);
};

export type FilterTermsT = 'team' | 'price' | 'role' | 'search';
export type FilterPLayersByT = {
  [key in FilterTermsT]?: string;
}

export const sortFilterOrders = (orders: IOrderData[], players: IPlayers, search?: string, sortBy?: string) => {
  let filteredOrders = [ ...orders ];

  if (search) {
    filteredOrders = filterOrdersBySearch(filteredOrders, players, search);
  }

  if (sortBy === SORT_ORDER_OPTIONS[0]) {
    filteredOrders = sortByOrderStatus(filteredOrders);
  }

  // if (sortBy === SORT_ORDER_OPTIONS[1]) {
  //   filteredOrders = filteredOrders.sort((a, b) => players[a.instrument].name.localeCompare(players[b.instrument].name));
  // }

  if (sortBy === SORT_ORDER_OPTIONS[2]) {
    filteredOrders = sortByTransactionType(filteredOrders);
  }

  if (sortBy === SORT_ORDER_OPTIONS[3]) {
    filteredOrders = filteredOrders.sort((a, b) => {
      const bTimeStamp = new Date(b.date).getTime();
      const aTimeStamp = new Date(a.date).getTime();
      return bTimeStamp - aTimeStamp;
    });
  }

  if (sortBy === SORT_ORDER_OPTIONS[4]) {
    filteredOrders = filteredOrders.sort((a, b) => b.size - a.size);
  }

  return filteredOrders;
};
