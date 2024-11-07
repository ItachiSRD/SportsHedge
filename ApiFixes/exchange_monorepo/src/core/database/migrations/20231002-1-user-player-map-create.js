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
        'user_player_map',
        {
          user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
          },
          player_id: {
            type: DataTypes.STRING,
            primaryKey: true,
          },
        },
        { transaction },
      );
      // add constraints here
      await queryInterface.addIndex('user_player_map', ['user_id'], {
        transaction,
      });
      await queryInterface.addIndex('user_player_map', ['player_id'], {
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
    await queryInterface.dropTable('user_player_map');
  },
};
