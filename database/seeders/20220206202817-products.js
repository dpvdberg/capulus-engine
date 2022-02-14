'use strict';
const {addProduct} = require("./utils/ProductUtils");

module.exports = {
    async up(queryInterface, Sequelize) {
        await addProduct(queryInterface,
            'espresso',
            'coffee',
            0,
            [['coffee-beans', true]],
            ['double'])

        await addProduct(queryInterface,
            'macchiato',
            'coffee',
            1,
            [['coffee-beans', true]],
            ['milk-type', 'syrup', 'extra-shot', 'whipped-cream'])

        await addProduct(queryInterface,
            'americano',
            'coffee',
            2,
            [['coffee-beans', true]],
            ['double'])

        await addProduct(queryInterface,
            'cappuccino',
            'coffee',
            3,
            [['coffee-beans', true]],
            ['milk-type', 'cappuccino-type', 'syrup', 'extra-shot', 'whipped-cream'])

        await addProduct(queryInterface,
            'latte',
            'coffee',
            4,
            [['coffee-beans', true]],
            ['milk-type', 'syrup', 'extra-shot', 'whipped-cream'])

        await addProduct(queryInterface,
            'latte-macchiato',
            'coffee',
            5,
            [['coffee-beans', true]],
            ['milk-type', 'syrup', 'extra-shot', 'whipped-cream'])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("products", null);
    }
};
