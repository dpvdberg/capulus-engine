'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'bartender'
      },
      {
        name: 'admin'
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null);
  }
};
