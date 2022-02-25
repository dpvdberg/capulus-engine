'use strict';

const {findFormhintId} = require("./utils/FormhintUtils");
const {addIngredients} = require("./utils/IngredientUtils");

const cocktailIngredients = [
    // milks
    'whole-milk',
    'semi-skimmed-milk',
    'skimmed-milk',
    'soy-milk',
    'oat-milk',
    'almond-milk',
    // syrups
    'vanilla-syrup',
    'caramel-syrup',
    'toffee-nut-syrup',
    // Alcohol
    'vodka',
    'gin',
    'white-rum',
    'dark-rum',
    'tequilla',
    'amaretto',
    'baileys',
    'cognac',
    'whiskey',
    'triple-sec',
    'coffee-liqueur',
    'peach-liqueur',
    'ginger-beer',
    'dry-vermouth',
    'sweet-vermouth',
    'blue-curacao',
    // Non alcohol common
    'sugar',
    'sugar-syrup',
    'lime-juice',
    'lemon-juice',
    // Juices and sodas
    'cola',
    'sprite',
    'soda',
    'orange-juice',
    'apple-juice',
    'grapefruit-juice',
    'pineapple-juice',
    'cranberry-juice',
    'grenadine-syrup',
    // Non-juice, herbs, spices and garnish
    'mint',
    'lemon',
    'lime',
    'orange',
    'olive',
    'apple',
    'pineapple',
    'strawberry',
    // Others
    'cream',
    'egg-white',
    'coffee-beans',
    'whipped-cream',
    'cold-brew',
    'ice-cubes',
]

module.exports = {
    async up(queryInterface, Sequelize) {
        await addIngredients(queryInterface, cocktailIngredients)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(
            'ingredients',
            {name: {[Sequelize.Op.in]: cocktailIngredients}}
        );
    }
};
