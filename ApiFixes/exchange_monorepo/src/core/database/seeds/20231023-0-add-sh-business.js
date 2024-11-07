/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
('use strict');

const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  /**
   * @param {{context: {queryInterface: QueryInterface, DataTypes: DataTypes}}} context
   */
  async up({ context: { queryInterface, DataTypes } }) {
    await queryInterface.bulkInsert('businesses', [
      {
        business_id: 1,
        name: 'Sportshedge',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  /**
   * @param {{context: {queryInterface: QueryInterface}}} context
   */
  async down({ context: { queryInterface } }) {
    await queryInterface.bulkDelete('businesses', null, {}, { transaction });
  },
};
