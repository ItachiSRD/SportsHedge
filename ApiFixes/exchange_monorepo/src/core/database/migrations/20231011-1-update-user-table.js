/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
('use strict');

const { Op } = require('sequelize');
const { QueryInterface, DataTypes } = require('sequelize');
const USER_GENDER = ['MALE', 'FEMALE', 'OTHER'];

module.exports = {
  /**
   * @param {{context: {queryInterface: QueryInterface, DataTypes: DataTypes}}} context
   */
  async up({ context: { queryInterface, DataTypes } }) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn(
        'users',
        'email',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'users',
        'gender',
        {
          type: DataTypes.ENUM,
          values: Object.values(USER_GENDER),
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'users',
        'phone',
        {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: true,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'users',
        'firebase_id',
        {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'users',
        'is_kyc_done',
        {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        { transaction },
      );

      await queryInterface.addConstraint('users', {
        type: 'unique',
        name: 'users_email_unique',
        fields: ['email'],
        where: {
          email: {
            [Op.not]: null, // Ensure the email is not null
          },
        },
        transaction,
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
      await queryInterface.removeConstraint('users', 'users_email_unique', {
        transaction,
      });

      await queryInterface.changeColumn(
        'users',
        'email',
        {
          type: DataTypes.STRING,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'users',
        'gender',
        {
          type: DataTypes.STRING,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'users',
        'phone',
        {
          type: DataTypes.TEXT,
          allowNull: true,
          unique: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'users',
        'firebase_id',
        {
          type: DataTypes.STRING,
          unique: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'users',
        'is_kyc_done',
        {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
