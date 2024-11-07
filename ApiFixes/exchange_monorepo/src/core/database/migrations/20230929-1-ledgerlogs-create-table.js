'use strict';

module.exports = {
  async up({ context: { queryInterface, DataTypes } }) {
    await queryInterface.createTable('ledger_logs', {
      order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      ledger_txn_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      memo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      error: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rejectionReason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entries: {
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
    await queryInterface.dropTable('ledger_logs');
  },
};
