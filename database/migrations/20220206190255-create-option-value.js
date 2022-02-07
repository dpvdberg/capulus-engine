'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('option_values', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      option_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'options'
        },
        allowNull: false
      },
      ingredient_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ingredients'
        }
      },
      default: {
        type: Sequelize.BOOLEAN
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('option_values');
  }
};
