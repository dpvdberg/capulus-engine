'use strict';

const {addIngredients} = require("./utils/IngredientUtils");
const {addProduct} = require("./utils/ProductUtils");
module.exports = {
    async up(queryInterface, Sequelize) {
        await addIngredients(queryInterface, [
            'aperol',
            'prosecco'
        ])

        await addProduct(queryInterface,
            'spritz',
            'alcoholic',
            0,
            [
                ['ice-cubes', true],
                ['prosecco', true],
                ['aperol', true],
                ['soda', true],
                ['orange', false]
            ],
            ['dilute-extra'])

        await addProduct(queryInterface,
            'rum-punch',
            'alcoholic',
            0,
            [
                ['pineapple-juice', true],
                ['orange-juice', true],
                ['dark-rum', true],
                ['lime-juice', true],
                ['grenadine-syrup', true],
                ['orange', false]
            ],
            ['dilute-extra'])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("products",
            {
                name: {
                    [Sequelize.Op.in]: [
                        'spritz',
                        'rum-punch'
                    ]
                }
            }
        );
        await queryInterface.bulkDelete("ingredients",
            {
                name: {
                    [Sequelize.Op.in]: [
                        'prosecco',
                        'aperol'
                    ]
                }
            }
        );
    }
};
