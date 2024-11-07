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
      await queryInterface.addColumn('trade', 'buyer_id', {
        type: DataTypes.BIGINT,
      });

      await queryInterface.addColumn('trade', 'seller_id', {
        type: DataTypes.BIGINT,
      });
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
      await queryInterface.removeColumn('trade', 'buyer_id');
      await queryInterface.removeColumn('trade', 'seller_id');
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
