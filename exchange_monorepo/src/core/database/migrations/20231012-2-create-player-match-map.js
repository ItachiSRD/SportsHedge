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
     * await sequelize.createTable('player_match_map', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'player_match_map',
        {
          match_id: {
            type: DataTypes.STRING,
            allowNull: false,
          },

          player_id: {
            type: DataTypes.STRING,
            allowNull: false,
          },

          player_match_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },

          fantasy_points: {
            type: DataTypes.FLOAT(10, 2),
            allowNull: false,
            defaultValue: 0,
          },

          returns: DataTypes.FLOAT(10, 2),

          opening_price: {
            type: DataTypes.FLOAT(10, 2),
            allowNull: false,
          },

          closing_price: DataTypes.FLOAT(10, 2),

          created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
        },
        {
          transaction,
          uniqueKeys: {
            // Define the composite unique key for match_id and player_id
            unique_match_player: {
              fields: ['match_id', 'player_id'],
            },
          },
        },
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
     * await sequelize.dropTable('player_match_map');
     */
    // Remove the composite unique index for match_id and player_id
    await queryInterface.removeIndex('player_match_map', 'unique_match_player');
    await queryInterface.dropTable('player_match_map');
  },
};
