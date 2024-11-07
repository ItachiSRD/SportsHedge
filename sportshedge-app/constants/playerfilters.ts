import { PLAYER_ROLES } from './players';

export const NO_OF_GAMES_FILTER = [7, 10, 30];

export const TIME_FILTER = ['1 week', '1 month', 'All'];

export const PLAYER_SORT_BY = [
  'A - Z Alphabetically',
  'Price (Low to High)',
  'Price (High to Low)',
  'Price Change (Low to High)',
  'Price Change (High to Low)'
];

export const TEAM_FILTER = [
  'all',
  'ind',
  'rsa',
  'nz',
  'aus',
  'pak',
  'nl',
  'ban',
  'afg',
  'sl',
  'eng',
];

export const TEAM_FILTER_TEXT = {
  all: 'All',
  ind: 'India',
  aus: 'Australia',
  rsa: 'South Africa',
  nz: 'New Zealand',
  pak: 'Pakistan',
  nl: 'Netherlands',
  ban: 'Bangladesh',
  afg: 'Afghanistan',
  sl: 'Sri Lanka',
  eng: 'England'
};

export const ROLE_FILTER = [
  'all',
  'keeper',
  'batsman',
  'bowler',
  'all_rounder',
];

export const ROLE_FILTER_TEXT = {
  all: 'All',
  ...PLAYER_ROLES
};

export const PRICE_FILTER = ['All', '₹0 - ₹10', '₹10 - ₹50', '₹50 - ₹100', '₹100 - ₹500'];
