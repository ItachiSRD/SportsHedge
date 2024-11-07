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
        'orders',
        'transaction_fee',
        {
          type: DataTypes.DECIMAL(10, 2),
          defaultValue: 0,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'orders',
        'fee_percent',
        {
          type: DataTypes.DECIMAL(10, 2),
          defaultValue: 0,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'orders',
        'price',
        {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'orders',
        'price_filled',
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
      await queryInterface.changeColumn(
        'orders',
        'transaction_fee',
        {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'orders',
        'fee_percent',
        {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'orders',
        'price',
        {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'orders',
        'price_filled',
        {
          type: DataTypes.INTEGER,
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
};
