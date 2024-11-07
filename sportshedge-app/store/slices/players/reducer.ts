import { IPlayerDetail } from '@/types/entities/player';
import { IErrorActionPayload } from '@/types/reducers/general';
import { IPlayersSlice } from '@/types/reducers/players';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const playerSliceInitialState: IPlayersSlice = {
  players: { data: {}, status: 'loading' },
  favoritePlayers: { data: [] },
  topPerformers: { data: [] },
  userHoldings: { data: {} },
  playerPrices: { data: {} },
  playerDetails: {},
  ltpPlayerList: []
};

type ResourceKey = keyof Omit<IPlayersSlice, 'ltpPlayerList'>;

const playersSlice = createSlice({
  name: 'playersSlice',
  initialState: playerSliceInitialState,
  reducers: {
    getPlayerResource(state, action: PayloadAction<{ resource: ResourceKey }>) {
      const { resource } = action.payload;
      state[resource].status = 'loading';
    },
    getPlayerResourceSuccess<T extends IPlayersSlice[ResourceKey]['data']>(
      state: IPlayersSlice,
      action: PayloadAction<{ resource: ResourceKey; data: T }>
    ) {
      const { resource, data } = action.payload;
      console.log('data in reducer.ts', data);
      state[resource].status = 'success';
      state[resource].data = data;
   
      if (resource === 'favoritePlayers' || resource === 'topPerformers') {
        state.ltpPlayerList = [ ...new Set([ ...state.ltpPlayerList, ...data as string[] ]) ];
      }
      console.log('state in reducer.ts');
      console.log(state );
    },
    getPlayerResourceFailed(
      state,
      action: PayloadAction<{ resource: ResourceKey; error: IErrorActionPayload }>
    ) {
      const { resource, error } = action.payload;
      state[resource].status = 'error';
      state[resource].error = error;
    },
    appendLtpPlayerList(state, action: PayloadAction<{ playerIds: string[], replace: boolean }>) {
      const { playerIds, replace } = action.payload;
      if (replace) {
        state.ltpPlayerList = playerIds;
      } else {
        state.ltpPlayerList = [...new Set([...state.ltpPlayerList, ...playerIds])];
      }
    },
    removePlayersFromLtpList(state, action: PayloadAction<{ playerIds: string[], initialState: boolean }>) {
      const { playerIds, initialState } = action.payload;
      if (initialState) {
        state.ltpPlayerList = [ ...new Set([ ...state.favoritePlayers.data, ...state.topPerformers.data ])];
      } else {
        state.ltpPlayerList = state.ltpPlayerList.filter(
          (player) => !playerIds.includes(player)
        );
      }
    },
    toggleFavoritePlayer(state, action: PayloadAction<{ playerId: string, operation: 'add' | 'remove' }>) {
      const { playerId, operation } = action.payload;
      if (operation === 'remove') {
        state.favoritePlayers.data = state.favoritePlayers.data.filter((favPlayer) => favPlayer !== playerId);
      }else if (operation === 'add') {
        const isFavoritePlayer = state.favoritePlayers.data.some((favPlayer) => favPlayer === playerId);
        if (!isFavoritePlayer) {
          state.favoritePlayers.data.push(playerId);
        }
      }
    },
    getPlayerDetails(state, action: PayloadAction<{ playerId: string }>) {
      console.log('get player details in reducer.ts', action.payload);
      const { playerId } = action.payload;
      if (!state.playerDetails[playerId]?.data) {
        state.playerDetails[playerId] = { status: 'loading' };
      }
    },
    getPlayerDetailsSuccess(state, action: PayloadAction<{ playerId: string, data: IPlayerDetail }>) {
      const { playerId, data } = action.payload;
      state.playerDetails[playerId] = { status: 'success', data: data };
      state.playerPrices.data[playerId] = { ...state.playerPrices.data[playerId], price: data.price };
    },
    getPlayerDetailsFailed(state, action: PayloadAction<{ playerId: string, error: IErrorActionPayload }>) {
      const { playerId, error } = action.payload;
      state.playerDetails[playerId].status = 'error';
      state.playerDetails[playerId].error = error;
    },
  }
});

export const {
  getPlayerResource,
  getPlayerResourceSuccess,
  getPlayerResourceFailed,
  appendLtpPlayerList,
  removePlayersFromLtpList,
  toggleFavoritePlayer,
  getPlayerDetails,
  getPlayerDetailsFailed,
  getPlayerDetailsSuccess
} = playersSlice.actions;

export default playersSlice.reducer;
