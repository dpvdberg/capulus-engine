const express = require('express');
const router = express.Router();
const models = require("../../../../../database/models");
const {sendOrderBroadcast, sendOrderNotificationUpdate, sendOrderQueueUpdate} = require("../../../../ws/ws");
const {isAuthenticated, filterUser} = require("../../../auth/authenticate");
const rbac = require("../../../../../permissions/rbac");
const {getFullProductOptions, setOrderChoices} = require("../../utils");
const {Op} = require("sequelize");

router.post('/fulfill/:id', isAuthenticated, (req, res) => {
    const roles = req.user.roles.map(r => r.name);

    rbac.can(roles, 'orders:modify')
        .then(result => {
            if (!result) {
                return res.status(401).send('User not authorized')
            }

            models.order.findByPk(req.params['id'])
                .then(o => {
                        o.fulfilled = true;
                        o.save().then((o) => {
                            res.json({success: true});
                            sendOrderQueueUpdate(o);
                            sendOrderBroadcast('fulfilled');
                            sendOrderNotificationUpdate(req.params['id'], 'fulfilled');
                        })
                    },
                    err => {
                        console.log(err)
                        res.status(400).send('Could not fulfill order')
                    })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send('Authorization error')
        });
})

router.post('/cancel/:id', isAuthenticated, (req, res) => {
    const roles = req.user.roles.map(r => r.name);

    rbac.can(roles, 'orders:modify')
        .then(result => {
            if (!result) {
                return res.status(401).send('User not authorized')
            }

            models.order.findByPk(req.params['id'])
                .then(o => {
                        o.cancelled = true;
                        o.cancel_reason = req.body.reason;
                        o.save().then(o => {
                            res.json({success: true});
                            sendOrderQueueUpdate(o);
                            sendOrderBroadcast('cancelled');
                            sendOrderNotificationUpdate(req.params['id'], 'cancelled');
                        })
                    },
                    err => {
                        res.status(400).send('Could not cancel order')
                    })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send('Authorization error')
        });
})

router.get('/todo', isAuthenticated, (req, res) => {
    const roles = req.user.roles.map(r => r.name);

    rbac.can(roles, 'orders:list')
        .then(result => {
            if (!result) {
                return res.status(401).send('User not authorized')
            }

            models.order.findAll({
                where: {
                    fulfilled: false,
                    cancelled: false
                },
                attributes: {exclude: ['user_id']},
                order: [
                    // Sort by creation time
                    ['createdAt', 'ASC'],
                    // Then sort the options in the product accordingly
                    ['product_orders', models.product, models.option, 'priority', 'asc']
                ],
                include: [
                    {
                        model: models.user,
                        include: {
                            model: models.role,
                            attributes: ['name'],
                            through: {attributes: []},
                        }
                    },
                    {
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
                    }]
            }).then((orders) => {
                orders = orders.map(o => o.get({plain: true}))

                orders = setOrderChoices(orders);

                orders.forEach((o) => {
                    o.user = filterUser(o.user)
                })

                res.json(orders)
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send('Authorization error')
        });
})

module.exports = router;
