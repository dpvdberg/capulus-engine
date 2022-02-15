'use strict';

const {findFormhintId} = require("./utils/FormhintUtils");
const {addIngredients} = require("./utils/IngredientUtils");

const cocktailIngredients = [
    'ice-cubes',
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
    'orange-juice',
    'apple-juice',
    'cola',
    'sprite',
    'soda',
    'grapefruit-juice',
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
