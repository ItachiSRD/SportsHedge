import { PlayerPricesT } from '@/types/entities/player';

export const playerIdsToFetchPricesFor = (existingPlayerPrices: PlayerPricesT, playerIds: string[]) => {
  return playerIds.filter((playerId) => !(playerId in existingPlayerPrices));
};