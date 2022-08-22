const models = require("../../../../database/models");
const express = require("express");
const {getFullProductOptions} = require("../utils");
const router = express.Router();

router.get('/', function (req, res) {
    models.category_descendant.findAll(
        {
            where: {category_id: null},
            order: ['priority']
        }
    ).then((data) => {
        res.json(data)
    }).catch((err) => {
        console.log(err)
    });
});

router.get('/:categoryId', function (req, res) {
    const categories = models.category_descendant.findAll(
        {
            where: {category_id: req.params['categoryId']},
            order: ['priority']
        }
    );

    let productOptions = getFullProductOptions();
    productOptions.include.push({
        model: models.category,
        where: {
            id: req.params['categoryId']
        },
        required: true
    });

    const products = models.product.findAll(productOptions);

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

module.exports = router;
