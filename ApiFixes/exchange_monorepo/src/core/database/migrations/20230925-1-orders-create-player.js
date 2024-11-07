/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

module.exports = {
  async up({ context: { queryInterface, DataTypes } }) {
    await queryInterface.createTable('players', {
      player_id: {
        type: DataTypes.STRING,
        unique: true,
      },

      is_playing: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      instrument: {
        type: DataTypes.STRING,
        unique: true,
      },
    });
  },

  async down({ context: { queryInterface } }) {
    await queryInterface.dropTable('players');
  },
};
