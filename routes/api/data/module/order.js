const models = require("../../../../database/models");
const express = require("express");
const {getFullProductOptions, setOrderChoices} = require("../utils");
const {isAuthenticated} = require("../../auth/authenticate");
const {sendOrderBroadcast, subscribeUserToOrder} = require("../../../ws/ws");
const router = express.Router();

router.post('/put', isAuthenticated, (req, res) => {
    if (!Array.isArray(req.body)) {
        return res.status(400).send('Expected an array of products');
    }

    if (req.body.length <= 0) {
        return res.status(400).send('Empty list of products');
    }

    const order_products = []
    try {
        for (let product_order of req.body) {
            const product_options = []
            for (let product_option of product_order.product.options) {
                if (product_option.formhint.name === 'checkbox') {
                    // This option is boolean, only add if true, simply settings the option value reference to null
                    if (product_option.choice) {
                        product_options.push({
                            option_id: product_option.id,
                            option_value_id: null
                        })
                    }
                } else {
                    // If this product option has option values, then the choice must reference one of those options
                    // or -1 if has_none and none is chosen
                    if (product_option.has_none && product_option.choice === -1) {
                        continue;
                    }
                    product_options.push({
                        option_id: product_option.id,
                        option_value_id: product_option.choice
                    })
                }
            }
            order_products.push({
                product_id: product_order.product.id,
                quantity: product_order.quantity,
                option_values: product_options
            })
        }
    } catch (e) {
        return res.status(400).send('Order request malformed');
    }

    models.order.create({
        user_id: req.user.id,
        product_orders: order_products
    }, {
        include: {
            model: models.order_product,
            as: 'product_orders',
            include: {
                model: models.order_product_option,
                as: 'option_values',
            }
        }
    }).then((order) => {
        res.sendStatus(200);
        sendOrderBroadcast('new');
        subscribeUserToOrder(req.user.id, order.id);
    }, (err) => {
        console.error(err)
        return res.status(400).send('Could not create order');
    });
})

router.get('/get', isAuthenticated, (req, res) => {
    models.order.findAll({
        where: {
            fulfilled: false,
            cancelled: false
        },
        order: ['createdAt']
    }).then((queuedOrders) => {
        models.order.findAll({
            where: {user_id: req.user.id},
            attributes: {exclude: ['user_id']},
            order: [
                // Then sort by creation time
                ['createdAt', 'desc'],
                // Then sort the options in the product accordingly
                ['product_orders', models.product, models.option, 'priority', 'asc']
            ],
            include: {
                model: models.order_product,
                as: 'product_orders',
                attributes: {exclude: ['id', 'order_id', 'product_id']},
                include: [
                    {
                        model: models.order_product_option,
                        as: 'option_values',
                        // Fetch associated option and option_value as flat values in product_option
                        attributes: ['option_id', 'option_value_id']
                    },
                    {
                        model: models.product,
                        ...getFullProductOptions()
                    }
                ]
            }
        }).then((orders) => {
            orders = orders.map(o => o.get({plain: true}))

            orders = setOrderChoices(orders);

            orders.forEach((order) => {
                // Set queue status
                order['queue_status'] = queuedOrders.filter(
                    o => Date.createFromMysql(o.createdAt) < Date.createFromMysql(order.createdAt)
                ).length;
            })

            res.json(orders)
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
})

router.post('/cancel/:id', isAuthenticated, (req, res) => {
    models.order.findByPk(req.params['id'],
        {
            include: models.user
        }).then((order) => {
        if (order.user.id !== req.user.id) {
            return res.status(401).json({
                error: 'User not authenticated'
            })
        }

        order.cancelled = true;
        order.save().then(() => {
            res.json({success: true});
            sendOrderBroadcast('cancelled');
        });
    }, (err) => {
        console.log(err)
        res.status(400).json({
            error: 'Could not cancel order'
        })
    })
});

module.exports = router;
