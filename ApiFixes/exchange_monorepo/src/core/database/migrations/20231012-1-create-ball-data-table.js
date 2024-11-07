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
    /**
     * Add altering commands here.
     *
     * Example:
     * await sequelize.createTable('match_ball_by_ball', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'match_ball_by_ball',
        {
          id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },

          match_id: {
            type: DataTypes.STRING,
            allowNull: false,
          },

          ball: {
            type: DataTypes.STRING,
            allowNull: false,
          },

          current_over: {
            type: DataTypes.STRING,
            allowNull: false,
          },

          previous_over: DataTypes.STRING,
          next_over: DataTypes.STRING,

          players_fantasy_points: {
            type: DataTypes.JSONB,
            allowNull: false,
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
     * await sequelize.dropTable('match_ball_by_ball');
     */
    await queryInterface.dropTable('match_ball_by_ball');
  },
};
