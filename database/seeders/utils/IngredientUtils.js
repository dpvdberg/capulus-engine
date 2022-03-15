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
    addIngredients
}
