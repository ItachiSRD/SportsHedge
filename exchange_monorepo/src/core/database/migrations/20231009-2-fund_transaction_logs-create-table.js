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
      await queryInterface.createTable(
        'fund_transaction_logs',
        {
          transaction_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
          },
          status: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: false,
          },
          created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
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
    await queryInterface.dropTable('fund_transaction_logs');
  },
};
