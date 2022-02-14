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
                ['lemon-juice', true],
                ['lemon', false]
            ],
            ['dilute-extra'])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("products", {
            name: 'blue-lagoon'
        });
    }
};
