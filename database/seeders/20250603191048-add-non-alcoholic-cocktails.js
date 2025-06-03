'use strict';

const {addIngredients} = require("./utils/IngredientUtils");
const {addProduct} = require("./utils/ProductUtils");
module.exports = {
    async up(queryInterface, Sequelize) {
        await addIngredients(queryInterface, [
            'non-alcoholic-beer',
            'ginger',
            'non-alcoholic-gin',
            'crodino',
            'red-grape-juice'
        ])

        await addProduct(queryInterface,
            'ginger-kick-tail',
            'non-alcoholic',
            0,
            [
                ['non-alcoholic-beer', true],
                ['ginger-beer', true],
                ['lime', true],
                ['lemon', true],
                ['ginger', true],
                ['mint', true]
            ],
            [])

        await addProduct(queryInterface,
            'non-alcoholic-negroni',
            'non-alcoholic',
            0,
            [
                ['orange', true],
                ['lemon-juice', true],
                ['red-grape-juice', true],
                ['non-alcoholic-gin', true],
                ['crodino', true]
            ],
            [])
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
