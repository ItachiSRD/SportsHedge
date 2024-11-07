import {
  call,
  cancel,
  cancelled,
  delay,
  fork,
  put,
  select,
  take,
  takeLatest
} from 'redux-saga/effects';
import {
  getPlayerDetails,
  getPlayerDetailsFailed,
  getPlayerDetailsSuccess,
  getPlayerResource,
  getPlayerResourceFailed,
  getPlayerResourceSuccess,
  toggleFavoritePlayer
} from './reducer';
import * as PlayerActions from './action';
import axiosClient from '@/lib/http/axios';
import {
  IPlayerDetail,
  IPlayerPriceResponse,
  IPlayersResponse,
  IUserFavoritePlayersResponse,
  UserPlayersHoldingResponseT
} from '@/types/entities/player';
import { AxiosError, AxiosResponse } from 'axios';
import {
  IGetPlayerDetailsSaga,
  IGetPlayerPricesSaga,
  IToggleFavoritePLayersSaga
} from '@/types/sagas/players';
import { API_ENDPOINTS } from '@/constants/api';
import { IResponseStructure } from '@/types/entities/general';
import { Task } from 'redux-saga';
import { PLAYER_DETAIL_POLL_INTERVAL, PLAYER_PRICE_POLL_INTERVAL } from '@/constants/poll';

