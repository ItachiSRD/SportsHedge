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
        'fund_transactions',
        {
          transaction_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
          },
          user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
          },
          type: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['withdraw', 'deposit'],
          },
          currency: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
          },
          status: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          reference_id: {
            type: DataTypes.STRING,
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
      await queryInterface.dropTable('fund_transactions', { transaction });
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_fund_transactions_type";',
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
