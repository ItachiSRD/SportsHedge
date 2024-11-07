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
      await queryInterface.renameColumn(
        'players',
        'match_count',
        'match_number',
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
      await queryInterface.renameColumn(
        'players',
        'match_number',
        'match_count',
        { transaction },
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
