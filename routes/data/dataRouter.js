const express = require('express');
const {Sequelize} = require('sequelize');
const router = express.Router();
const {sequelize, models} = require('../../database/connectmodels');

router.get('/categories', function (req, res) {
    models.categories_descendants.findAll(
        {
            attributes: ['id', 'name', 'descendant_count'],
            where: {category_id: null},
            order: ['priority']
        }
    ).then((data) => {
        res.json(data)
    })
});

router.get('/category/:categoryId', function (req, res) {
    const categories = models.categories_descendants.findAll(
        {
            attributes: ['id', 'name', 'descendant_count'],
            where: {category_id: req.params['categoryId']},
            order: ['priority']
        }
    );
    const products = models.products.findAll(
        {
            attributes: ['id', 'name'],
            where: {category_id: req.params['categoryId']},
            include: {
                model: models.product_ingredients,
                attributes: {exclude: ['product_id', 'ingredient_id']},
                include: {
                    model: models.ingredients
                }
            }
        }
    );

    Promise
        .all([categories, products])
        .then((values) => {
            const [_categories, _products] = values
            res.json({
                'categories': _categories,
                'products': _products,
            })
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/product/:productId', async (req, res) => {

    let productId = req.params['productId'];

    // fetch base info
    models.products.findByPk(productId,
        {
            attributes: ['id', 'name'],
            order: [
                // Order the options in this query
                [models.options, 'priority']
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
    ).then((data) => {
        // Propagate name of option
        data.options.forEach(o =>
            o.option_values.forEach(ov => {
                    if (ov.name == null && ov.ingredient != null) {
                        ov.name = ov.ingredient.name;
                    }
                }
            )
        );

        res.json(data);
    });
});

module.exports = router;
