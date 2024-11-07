import { IGetPlayerDetailsSaga, IGetPlayerPricesSaga, IToggleFavoritePLayersSaga } from '@/types/sagas/players';

export const GET_PLAYERS_ACTION = 'GET_PLAYERS_ACTION';
export const GET_FAVORITE_PLAYERS_ACTION = 'GET_FAVORITE_PLAYERS_ACTION';
export const GET_TOP_PERFORMERS_ACTION = 'GET_TOP_PERFORMERS_ACTION';
export const GET_USER_HOLDINGS_ACTION = 'GET_USER_HOLDINGS_ACTION';
export const GET_PLAYER_PRICES_ACTION = 'GET_PLAYER_PRICES_ACTION';
export const POLL_PLAYER_PRICES_ACTION = 'POLL_PLAYER_PRICES_ACTION';
export const STOP_POLLING_PLAYER_PRICES_ACTION = 'STOP_POLLING_PLAYER_PRICES_ACTION';
export const TOGGLE_FAVORITE_PLAYER_ACTION = 'TOGGLE_FAVORITE_PLAYER_ACTION';
export const GET_PLAYER_DETAILS_ACTION = 'GET_PLAYER_DETAILS_ACTION';
export const POLL_PLAYER_DETAIL_ACTION = 'POLL_PLAYER_DETAIL_ACTION';
export const STOP_POLLING_PLAYER_DETAIL_ACTION = 'STOP_POLLING_PLAYER_DETAIL_ACTION';


export function getPlayersAction() {
  console.log(' get players action.ts')
  return {
    type: GET_PLAYERS_ACTION,

  };
}

export const getFavoritePlayersAction = () => {
  console.log(' get favourite  players action.ts')
  return {
    type: GET_FAVORITE_PLAYERS_ACTION,
  };
};

export const getTopPerformersAction = () => {
  return {
    type: GET_TOP_PERFORMERS_ACTION,
  };
};

export const getUserHoldingsAction = () => {
  return {
    type: GET_USER_HOLDINGS_ACTION
  };
};

export const getPlayerPricesAction = (payload: IGetPlayerPricesSaga['payload']) => {
  return {
    type: GET_PLAYER_PRICES_ACTION,
    payload
  };
};

export const pollPricesAction = () => {
  return {
    type: POLL_PLAYER_PRICES_ACTION
  };
};

export const stopPollingPlayerPricesAction = () => {
  return {
    type: STOP_POLLING_PLAYER_PRICES_ACTION
  };
};

export const toggleFavoritePlayersAction = (payload: IToggleFavoritePLayersSaga['payload']) => {
  return {
    type: TOGGLE_FAVORITE_PLAYER_ACTION,
    payload
  };
};

export const getPlayerDetailsAction = (payload: IGetPlayerDetailsSaga['payload']) => {
  console.log('ac', payload);
  return {
    type: GET_PLAYER_DETAILS_ACTION,
    payload
  };
};

export const startPollingPlayerDetailsAction = (playerId: string) => {
  return {
    type: POLL_PLAYER_DETAIL_ACTION,
    playerId
  };
};

export const stopPollingPlayerDetailsAction = () => {
  return {
    type: STOP_POLLING_PLAYER_DETAIL_ACTION,
  };
};