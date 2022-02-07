const models = require("../../../../database/models");
const express = require("express");
const {getFullProductOptions} = require("../utils");
const router = express.Router();

router.get('/', function (req, res) {
    models.category_descendant.findAll(
        {
            attributes: ['id', 'name', 'descendant_count'],
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
            attributes: ['id', 'name', 'descendant_count'],
            where: {category_id: req.params['categoryId']},
            order: ['priority']
        }
    );
    const products = models.product.findAll(
        {
            where: {category_id: req.params['categoryId']},
            ...getFullProductOptions()
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

module.exports = router;
