import { IPlayerBasicInfo, IPlayers } from '@/types/entities/player';

export const filterPlayersBySearch = (players: IPlayerBasicInfo[], searchText?: string) => {
  if (!searchText) return players;

  const regexMatch = new RegExp(searchText, 'gi');
  return players.filter((player) => player.name.match(regexMatch));
};

export type FilterTermsT = 'team' | 'price' | 'role' | 'search';
export type FilterPLayersByT = {
  [key in FilterTermsT]?: string;
}

export const filterPlayers = (filterBy: FilterPLayersByT, players: IPlayerBasicInfo[]) => {
  let filteredPlayers = [ ...players ];

  if (filterBy.search) {
    filteredPlayers = filterPlayersBySearch(filteredPlayers, filterBy.search);
  }

  if (filterBy.role) {
    filteredPlayers = filteredPlayers.filter((player) => player['role'] === filterBy.role);
  }
  
  if (filterBy.team) {
    filteredPlayers = filteredPlayers.filter((player) => player['team'] === filterBy.team);
  }

  return filteredPlayers;
};

export const mapPlayersToArrayFromObj = (players: IPlayers) => {
  return Object.entries(players).map(([playerId, playerData]) => ({
    ...playerData,
    id: playerId
  }));
};