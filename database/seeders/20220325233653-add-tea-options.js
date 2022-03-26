'use strict';

const {addOptionWithIngredients, addOptionWithNames} = require("./utils/OptionUtils");

module.exports = {
    async up(queryInterface, Sequelize) {
        await addOptionWithNames(
            queryInterface,
            'tea-size',
            ['single-cup', 'tea-pot'],
            'radio',
            false,
            false,
            0,
            'single-cup'
        )

        await addOptionWithIngredients(
            queryInterface,
            'add-sugar',
            ['sugar'],
            false,
            'checkbox',
            false,
            false,
            100
        )

        await addOptionWithIngredients(
            queryInterface,
            'add-honey',
            ['honey'],
            false,
            'checkbox',
            false,
            false,
            101
        )
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("options",
            {
                name: {
                    [Sequelize.Op.in]: [
                        'tea-size',
                        'add-sugar',
                        'add-honey',
                    ]
                }
            }
        );
    }
};
