
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
        'orders',
        'settled_quantity',
        {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'orders',
        'is_settled',
        {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'orders',
        'is_short',
        {
          type: DataTypes.BOOLEAN,
          allowNull: true,
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
      await queryInterface.removeColumn('orders', 'settled_quantity', {
        transaction,
      });

      await queryInterface.removeColumn('orders', 'is_settled', {
        transaction,
      });

      await queryInterface.removeColumn('orders', 'is_short', {
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
