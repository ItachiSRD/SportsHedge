/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
('use strict');

const { QueryInterface, DataTypes } = require('sequelize');
const REWARD_TYPES = ['REFERRAL', 'DEPOSIT'];
const REDEEM_METHOD = ['PER_TRADE'];

module.exports = {
  /**
   * @param {{context: {queryInterface: QueryInterface, DataTypes: DataTypes}}} context
   */
  async up({ context: { queryInterface, DataTypes } }) {
    await queryInterface.createTable('rewards', {
      reward_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: REWARD_TYPES,
      },
      amount: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      expiry: {
        type: DataTypes.DATE,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      redeemable_amount: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
      },
      redeemed_amount: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      redeem_start: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      redeem_method: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: REDEEM_METHOD,
      },
      redeem_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      redeem_percent: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
        defaultValue: 100,
      },
    });
  },

  async down({ context: { queryInterface } }) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await sequelize.dropTable('rewards');
     */
    await queryInterface.dropTable('rewards');
  },
};
