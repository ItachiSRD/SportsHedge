/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
('use strict');

const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  /**
   * @param {{context: {queryInterface: QueryInterface, DataTypes: DataTypes}}} context
   */
  async up({ context: { queryInterface, DataTypes } }) {
    await queryInterface.bulkInsert('players', [
      {
        player_id: 1,
        is_playing: true,
        team: 'India',
        name: 'Virat Kohli',
        role: 'batsman',
        ltp: 0,
        price: 0,
        fantasy_points: 0,
      },
      {
        player_id: 2,
        is_playing: true,
        team: 'India',
        name: 'Rohit Sharma',
        role: 'batsman',
        ltp: 0,
        price: 0,
        fantasy_points: 0,
      },
      {
        player_id: 3,
        is_playing: true,
        team: 'India',
        name: 'KL Rahul',
        role: 'batsman',
        ltp: 0,
        price: 0,
        fantasy_points: 0,
      },
      {
        player_id: 4,
        is_playing: true,
        team: 'India',
        name: 'Shikhar Dhawan',
        role: 'batsman',
        ltp: 0,
        price: 0,
        fantasy_points: 0,
      },
      {
        player_id: 5,
        is_playing: true,
        team: 'India',
        name: 'Shreyas Iyer',
        role: 'batsman',
        ltp: 0,
        price: 0,
        fantasy_points: 0,
      },
      {
        player_id: 6,
        is_playing: true,
        team: 'India',
        name: 'Manish Pandey',
        role: 'batsman',
        ltp: 0,
        price: 0,
        fantasy_points: 0,
      },
      {
        player_id: 7,
        is_playing: true,
        team: 'India',
        name: 'Rishabh Pant',
        role: 'keeper',
        ltp: 0,
        price: 0,
        fantasy_points: 0,
      },
      {
        player_id: 8,
        is_playing: true,
        team: 'India',
        name: 'Hardik Pandya',
        role: 'all_rounder',
        ltp: 0,
        price: 0,
        fantasy_points: 0,
      },
      {
        player_id: 9,
        is_playing: true,
        team: 'India',
        name: 'Krunal Pandya',
        role: 'all_rounder',
        ltp: 0,
        price: 0,
        fantasy_points: 0,
      }

    ]);
  },

  /**
   * @param {{context: {queryInterface: QueryInterface}}} context
   */
  async down({ context: { queryInterface } }) {
    await queryInterface.bulkDelete('players', null, {}, { });
  },
};
