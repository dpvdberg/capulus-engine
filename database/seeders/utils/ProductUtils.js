async function addProduct(queryInterface, name, category, priority, ingredients, options, hide_if_unavailable=false) {
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
                hide_if_unavailable: hide_if_unavailable
            }]).then(async (product_id) => {
                await queryInterface.bulkInsert('product_categories', [{
                    product_id: product_id,
                    category_id: category_id
                }]);

                if (ingredients.length > 0) {
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
                }

                if (options.length > 0) {
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
                }
            })
        })
}

module.exports = {
    addProduct
}
