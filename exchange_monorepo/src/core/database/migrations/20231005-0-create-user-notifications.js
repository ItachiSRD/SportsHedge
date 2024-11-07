'use strict';

module.exports = {
  async up({ context: { queryInterface, DataTypes } }) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'user_notifications',
        {
          notification_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
          },
          user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
          },
          title: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          description: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          is_read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
          updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
        },
        { transaction },
      );
      await queryInterface.addIndex('user_notifications', ['user_id'], {
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down({ context: { queryInterface } }) {
    await queryInterface.dropTable('user_notifications');
  },
};
