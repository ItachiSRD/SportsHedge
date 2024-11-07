/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  /**
   *
   * @param {{context: {queryInterface: QueryInterface, DataTypes: DataTypes}}} context
   */
  async up({ context: { queryInterface, DataTypes } }) {
    await queryInterface.createTable('kyc', {
      kyc_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      transaction_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      document_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      document_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSON,
      },
      user_id: {
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

  /**
   *
   * @param {{context: {queryInterface: QueryInterface }}} context
   */
  async down({ context: { queryInterface } }) {
    await queryInterface.dropTable('kyc');
  },
};
