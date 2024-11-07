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
      await queryInterface.addColumn(
        'players',
        'buy_inventory_limit',
        {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'players',
        'sell_inventory_limit',
        {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
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
      await queryInterface.removeColumn('players', 'sell_inventory_limit', {
        transaction,
      });
      await queryInterface.removeColumn('players', 'buy_inventory_limit', {
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
