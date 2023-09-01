'use strict';

const {addOptionValue} = require("./utils/OptionUtils");
const {addIngredient} = require("./utils/IngredientUtils");
module.exports = {
    async up(queryInterface, Sequelize) {
        await addIngredient(queryInterface, 'decaf-coffee-bean')
        await addOptionValue(queryInterface, 'coffee-bean-type', false, 'decaf-coffee-bean')

    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
