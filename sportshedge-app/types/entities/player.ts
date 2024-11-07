export type PlayerRolesT = 'batsman' | 'bowler' | 'keeper' | 'all_rounder';

export type PlayerDetailsT = {
  id: string;
  name: string;
  price: number;
  percentageChange: number;
  role: PlayerRolesT;
  countryCode: string;
  isFavorite?: boolean;
  quantity?: number;
};

export interface IPlayerDetail {
  playerId: string;
  isPlaying: boolean;
  canTrade: boolean;
  performancePoints: number[];
  fantasyPoints: number;
  performanceAverage: number;
  price: number;
  stockAvailability: {
    buy: number;
    sell: number;
  };
  marketDepth: {
    bids: number[][];
    offers: number[][];
  };
}


export interface IPlayerBasicInfo {
  id: string;
  name: string;
  role: PlayerRolesT;
  team: string;
}

export interface IPlayers {
  [playerId: string]: IPlayerBasicInfo;
}

export interface IPlayersResponse {
  success: boolean;
  message: string;
  data: IPlayers;
}

export interface IUserFavoritePlayersResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    favorites: string[];
  };
  
}

export type UserPlayersHoldingT = {
  [playerId: string]: number; // qty for each player
}

export type UserPlayersHoldingResponseT = {
  success: boolean;
  message: string;
  data: UserPlayersHoldingT;
}

export type PlayerPriceT = {
  price: number;
  oneDayPrice: number;
  fiveDayPrice: number;
  tenDayPrice: number;
  twentyDayPrice: number;
  thirtyDayPrice: number;
}

export interface IPlayerPriceResponse {
  success: boolean;
  data: PlayerPriceT;
}

export type PlayerPricesT = {
  [playerId: string]: PlayerPriceT;
}
