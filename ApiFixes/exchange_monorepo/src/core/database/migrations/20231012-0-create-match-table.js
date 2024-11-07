/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const { QueryInterface, DataTypes } = require('sequelize');
const MATCH_STATUS = [
  'NOT_STARTED',
  'ONGOING',
  'INNINGS_BREAK',
  'PLAY_STOPPED',
  'COMPLETED',
];

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
     * await sequelize.createTable('matches', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'matches',
        {
          match_id: {
            type: DataTypes.STRING,
            primaryKey: true,
          },

          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },

          short_name: {
            type: DataTypes.STRING,
            allowNull: true,
          },

          game_format: {
            type: DataTypes.STRING,
            allowNull: true,
          },

          status: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: MATCH_STATUS,
            defaultValue: MATCH_STATUS[0],
          },

          expected_start: {
            type: DataTypes.DATE,
            allowNull: false,
          },

          expected_end: {
            type: DataTypes.DATE,
            allowNull: true,
          },
        },
        { transaction },
      );
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
     * await sequelize.dropTable('matches');
     */
    await queryInterface.dropTable('matches');
  },
};
