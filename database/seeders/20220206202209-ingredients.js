'use strict';

const {addIngredients} = require("./utils/IngredientUtils");

module.exports = {
    async up(queryInterface, Sequelize) {
        await addIngredients(queryInterface, [
            'whole-milk',
            'semi-skimmed-milk',
            'skimmed-milk',
            'soy-milk',
            'oat-milk',
            'almond-milk',
            'vanilla-syrup',
            'caramel-syrup',
            'toffee-nut-syrup',
            'coffee-beans',
            'whipped-cream',
            'cold-brew'
        ])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("ingredients", null);
    }
};
