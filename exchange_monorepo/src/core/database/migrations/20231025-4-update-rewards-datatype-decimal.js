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
        'rewards',
        'amount',
        {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'rewards',
        'redeemable_amount',
        {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'rewards',
        'redeemed_amount',
        {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'rewards',
        'redeem_percent',
        {
          type: DataTypes.DECIMAL(10, 2),
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
      await queryInterface.changeColumn(
        'rewards',
        'amount',
        {
          type: DataTypes.FLOAT(10, 2),
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'rewards',
        'redeemable_amount',
        {
          type: DataTypes.FLOAT(10, 2),
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'rewards',
        'redeemed_amount',
        {
          type: DataTypes.FLOAT(10, 2),
          allowNull: false,
          defaultValue: 0,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'rewards',
        'redeem_percent',
        {
          type: DataTypes.FLOAT(10, 2),
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
};
