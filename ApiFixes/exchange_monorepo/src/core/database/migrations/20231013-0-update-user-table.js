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
      await queryInterface.addColumn('users', 'invested_amount', {
        type: DataTypes.DECIMAL(32, 8),
        allowNull: false,
        defaultValue: 0,
      });
      await queryInterface.addColumn('users', 'realized_amount', {
        type: DataTypes.DECIMAL(32, 8),
        allowNull: false,
        defaultValue: 0,
      });
      await queryInterface.changeColumn('users', 'referral_code', {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      });
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
      await queryInterface.removeColumn('users', 'invested_amount');
      await queryInterface.removeColumn('users', 'realized_amount');
      await queryInterface.changeColumn('users', 'referral_code', {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
