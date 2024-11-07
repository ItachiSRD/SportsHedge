/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
('use strict');

const { QueryInterface, DataTypes } = require('sequelize');
const REWARD_TYPES = ['REFERRAL', 'DEPOSIT'];
const REWARD_ACTION = ['CREDITED', 'DEPOSITED', 'LAPSED'];

module.exports = {
  /**
   * @param {{context: {queryInterface: QueryInterface, DataTypes: DataTypes}}} context
   */
  async up({ context: { queryInterface, DataTypes } }) {
    await queryInterface.createTable('reward_logs', {
      reward_log_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      reward_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
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
      action: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: REWARD_ACTION,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down({ context: { queryInterface } }) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await sequelize.dropTable('reward_logs');
     */
    await queryInterface.dropTable('reward_logs');
  },
};
