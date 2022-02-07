'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        references: {
          model: 'orders'
        },
        allowNull: false
      },
      product_id: {
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        references: {
          model: 'products'
        },
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_products');
  }
};
