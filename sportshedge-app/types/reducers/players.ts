import { IPlayerDetail, IPlayers, PlayerPricesT, UserPlayersHoldingT } from '../entities/player';
import { IReducerEntityState } from './general';

export type PlayerDetailSliceDataT = Omit<IReducerEntityState, 'data'> & { data?: IPlayerDetail };

export interface IPlayersSlice {
    players: IReducerEntityState<IPlayers>;
    favoritePlayers: IReducerEntityState<string[]>; // Ids of favorite players
    topPerformers: IReducerEntityState<string[]>; // Top performer player ids
    userHoldings: IReducerEntityState<UserPlayersHoldingT>; // User holdings of players
    ltpPlayerList: string[]; // List of player ids for which we need to poll prices
    playerPrices: IReducerEntityState<PlayerPricesT>; // Player price
    playerDetails: {
        [playerId: string]: PlayerDetailSliceDataT;
    }
}