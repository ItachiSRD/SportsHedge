/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
('use strict');


const { QueryInterface, DataTypes } = require('sequelize');

const USER_ROLE = ['USER', 'MATCH_MAKER'];

module.exports = {
  /**
   * @param {{context: {queryInterface: QueryInterface, DataTypes: DataTypes}}} context
   */
  async up({ context: { queryInterface, DataTypes } }) {
    await queryInterface.addColumn('users', 'role', {
      type: DataTypes.ENUM,
      values: Object.values(USER_ROLE),
      allowNull: true
    });
  },

  /**
   * @param {{context: {queryInterface: QueryInterface}}} context
   */
  async down({ context: { queryInterface } }) {
    await queryInterface.removeColumn('users', 'role');
  },
};
