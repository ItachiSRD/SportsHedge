'use strict';

module.exports = {
  async up({ context: { queryInterface, DataTypes } }) {
    await queryInterface.addColumn('players', 'can_trade', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down({ context: { queryInterface } }) {
    await queryInterface.removeColumn('players', 'can_trade');
  },
};
