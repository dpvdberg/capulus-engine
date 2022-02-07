'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_product_options', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_product_id: {
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        references: {
          model: 'order_products'
        },
        allowNull: false
      },
      option_id: {
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        references: {
          model: 'options'
        },
        allowNull: false
      },
      option_value_id: {
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        references: {
          model: 'option_values'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_product_options');
  }
};
