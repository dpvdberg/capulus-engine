'use strict';

const {addOptionValue} = require("./utils/OptionUtils");

module.exports = {
    async up(queryInterface, Sequelize) {
        await addOptionValue(queryInterface,
            'milk-type', true, 'semi-skimmed-milk')
        await addOptionValue(queryInterface,
            'milk-type', false, 'whole-milk')
        await addOptionValue(queryInterface,
            'milk-type', false, 'skimmed-milk')
        await addOptionValue(queryInterface,
            'milk-type', false, 'soy-milk')
        await addOptionValue(queryInterface,
            'milk-type', false, 'oat-milk')
        await addOptionValue(queryInterface,
            'milk-type', false, 'almond-milk')

        await addOptionValue(queryInterface,
            'splash-of-milk', false, 'semi-skimmed-milk')
        await addOptionValue(queryInterface,
            'splash-of-milk', false, 'whole-milk')
        await addOptionValue(queryInterface,
            'splash-of-milk', false, 'skimmed-milk')
        await addOptionValue(queryInterface,
            'splash-of-milk', false, 'soy-milk')
        await addOptionValue(queryInterface,
            'splash-of-milk', false, 'oat-milk')
        await addOptionValue(queryInterface,
            'splash-of-milk', false, 'almond-milk')

        await addOptionValue(queryInterface,
            'cappuccino-type', false, null, 'traditional')
        await addOptionValue(queryInterface,
            'cappuccino-type', true, null, 'modern')

        await addOptionValue(queryInterface,
            'syrup', false, 'vanilla-syrup')
        await addOptionValue(queryInterface,
            'syrup', false, 'caramel-syrup')
        await addOptionValue(queryInterface,
            'syrup', false, 'toffee-nut-syrup')

        await addOptionValue(queryInterface,
            'whipped-cream', false, 'whipped-cream')
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("option_values", null);
    }
};
