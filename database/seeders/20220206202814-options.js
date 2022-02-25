'use strict';

const {findFormhintId} = require("./utils/FormhintUtils");
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('options', [
            {
                name: 'cappuccino-type',
                formhint_id: await findFormhintId(queryInterface, 'radio'),
                required_ingredients: false,
                has_none: false,
                show_default: true,
                priority: 0
            },
            {
                name: 'milk-type',
                formhint_id: await findFormhintId(queryInterface, 'select'),
                required_ingredients: true,
                has_none: false,
                show_default: true,
                priority: 1
            },
            {
                name: 'syrup',
                formhint_id: await findFormhintId(queryInterface, 'select'),
                required_ingredients: false,
                has_none: true,
                show_default: false,
                priority: 2
            },
            {
                name: 'extra-shot',
                formhint_id: await findFormhintId(queryInterface, 'checkbox'),
                required_ingredients: false,
                has_none: false,
                show_default: false,
                priority: 100
            },
            {
                name: 'whipped-cream',
                formhint_id: await findFormhintId(queryInterface, 'checkbox'),
                required_ingredients: false,
                has_none: false,
                show_default: false,
                priority: 101
            },
            {
                name: 'double-shot',
                formhint_id: await findFormhintId(queryInterface, 'checkbox'),
                required_ingredients: false,
                has_none: false,
                show_default: false,
                priority: 100
            },
            {
                name: 'splash-of-milk',
                formhint_id: await findFormhintId(queryInterface, 'select'),
                required_ingredients: false,
                has_none: true,
                show_default: false,
                priority: 1
            },
        ])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("options", null);
    }
};
