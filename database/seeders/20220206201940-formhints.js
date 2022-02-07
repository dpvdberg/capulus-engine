'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('formhints', [
      {
        name: 'select'
      },
      {
        name: 'checkbox'
      },
      {
        name: 'radio'
      },
      {
        name: 'input'
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("formhints", null);
  }
};
