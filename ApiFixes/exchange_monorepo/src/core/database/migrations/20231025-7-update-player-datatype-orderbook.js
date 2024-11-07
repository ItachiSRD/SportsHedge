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
        'players',
        'order_book',
        {
          type: DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'players',
        'top_prices',
        {
          type: DataTypes.JSON,
          defaultValue: { bids: [], asks: [] },
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
        'players',
        'order_book',
        {
          type: DataTypes.JSON,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'players',
        'top_prices',
        {
          type: DataTypes.JSON,
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
