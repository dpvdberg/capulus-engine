'use strict';

const {addProduct} = require("./utils/ProductUtils");
const {addIngredients} = require("./utils/IngredientUtils");
const {addOptionValue} = require("./utils/OptionUtils");

const new_ingredients = [
    'chocolate-syrup',
    'chocolate-cookie-syrup',
    'white-chocolate-syrup',
    'vanilla-ice-cream'
];

module.exports = {
    async up(queryInterface, Sequelize) {
        await addIngredients(queryInterface, new_ingredients)
        await addOptionValue(queryInterface,
            'syrup', false, 'chocolate-syrup')
        await addOptionValue(queryInterface,
            'syrup', false, 'chocolate-cookie-syrup')
        await addOptionValue(queryInterface,
            'syrup', false, 'white-chocolate-syrup')

        await addProduct(queryInterface,
            'cortado',
            'coffee',
            2,
            [['coffee-beans', true]],
            ['milk-type', 'syrup', 'extra-shot', 'whipped-cream', 'liquor'])

        await addProduct(queryInterface,
            'mocha',
            'coffee',
            8,
            [['coffee-beans', true], ['chocolate-syrup', true]],
            ['milk-type', 'extra-shot', 'whipped-cream', 'liquor'])

        await addProduct(queryInterface,
            'affogato',
            'coffee',
            9,
            [['coffee-beans', true], ['vanilla-ice-cream', true]],
            ['milk-type', 'syrup', 'extra-shot', 'whipped-cream', 'liquor'])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("ingredients",
            {
                name: {
                    [Sequelize.Op.in]: new_ingredients
                }
            }
        );

        await queryInterface.bulkDelete("products",
            {
                name: {
                    [Sequelize.Op.in]: [
                        "cortado", "mocha", "affogato"
                    ]
                }
            }
        );
    }
};
