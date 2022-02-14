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
    addOptionValue
}
