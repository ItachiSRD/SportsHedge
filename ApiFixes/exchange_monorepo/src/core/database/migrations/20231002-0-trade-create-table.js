'use strict';

module.exports = {
  async up({ context: { queryInterface, DataTypes } }) {
    await queryInterface.createTable('trade', {
      trade_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      buyer_order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      seller_order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      instrument: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down({ context: { queryInterface } }) {
    await queryInterface.dropTable('trade');
  },
};
