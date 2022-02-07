'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
        // BASE
      {
        name: 'coffee',
        priority: 0,
        category_id: null
      },
      {
        name: 'tea',
        priority: 1,
        category_id: null
      },
    ])

    const cocktailCatId = await queryInterface.bulkInsert('categories', [
      {
        name: 'cocktails',
        priority: 2,
        category_id: null
      }
    ])

    await queryInterface.bulkInsert('categories', [
      // COCKTAILS SUB
      {
        name: 'non-alcoholic',
        priority: 1,
        category_id: cocktailCatId
      },
      {
        name: 'alcoholic',
        priority: 0,
        category_id: cocktailCatId
      },
    ])

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null);
  }
};
