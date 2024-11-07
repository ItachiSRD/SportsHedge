import { PlayerPriceT } from '@/types/entities/player';

export const PLAYER_ROLES = {
  keeper: 'Wicket Keeper',
  batsman: 'Batsman',
  bowler: 'Bowler',
  all_rounder: 'All Rounder'
};

export const PLAYER_ROLE_TEXT_TO_CODE= {
  'Wicket Keeper': 'keeper',
  'Batsman': 'batsman',
  'Bowler': 'bowler',
  'All Rounder': 'all_rounder'
};

export const ROLE_FILTER = ['All', 'All Rounders', 'Batsman', 'Bowler', 'Wicket Keeper'];

export const TEAM_FILTER = [
  'All',
  'India',
  'South Africa',
  'New Zealand',
  'Australia',
  'Pakistan',
  'Netherlands',
  'Bangladesh',
  'Afghanistan',
  'Sri Lanka',
  'England'
];

export const noOfGamesList = [7, 10, 30];

export const noOfGameListKeys: { [noOfDays: number]: keyof PlayerPriceT } = {
  1: 'oneDayPrice',
  5: 'fiveDayPrice',
  10: 'tenDayPrice',
  20: 'twentyDayPrice',
  30: 'thirtyDayPrice'
};


export const PLAYERS = [
  {
    id: '1',
    name: 'Virat Kohli',
    country: 'India',
    countryCode: 'IND',
    quantity: 15,
    role: 'Batsman',
    price: 28,
    percentageChange: 5,
    isFavorite: true
  },
  {
    id: '2',
    name: 'Ishan Kishan',
    country: 'India',
    countryCode: 'IND',
    role: 'Wicket Keeper',
    price: 28,
    percentageChange: 5
  },
  {
    id: '3',
    name: 'Virat Kohli',
    country: 'India',
    countryCode: 'IND',
    quantity: 15,
    role: 'Batsman',
    price: 28,
    percentageChange: 5
  },
  {
    id: '4',
    name: 'Virat Kohli',
    country: 'India',
    countryCode: 'IND',
    quantity: 15,
    role: 'Batsman',
    price: 28,
    percentageChange: 5
  },
  {
    id: '5',
    name: 'Virat Kohli',
    country: 'India',
    countryCode: 'IND',
    quantity: 15,
    role: 'Batsman',
    price: 28,
    percentageChange: 5
  },
  {
    id: '6',
    name: 'Virat Kohli',
    country: 'India',
    countryCode: 'IND',
    quantity: 15,
    role: 'Batsman',
    price: 28,
    percentageChange: 5
  },
  {
    id: '7',
    name: 'Virat Kohli',
    country: 'India',
    countryCode: 'IND',
    quantity: 15,
    role: 'Batsman',
    price: 28,
    percentageChange: 5
  },
  {
    id: '8',
    name: 'Virat Kohli',
    country: 'India',
    countryCode: 'IND',
    quantity: 15,
    role: 'Batsman',
    price: 28,
    percentageChange: 5
  },
  {
    id: '9',
    name: 'Virat Kohli',
    country: 'India',
    countryCode: 'IND',
    quantity: 15,
    role: 'Batsman',
    price: 28,
    percentageChange: 5
  }
];