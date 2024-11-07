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
      await queryInterface.addColumn('match_ball_by_ball', 'updated_at', {
        type: DataTypes.DATE,
        allowNull: false,
      });
      // Remove the composite unique key constraint
      await queryInterface.removeConstraint(
        'match_ball_by_ball',
        'unique_match_player',
      );
      // Define a new composite unique key constraint with fields option
      await queryInterface.addConstraint('match_ball_by_ball', {
        fields: ['match_id', 'innings', 'ball', 'updated_at'],
        type: 'unique',
        name: 'unique_match_player',
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
      // Remove the new composite unique key constraint
      await queryInterface.removeConstraint(
        'match_ball_by_ball',
        'unique_match_player',
      );
      //Add the existing composite unique key constraint with fields option
      await queryInterface.addConstraint('match_ball_by_ball', {
        fields: ['match_id', 'innings', 'ball'],
        type: 'unique',
        name: 'unique_match_player',
      });
      await queryInterface.removeColumn('match_ball_by_ball', 'updated_at');

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
