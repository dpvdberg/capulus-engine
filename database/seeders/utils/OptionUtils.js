const {addIngredient, findIngredientId} = require("./IngredientUtils");
const {findFormhintId} = require("./FormhintUtils");

let cache = {}

async function findOptionId(queryInterface, option_name) {
    if (option_name in cache) {
        return cache[option_name]
    }

    return queryInterface.rawSelect('options', {
        where: {
            name: option_name,
        },
    }, ['id'])
        .then((id) => {
            if (!id) {
                return null
            }
            cache[option_name] = id
            return id
        })
}

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

async function setOptionValueDefaultIngredient(queryInterface, option_name, ingredient_name, single = true) {
    let ingredient_id = await queryInterface.rawSelect('ingredients', {
        where: {name: ingredient_name},
    }, ['id'])

    if (!ingredient_id) {
        console.error(`Ingredient '${ingredient_name}' not found`)
        return;
    }

    const option_id = await queryInterface.rawSelect('options', {
        where: {name: option_name},
    }, ['id'])

    if (!option_id) {
        console.error(`Option '${option_name}' not found`)
        return;
    }

    if (single) {
        await queryInterface.sequelize.query(`
          UPDATE option_values as ov
          SET ov.default = false
          WHERE option_id = :option_id
        `, {
            replacements: {
                option_id: option_id,
            }
        })
    }

    await queryInterface.sequelize.query(`
          UPDATE option_values as ov
          SET ov.default = true
          WHERE option_id = :option_id
          AND ingredient_id = :ingredient_id
        `, {
        replacements: {
            option_id: option_id,
            ingredient_id: ingredient_id
        }
    })

    return option_id;
}

async function addOptionWithIngredients(queryInterface, option_name, ingredients, ingredients_required, formhint, has_none, show_default, priority, default_ingredient = null) {
    let ingredient_ids = {};
    for (let ingredient_name of ingredients) {
        let ingredient_id = await findIngredientId(queryInterface, ingredient_name);
        if (ingredient_id === null) {
            ingredient_id = await addIngredient(queryInterface, ingredient_name);
        }
        ingredient_ids[ingredient_name] = ingredient_id;
    }

    let option_id = await queryInterface.bulkInsert('options', [
        {
            name: option_name,
            formhint_id: await findFormhintId(queryInterface, formhint),
            required_ingredients: ingredients_required,
            has_none: has_none,
            show_default: show_default,
            priority: priority
        }]
    );

    await queryInterface.bulkInsert('option_values',
        Object.keys(ingredient_ids).map(iname => {
            return {
                option_id: option_id,
                ingredient_id: ingredient_ids[iname],
                default: iname === default_ingredient
            }
        })
    )

    return option_id;
}

async function addOptionWithNames(queryInterface, option_name, names, formhint, has_none, show_default, priority, default_name = null) {
    let option_id = await queryInterface.bulkInsert('options', [
        {
            name: option_name,
            formhint_id: await findFormhintId(queryInterface, formhint),
            required_ingredients: false,
            has_none: has_none,
            show_default: show_default,
            priority: priority
        }]
    );

    await queryInterface.bulkInsert('option_values',
        names.map(oname => {
            return {
                name: oname,
                option_id: option_id,
                ingredient_id: null,
                default: oname === default_name
            }
        })
    )

    return option_id;
}

async function productApplyOptions(queryInterface, product_id, option_names) {
    let option_ids = {};
    for (let option_name of option_names) {
        option_ids[option_name] = await findOptionId(queryInterface, option_name);
    }

    await queryInterface.bulkInsert('product_options',
        option_names.map(option_name => {
            return {
                product_id: product_id,
                option_id: option_ids[option_name]
            }
        })
    );
}


module.exports = {
    addOptionValue,
    setOptionValueDefaultIngredient,
    addOptionWithNames,
    addOptionWithIngredients,
    productApplyOptions
}
