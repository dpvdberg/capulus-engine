'use strict';

const {addProduct} = require("./utils/ProductUtils");
module.exports = {
    async up(queryInterface, Sequelize) {
        await addProduct(queryInterface,
            'blue-lagoon',
            'alcoholic',
            0,
            [
                ['ice-cubes', true],
                ['blue-curacao', true],
                ['vodka', true],
                ['sprite', true],
                ['lemon', false]
            ],
            ['dilute-extra'])

        await addProduct(queryInterface,
            'mojito',
            'alcoholic',
            0,
            [
                ['ice-cubes', true],
                ['white-rum', true],
                ['lime-juice', true],
                ['sugar', true],
                ['mint', true],
                ['soda', true],
                ['lemon', false]
            ],
            ['dilute-extra'])

        await addProduct(queryInterface,
            'moscow-mule',
            'alcoholic',
            0,
            [
                ['ice-cubes', true],
                ['vodka', true],
                ['lime-juice', true],
                ['ginger-beer', true],
                ['mint', false],
                ['lime', false]
            ],
            ['dilute-extra'])

        await addProduct(queryInterface,
            'long-island-iced-tea',
            'alcoholic',
            0,
            [
                ['ice-cubes', true],
                ['vodka', true],
                ['white-rum', true],
                ['tequilla', true],
                ['gin', true],
                ['triple-sec', true],
                ['lemon-juice', true],
                ['cola', true],
                ['lemon', false],
                ['mint', false],
            ],
            ['dilute-extra'])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("products",
            {
                name: {
                    [Sequelize.Op.in]: [
                        'blue-lagoon',
                        'mojito',
                        'moscow-mule'
                    ]
                }
            }
        );
    }
};
