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
        'ledger_logs',
        'error',
        {
          type: DataTypes.TEXT,
        },
        { transaction },
      );
      await queryInterface.renameColumn(
        'ledger_logs',
        'rejectionReason',
        'rejection_reason',
        {
          transaction,
        },
      );
      await queryInterface.changeColumn(
        'ledger_logs',
        'rejection_reason',
        {
          type: DataTypes.TEXT,
        },
        { transaction },
      );
      await queryInterface.changeColumn(
        'ledger_logs',
        'entries',
        {
          type: DataTypes.TEXT,
        },
        { transaction },
      );
      await queryInterface.removeConstraint(
        'ledger_logs',
        'ledger_logs_txn_id_pkey',
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
        'ledger_logs',
        'error',
        {
          type: DataTypes.STRING,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.renameColumn(
        'ledger_logs',
        'rejection_reason',
        'rejectionReason',
        {
          transaction,
        },
      );
      await queryInterface.changeColumn(
        'ledger_logs',
        'rejection_reason',
        {
          type: DataTypes.STRING,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.changeColumn(
        'ledger_logs',
        'entries',
        {
          type: DataTypes.STRING,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.addConstraint('ledger_logs', {
        fields: ['ledger_txn_id'],
        type: 'primary key',
        name: 'ledger_logs_txn_id_pkey',
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
