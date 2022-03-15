'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      priority: {
        type: Sequelize.INTEGER
      },
      hide_if_unavailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      image_fit: {
        type: Sequelize.STRING,
        defaultValue: 'cover'
      },
      category_id: {
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        references: {
          model: 'categories'
        },
        allowNull: false,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
