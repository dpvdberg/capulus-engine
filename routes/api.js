const express = require('express');
const {Sequelize} = require('sequelize');
const router = express.Router();

const initModels = require("../database/models/init-models");

const sequelize = new Sequelize('capulus', 'capulus', 'xdgL5pGgJsf9PZhTdif', {
    dialect: 'mysql',
});
const models = initModels(sequelize);

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
            where: {category_id: req.params['categoryId']}
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
    const productInfo = models.products.findByPk(productId,
        {
            attributes: ['id', 'name'],
        }
    );

    // Fetch base ingredients
    const ingredientInfo = models.product_ingredients.findAll(
        {
            attributes: [
                [Sequelize.col('ingredient.id'), 'id'],
                [Sequelize.col('ingredient.name'), 'name'],
                [Sequelize.col('ingredient.in_stock'), 'in_stock'],
                'required'
            ],
            where: {product_id: productId},
            include: {
                model: models.ingredients,
                attributes: [],
            },
        }
    );


    // Fetch options and option ingredients
    const optionInfo = models.options.findAll(
        {
            attributes: {exclude: ['formhint_id']},
            include: [
                {   // For filtering
                    model: models.product_options,
                    where: {product_id: productId},
                    attributes: []
                },
                {
                    model: models.formhints,
                    attributes: ['name']
                },
                {
                    model: models.option_values,
                    attributes: {exclude: ['option_id', 'ingredient_id']},
                    include: {
                        model: models.ingredients,
                    }
                },
            ],
            order: ['priority']
        }
    );

    Promise.all([productInfo, ingredientInfo, optionInfo]).then((values) => {
        const [_productInfo, _ingredientInfo, _optionInfo] = values

        // Propagate name of option
        _optionInfo.forEach(o =>
            o.option_values.forEach(ov =>
                {
                    if (ov.name == null && ov.ingredient != null) {
                        ov.name = ov.ingredient.name;
                    }
                }
            )
        );

        // Post-process results
        let result = {
            'info': _productInfo,
            'ingredients': _ingredientInfo,
            'options': _optionInfo
        }

        res.json(result);
    });
});

module.exports = router;
