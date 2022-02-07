'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        references: {
          model: 'users'
        },
        allowNull: false
      },
      fulfilled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      cancelled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      cancel_reason: {
        type: Sequelize.STRING(2048)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
