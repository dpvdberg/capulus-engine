'use strict';

async function addOptionValue(queryInterface, option_name, is_default, ingredient = null, name = null) {
    let ingredient_id = null;
    if (ingredient) {
        ingredient_id = await queryInterface.rawSelect('ingredients', {
            where: {name: ingredient},
        }, ['id'])
        if (!ingredient_id) {
            console.error(`Ingredient '${ingredient}' not found`)
            return;
        }
    }

    const option_id = await queryInterface.rawSelect('options', {
        where: {name: option_name},
    }, ['id'])
    if (!option_id) {
        console.error(`Option '${option_name}' not found`)
        return;
    }

    await queryInterface.bulkInsert('option_values', [{
        name: name,
        option_id: option_id,
        ingredient_id: ingredient_id,
        default: is_default
    }])
}

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
