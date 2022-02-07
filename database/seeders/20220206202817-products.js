'use strict';

async function addProduct(queryInterface, name, category, priority, ingredients, options) {
    await queryInterface.rawSelect('categories', {
        where: {name: category},
    }, ['id'])
        .then(async (category_id) => {
            if (!category_id) {
                console.error(`Category '${category}' not found`)
                return;
            }

            console.log(`Adding product '${name}'`)

            await queryInterface.bulkInsert('products', [{
                name: name,
                priority: priority,
                category_id: category_id
            }]).then(async (product_id) => {
                const productIngredientPromises = ingredients.map(async ([ingr_name, required]) => {
                    const ingredient_id = await queryInterface.rawSelect('ingredients', {
                        where: {name: ingr_name},
                    }, ['id'])
                    if (!ingredient_id) {
                        console.error(`Ingredient '${ingr_name}' not found`)
                        return;
                    }

                    return {
                        product_id: product_id,
                        ingredient_id: ingredient_id,
                        required: required
                    }
                })
                await Promise.all(productIngredientPromises).then(async (pi_data) => {
                    await queryInterface.bulkInsert('product_ingredients', pi_data)
                })

                const productOptionPromises = options.map(async (o) => {
                    const option_id = await queryInterface.rawSelect('options', {
                        where: {name: o},
                    }, ['id'])
                    if (!option_id) {
                        console.error(`Option '${o}' not found`)
                        return;
                    }

                    return {
                        product_id: product_id,
                        option_id: option_id
                    }
                })
                await Promise.all(productOptionPromises).then(async (po_data) => {
                    await queryInterface.bulkInsert('product_options', po_data)
                })
            })
        })
}

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
