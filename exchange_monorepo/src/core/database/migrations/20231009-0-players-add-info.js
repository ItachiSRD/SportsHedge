/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
('use strict');

const { QueryInterface, DataTypes } = require('sequelize');
const PLAYER_ROLE = ['batsman', 'all_rounder', 'keeper', 'bowler'];

module.exports = {
  /**
   * @param {{context: {queryInterface: QueryInterface, DataTypes: DataTypes}}} context
   */
  async up({ context: { queryInterface, DataTypes } }) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'players',
        'team',
        {
          type: DataTypes.STRING,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'players',
        'name',
        {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'players',
        'role',
        {
          type: DataTypes.ENUM,
          allowNull: false,
          values: PLAYER_ROLE,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'players',
        'ltp',
        {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'players',
        'price',
        {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'players',
        'fantasy_points',
        {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction },
      );

      await queryInterface.removeColumn('players', 'instrument', {
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  /**
   * @param {{context: {queryInterface: QueryInterface}}} context
   */
  async down({ context: { queryInterface } }) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('players', 'team', { transaction });
      await queryInterface.removeColumn('players', 'name', { transaction });
      await queryInterface.removeColumn('players', 'role', { transaction });
      await queryInterface.removeColumn('players', 'ltp', { transaction });
      await queryInterface.removeColumn('players', 'price', { transaction });
      await queryInterface.removeColumn('players', 'fantasy_points', {
        transaction,
      });
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_players_role";',
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
