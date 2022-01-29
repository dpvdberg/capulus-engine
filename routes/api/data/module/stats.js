const express = require("express");
const {models} = require("../../../../database/connectmodels");
const sequelize = require("sequelize");
const router = express.Router();

router.get('/calendar/orders', (req, res) => {
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

module.exports = router;
