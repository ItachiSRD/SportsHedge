import { ISagaAction } from './general';

export interface IGetPlayersSaga extends ISagaAction {
  payload: {
    playerId: string;
  };
}

export interface IGetPlayerPricesSaga extends ISagaAction {
  payload: {
    playerIds: string[];
  };
}

export interface IToggleFavoritePLayersSaga extends ISagaAction {
  payload: {
    playerId: string;
    isFavorite: boolean;
  };
}

export interface IGetPlayerDetailsSaga extends ISagaAction {
  payload: {
    playerId: string;
  };
}
