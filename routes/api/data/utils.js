const {models} = require("../../../database/connectmodels");


function getFullProductOptions() {
    return {
        attributes: ['id', 'name'],
        order: [
            // Order by id
            ['id'],
            // Order the options in this query
            [models.options, 'priority'],
            // Order the option values in this query by name
            [models.options, models.option_values, 'name'],
            // Order the option values in this query by name
            [models.options, models.option_values, models.ingredients, 'name']
        ],
        include: [
            {
                // Include product ingredients
                model: models.product_ingredients,
                attributes: {exclude: ['product_id', 'ingredient_id']},
                include: {
                    model: models.ingredients
                }
            },
            {
                // Include options for this product
                model: models.options,
                through: {attributes: []},
                include: [
                    {
                        // Include form hint for options
                        model: models.formhints,
                        attributes: ['name'],
                    },
                    {
                        // Include possible values for each option
                        model: models.option_values,
                        attributes: {exclude: ['ingredient_id', 'option_id']},
                        include: {
                            model: models.ingredients
                        }
                    },
                ]
            },
        ]
    }
}

function propagateOptionName(options) {
    options.forEach(o =>
        o.option_values.forEach(ov => {
                if (ov.name == null && ov.ingredient != null) {
                    ov.name = ov.ingredient.name;
                }
            }
        )
    );
    return options;
}

function setOrderChoices(orders) {
    orders.forEach((order) => {
        // Set option choice
        order.product_orders.forEach((op) => {
            op.product.options = propagateOptionName(op.product.options);


            // set option choice to value in 'option_values'
            op.product.options.forEach((o) => {
                let option_value = op.option_values.find((ov) => ov.option_id === o.id);

                if (option_value) {
                    if (option_value.option_value_id === null) {
                        // The option is referencing a boolean option, where null indicates true.
                        o['choice'] = true
                    } else {
                        o['choice'] = option_value.option_value_id
                    }
                } else {
                    o['choice'] = null
                }
            })

            delete op.option_values;
        })
    });

    return orders;
}

module.exports = {
    getFullProductOptions,
    propagateOptionName,
    setOrderChoices
}
