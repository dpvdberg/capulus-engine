'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('options', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      formhint_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'formhints'
        },
        allowNull: false
      },
      required_ingredients: {
        type: Sequelize.BOOLEAN
      },
      has_none: {
        type: Sequelize.BOOLEAN
      },
      show_default: {
        type: Sequelize.BOOLEAN
      },
      priority: {
        type: Sequelize.INTEGER
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('options');
  }
};
