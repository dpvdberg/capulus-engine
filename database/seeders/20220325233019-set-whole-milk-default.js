'use strict';

const {setOptionValueDefaultIngredient} = require("./utils/OptionUtils");
module.exports = {
    async up(queryInterface, Sequelize) {
        await setOptionValueDefaultIngredient(queryInterface, 'milk-type', 'whole-milk', true);

    },

    async down(queryInterface, Sequelize) {
        await setOptionValueDefaultIngredient(queryInterface, 'milk-type', 'semi-skimmed-milk', true);
    }
};
