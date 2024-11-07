/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
('use strict');

const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  /**
   * @param {{context: {queryInterface: QueryInterface, DataTypes: DataTypes}}} context
   */
  async up({ context: { queryInterface, DataTypes } }) {
    await queryInterface.addConstraint('ledger_logs', {
      fields: ['ledger_txn_id'],
      type: 'primary key',
      name: 'ledger_logs_txn_id_pkey',
    });
  },

  async down({ context: { queryInterface } }) {
    await queryInterface.removeConstraint(
      'ledger_logs',
      'ledger_logs_txn_id_pkey',
    );
  },
};
