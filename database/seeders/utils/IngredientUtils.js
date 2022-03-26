let cache = {}
async function findIngredientId(queryInterface, ingredient_name) {
    if (ingredient_name in cache) {
        return cache[ingredient_name]
    }

    return queryInterface.rawSelect('ingredients', {
        where: {
            name: ingredient_name,
        },
    }, ['id'])
        .then((id) => {
            if (!id) {
                return null
            }
            cache[ingredient_name] = id
            return id
        })
}

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

async function addIngredient(queryInterface, ingredient_name) {
    return await queryInterface.bulkInsert('ingredients', [{
            name: ingredient_name,
            createdAt: new Date(),
            updatedAt: new Date(),
        }]
    )
}

module.exports = {
    findIngredientId,
    addIngredient,
    addIngredients
}
