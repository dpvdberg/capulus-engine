'use strict';

const {findFormhintId} = require("./utils/FormhintUtils");
const {
    addOptionValue,
    addOptionWithNames,
    productsApplyOptions,
    addOptionWithIngredients
} = require("./utils/OptionUtils");
module.exports = {
    async up(queryInterface, Sequelize) {
        await addOptionWithIngredients(
            queryInterface,
            'coffee-bean-type',
            ['light-coffee-bean', 'medium-coffee-bean', 'dark-coffee-bean'],
            true,
            'select',
            false,
            true,
            0,
            'medium-coffee-bean',
        );

        productsApplyOptions(queryInterface,
            [
                'espresso',
                'macchiato',
                'americano',
                'cappuccino',
                'latte',
                'latte-macchiato',
                'iced-latte',
                'mocha',
                'cortado',
                'affogato',
            ],
            [
                'coffee-bean-type'
            ]
        )
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
