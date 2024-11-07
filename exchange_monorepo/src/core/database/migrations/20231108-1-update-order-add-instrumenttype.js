/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
('use strict');

const { QueryInterface, DataTypes } = require('sequelize');

const INSTRUMENT_TYPE = ['ETF', 'PLAYER']

module.exports = {
  /**
   * @param {{context: {queryInterface: QueryInterface, DataTypes: DataTypes}}} context
   */
  async up({ context: { queryInterface, DataTypes } }) {
    await queryInterface.addColumn('orders', 'instrument_type', {
      type: DataTypes.ENUM,
      values: INSTRUMENT_TYPE,
      allowNull: true
    });
  },

  /**
   * @param {{context: {queryInterface: QueryInterface}}} context
   */
  async down({ context: { queryInterface } }) {
    await queryInterface.removeColumn('orders', 'instrument_type');
  },
};