function* getPlayersSaga() {
  try {
    console.log('get players saga');
    yield put(getPlayerResource({ resource: 'players' }));

    // Get the players details
    //const response: AxiosResponse<IPlayersResponse> = yield call(axiosClient.get, API_ENDPOINTS.PLAYERS);
    const response: AxiosResponse<IPlayersResponse> = yield call(
      axiosClient.get<IPlayerDetail>,
      API_ENDPOINTS.PLAYERS
    );
    console.log('response12312', response.data);

    if (response.status !== 200) {
      // Handle non-200 status codes as errors
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const players = response.data;
    console.log('players', players);

    yield put(getPlayerResourceSuccess({ resource: 'players', data: players.data }));
  } catch (err) {
    console.error('Failed to get the players data', err);
    const error = err as Error;
    yield put(getPlayerResourceFailed({ resource: 'players', error: { message: error.message } }));
  }
}


function* getFavoritePlayersSaga() {
  try {
    yield put(getPlayerResource({ resource: 'favoritePlayers' }));

    // Get the favorite players
    const response: AxiosResponse<IUserFavoritePlayersResponse> = yield call(
      axiosClient.get<IUserFavoritePlayersResponse>,
      API_ENDPOINTS.USER_FAVORITE_PLAYERS
    );

    const favoritePlayers = response.data;

    yield put(
      getPlayerResourceSuccess({
        resource: 'favoritePlayers',
        data: favoritePlayers.data.favorites
      })
    );
  } catch (err) {
    console.error('Failed to get the favorite players', err);
    const error = err as Error;
    yield put(
      getPlayerResourceFailed({ resource: 'favoritePlayers', error: { message: error.message } })
    );
  }
}

function* getTopPerformersSaga() {
  try {
    yield put(getPlayerResource({ resource: 'topPerformers' }));

    // Get the top performers players
    // const response: AxiosResponse<IUserFavoritePlayersResponse> = yield call(
    //   axiosClient.get<IUserFavoritePlayersResponse>,
    //   '/api/public/players'
    // );
    // const favoritePlayers = response.data;f
    const topPerformers = {
      data: ['101', '102']
    };

    yield put(getPlayerResourceSuccess({ resource: 'topPerformers', data: topPerformers.data }));
  } catch (err) {
    console.error('Failed to get the top performing players', err);
    const error = err as Error;
    yield put(
      getPlayerResourceFailed({ resource: 'topPerformers', error: { message: error.message } })
    );
  }
}

function* getUserHoldingsSaga() {
  try {
    yield put(getPlayerResource({ resource: 'userHoldings' }));

    // Get the top performers players
    // const response: AxiosResponse<UserPlayersHoldingResponseT> = yield call(
    //   axiosClient.get,
    //   API_ENDPOINTS.USER_HOLDINGS
    // );
    // const playerHoldings = response.data;
    // export type UserPlayersHoldingT = {
    //   [playerId: string]: number; // qty for each player
    // }
    // generate user player holdings
    const playerHoldings = {
      data: {
        V_KOHLI: 10,
        RG_SHARMA: 20,
        R_JADEJA: 30,
        R_ASHWIN: 40,
      }
    }

    console.log('player holdings', playerHoldings);

    yield put(getPlayerResourceSuccess({ resource: 'userHoldings', data: playerHoldings.data }));
  } catch (err) {
    console.error('Failed to get the user holdings', err);
    const error = err as Error;
    yield put(
      getPlayerResourceFailed({ resource: 'userHoldings', error: { message: error.message } })
    );
  }
}

function* getPlayerPricesSaga({ payload }: IGetPlayerPricesSaga) {
  try {
    const { playerIds } = payload;
    yield put(getPlayerResource({ resource: 'playerPrices' }));

    // Get the player prices
    // const response: AxiosResponse<IPlayerPriceResponse> = yield call(
    //   axiosClient.post,
    //   API_ENDPOINTS.PLAYER_PRICE,
    //   {
    //     playerIds
    //   }
    // );

    // console.log('responseddd', response.data);
    // const playerPrices = response.data;

    const playerPrices = {
      data: {
        "101": {
          price: 50,
          oneDayPrice: 34,
          fiveDayPrice: 25,
          tenDayPrice: 35,
          twentyDayPrice: 45,
          thirtyDayPrice: 48
        },
        "102": {
          price: 50,
          oneDayPrice: 20,
          fiveDayPrice: 25,
          tenDayPrice: 35,
          twentyDayPrice: 45,
          thirtyDayPrice: 48
        },
        R_JADEJA: {
          price: 50,
          oneDayPrice: 45,
          fiveDayPrice: 25,
          tenDayPrice: 35,
          twentyDayPrice: 45,
          thirtyDayPrice: 48
        },
        R_ASHWIN: {
          price: 50,
          oneDayPrice: 67,
          fiveDayPrice: 25,
          tenDayPrice: 35,
          twentyDayPrice: 45,
          thirtyDayPrice: 48
        },
      }
    };

    yield put(getPlayerResourceSuccess({ resource: 'playerPrices', data: playerPrices.data }));
    // yield delay(PLAYER_PRICE_POLL_INTERVAL);
  } catch (err) {
    const error = err as AxiosError;
    console.error('Failed to get the player prices', error.response);
    yield put(
      getPlayerResourceFailed({ resource: 'playerPrices', error: { message: error.message } })
    );
  }
}

function* pollPlayerPrices(): Generator {
  try {
    while (true) {
      const playersToPoll = yield select((state) => state.playersSlice.ltpPlayerList);
      const playesToPollArr = playersToPoll as string[];
      console.log('players to poll', playesToPollArr);
      if (playesToPollArr.length > 0) {
        yield call(getPlayerPricesSaga, { type: '', payload: { playerIds: playesToPollArr } });
      }
      yield delay(PLAYER_PRICE_POLL_INTERVAL); // polling interval
    }
  } catch (error) {
    // Handle error...
    console.error('Failed to poll the players price', error);
  } finally {
    const canceled = yield cancelled();
    if (canceled) {
      console.log('canceleed the player prices poll');
      // Handle cancellation, if needed
    }
  }
}

function* pollPlayerPricesSaga(): Generator {
  while (true) {
    yield take(PlayerActions.POLL_PLAYER_PRICES_ACTION);
    const pollTask = yield fork(pollPlayerPrices);

    yield take(PlayerActions.STOP_POLLING_PLAYER_PRICES_ACTION);
    yield cancel(pollTask as Task);
  }
}

function* toggleFavoritePlayerSaga({ payload }: IToggleFavoritePLayersSaga) {
  const { playerId, isFavorite } = payload;
  try {
    yield put(toggleFavoritePlayer({ playerId, operation: isFavorite ? 'remove' : 'add' }));

    // Call the api to toggle the favorite player
    yield call(axiosClient.patch, `${API_ENDPOINTS.USER_FAVORITE_PLAYERS}?playerId=${playerId}`);
  } catch (err) {
    console.error('Failed to toggle the favorite player', err);
    yield put(toggleFavoritePlayer({ playerId, operation: isFavorite ? 'add' : 'remove' }));
  }
}

function* getPlayerDetailsSaga({ payload }: IGetPlayerDetailsSaga) {
  const { playerId } = payload;
  try {
    yield put(getPlayerDetails({ playerId }));

    // Get the players details
    const response: AxiosResponse<IResponseStructure<IPlayerDetail>> = yield call(
      axiosClient.get,
      `${API_ENDPOINTS.PLAYERS}/${playerId}`
    );
    const playerDetail = response.data;
    playerDetail.data.performancePoints = [10, 40, 50, 40, 30, 20, 10, 70, 60, 50, 80, 40, 20, 14];
    playerDetail.data.stockAvailability = {
      buy: 10,
      sell: 20
    };
    playerDetail.data.marketDepth = {
      bids: [
        [58, 200],
        [58, 200],
        [58, 200],
        [58, 200],
        [58, 200]
      ],
      offers: [
        [58.1, 200],
        [58, 200],
        [58, 200],
        [58, 200],
        [58, 200]
      ]
    };

    yield put(getPlayerDetailsSuccess({ playerId, data: playerDetail.data }));
  } catch (err) {
    console.error('Failed to get the player details', err);
    const error = err as Error;
    yield put(getPlayerDetailsFailed({ playerId, error: { message: error.message } }));
  }
}

function* pollPlayerDetails(playerId: string) {
  try {
    while (true) {
      yield put(getPlayerDetails({ playerId }));
      console.log('poll pl', playerId);

      // Get the players details
      const response: AxiosResponse<IResponseStructure<IPlayerDetail>> = yield call(
        axiosClient.get,
        `${API_ENDPOINTS.PLAYERS}/${playerId}`
      );
      // TODO: Also get the player price;

      // const [response]: [AxiosResponse<IResponseStructure<IPlayerDetail>>] = yield Promise.allSettled([playerDetailPromise]);
      const playerDetail = response.data;
      console.log('player d', playerDetail);
      // playerDetail.data.performancePoints = [10, 40, 50, 40, 30, 20, 10, 70, 60, 50, 80, 40, 20, 14];
      // playerDetail.data.stockAvailability = {
      //   buy: 10,
      //   sell: 20
      // };
      // playerDetail.data.marketDepth = {
      //   bids: [
      //     [58, 200],
      //     [58, 200],
      //     [58, 200],
      //     [58, 200],
      //     [58, 200],
      //   ],
      //   offers: [
      //     [58.1, 200],
      //     [58, 200],
      //     [58, 200],
      //     [58, 200],
      //     [58, 200],
      //   ]
      // };

      yield put(getPlayerDetailsSuccess({ playerId, data: playerDetail.data }));

      yield delay(PLAYER_DETAIL_POLL_INTERVAL);
    }
  } catch (err) {
    console.error('Failed to get the player details', err);
    const error = err as Error;
    yield put(getPlayerDetailsFailed({ playerId, error: { message: error.message } }));
  } finally {
    const canceled: string = yield cancelled();
    if (canceled) {
      console.log('canceleed the poll');
      // Handle cancellation, if needed
    }
  }
}

function* pollPlayerDetailsSaga(): Generator {
  while (true) {
    console.log('poll player de');
    const { playerId } = (yield take(
      PlayerActions.POLL_PLAYER_DETAIL_ACTION
    )) as IGetPlayerDetailsSaga['payload'];
    const pollingTask = yield fork(pollPlayerDetails, playerId as string);

    yield take(PlayerActions.STOP_POLLING_PLAYER_DETAIL_ACTION);
    yield cancel(pollingTask as Task);
  }
}

export default function* watchPlayersSaga() {
  yield takeLatest(PlayerActions.GET_PLAYERS_ACTION, getPlayersSaga);
  yield takeLatest(PlayerActions.GET_FAVORITE_PLAYERS_ACTION, getFavoritePlayersSaga);
  yield takeLatest(PlayerActions.GET_TOP_PERFORMERS_ACTION, getTopPerformersSaga);
  yield takeLatest(PlayerActions.GET_USER_HOLDINGS_ACTION, getUserHoldingsSaga);
  yield takeLatest(PlayerActions.GET_PLAYER_PRICES_ACTION, getPlayerPricesSaga);
  yield takeLatest(PlayerActions.TOGGLE_FAVORITE_PLAYER_ACTION, toggleFavoritePlayerSaga);
  yield takeLatest(PlayerActions.GET_PLAYER_DETAILS_ACTION, getPlayerDetailsSaga);
  yield fork(pollPlayerDetailsSaga);
  yield fork(pollPlayerPricesSaga);
}
