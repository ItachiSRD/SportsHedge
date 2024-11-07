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
        'fees_filled',
        {
          type: DataTypes.DECIMAL(10, 2),
          defaultValue: 0,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'orders',
        'total_amount',
        {
          type: DataTypes.DECIMAL(10, 2),
          defaultValue: 0,
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
      await queryInterface.removeColumn('orders', 'fees_filled', {
        transaction,
      });

      await queryInterface.removeColumn('orders', 'total_amount', {
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
