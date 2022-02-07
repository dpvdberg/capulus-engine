'use strict';

async function addIngredients(queryInterface, ingredients) {
    await queryInterface.bulkInsert('ingredients',
        ingredients.map(i => {
            return {
                name: i,
                createdAt: new Date(),
                updatedAt: new Date(),

            }
        })
    )
}

module.exports = {
    async up(queryInterface, Sequelize) {
        await addIngredients(queryInterface, [
            'whole-milk',
            'semi-skimmed-milk',
            'skimmed-milk',
            'soy-milk',
            'oat-milk',
            'almond-milk',
            'vanilla-syrup',
            'caramel-syrup',
            'toffee-nut-syrup',
            'coffee-beans',
            'whipped-cream'
        ])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("ingredients", null);
    }
};
