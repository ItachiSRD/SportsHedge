/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
/* eslint-disable @typescript-eslint/no-var-requires */

const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  /**
   *
   * @param {{context: {queryInterface: QueryInterface, DataTypes: DataTypes}}} context
   */
  async up({ context: { queryInterface, DataTypes } }) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await sequelize.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'users',
        {
          id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },

          firebase_id: {
            type: DataTypes.STRING,
            allowNull: false,
          },

          first_name: {
            type: DataTypes.STRING,
            allowNull: false,
          },

          middle_name: DataTypes.STRING,

          last_name: DataTypes.STRING,

          gender: {
            type: DataTypes.STRING,
            allowNull: false,
          },

          email: DataTypes.STRING,

          email_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },

          phone: DataTypes.TEXT,

          phone_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },

          country: {
            type: DataTypes.TEXT,
            allowNull: false,
          },

          state: DataTypes.TEXT,

          referral_code: DataTypes.UUID,

          profile_picture: DataTypes.TEXT,

          referrer: DataTypes.BIGINT,

          is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },

          is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },

          is_kyc_done: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },

          lock_book_id: DataTypes.STRING,

          main_book_id: DataTypes.STRING,

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

      // Indexes and Constratints
      await queryInterface.addIndex('users', ['firebase_id'], {
        unique: true,
        transaction,
      });
      await queryInterface.addIndex('users', ['phone'], {
        unique: true,
        transaction,
      });
      await queryInterface.addIndex('users', ['email'], {
        unique: true,
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down({ context: { queryInterface } }) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await sequelize.dropTable('users');
     */
    await queryInterface.dropTable('users');
  },
};
