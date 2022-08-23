'use strict';

const {addProduct} = require("./utils/ProductUtils");
const {addIngredients} = require("./utils/IngredientUtils");
module.exports = {
  async up (queryInterface, Sequelize) {
    await addIngredients(queryInterface, ['daily-special-coffee'])
    await addProduct(queryInterface,
        'daily-special-coffee',
        'coffee',
        100,
        [['daily-special-coffee', true]],
        [],
        true)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ingredients", {name: 'daily-special-coffee'});
    await queryInterface.bulkDelete("products", {name: 'daily-special-coffee'});
  }
};
