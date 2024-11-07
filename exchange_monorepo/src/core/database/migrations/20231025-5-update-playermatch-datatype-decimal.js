/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
('use strict');

const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  /**
   * @param {{context: {queryInterface: QueryInterface, DataTypes: DataTypes}}} context
   */
  async up({ context: { queryInterface, DataTypes } }) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn(
        'player_match_map',
        'fantasy_points',
        {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'player_match_map',
        'returns',
        {
          type: DataTypes.DECIMAL(10, 2),
          defaultValue: 0,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'player_match_map',
        'opening_price',
        {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'player_match_map',
        'closing_price',
        {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        { transaction },
      );

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
      await queryInterface.changeColumn(
        'player_match_map',
        'fantasy_points',
        {
          type: DataTypes.FLOAT(10, 2),
          allowNull: false,
          defaultValue: 0,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'player_match_map',
        'returns',
        {
          type: DataTypes.FLOAT(10, 2),
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'player_match_map',
        'opening_price',
        {
          type: DataTypes.FLOAT(10, 2),
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'player_match_map',
        'closing_price',
        {
          type: DataTypes.FLOAT(10, 2),
          allowNull: false,
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
