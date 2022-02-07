'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_ingredients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        references: {
          model: 'products'
        },
        allowNull: false
      },
      ingredient_id: {
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        references: {
          model: 'ingredients'
        },
        allowNull: false
      },
      required: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_ingredients');
  }
};
