/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

//  TODO: Import the Order states from constant file
const ORDER_STATES = [
  'INIT',
  'OPEN',
  'PARTIAL_FULFILLED',
  'PARTIAL_CANCELLED',
  'FULFILLED',
  'DECREMENTED',
  'REJECTED',
  'CANCELLED',
];

module.exports = {
  async up({ context: { queryInterface, DataTypes } }) {
    await queryInterface.createTable('orders', {
      order_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },

      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      transaction_fee: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      fee_percent: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      quantity_filled: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      price_filled: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ORDER_STATES,
        defaultValue: ORDER_STATES[0],
      },

      side: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['buy', 'sell'],
      },

      type: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['market', 'limit'],
      },

      instrument: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down({ context: { queryInterface } }) {
    await queryInterface.dropTable('orders');
  },
};
