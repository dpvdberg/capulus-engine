const express = require("express");
const {models} = require("../../../../database/connectmodels");
const sequelize = require("sequelize");
const router = express.Router();

router.get('/orders/calendar', (req, res) => {
    models.orders.findAll({
        attributes: [
            [ sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d'), 'day'],
            [ sequelize.fn('count', '*'), 'value']
        ],
        group: 'day',
        order: [[sequelize.col('day'), 'DESC']]
    }).then((orders) => {
        res.json(orders)
    })
})

router.get('/orders/products', (req, res) => {
    models.order_products.findAll({
        attributes: [
            [ sequelize.fn('sum', sequelize.col('quantity')), 'value'],
            [ sequelize.col('product.name'), 'name']
        ],
        include: {
            model: models.products,
            attributes : [],
        },
        group: 'product_id',
        order: [[sequelize.col('value'), 'DESC']]
    }).then((orders) => {
        res.json(orders)
    })
})

module.exports = router;
