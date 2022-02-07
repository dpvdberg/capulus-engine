'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_options', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      option_id: {
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        references: {
          model: 'options'
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_options');
  }
};
