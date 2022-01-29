const express = require('express');
const router = express.Router();
const {models} = require("../../../../../database/connectmodels");
const {sendOrderBroadcast, sendOrderNotificationUpdate} = require("../../../../ws/ws");
const {isAuthenticated, filterUser} = require("../../../auth/authenticate");
const rbac = require("../../../../../permissions/rbac");
const {getFullProductOptions, setOrderChoices} = require("../../utils");

router.post('/fulfill/:id', isAuthenticated, (req, res) => {
    const roles = req.user.roles.map(r => r.name);

    rbac.can(roles, 'orders:modify')
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    error: 'User not authorized'
                })
            }

            models.orders.update({
                fulfilled: true
            }, {
                where: {id: req.params['id']}
            }).then(() => {
                res.json({success: true});
                sendOrderBroadcast('fulfilled');
                sendOrderNotificationUpdate(req.params['id'], true);
            }, (err) => {
                console.log(err)
                res.status(400).json({
                    error: 'Could not fulfill order'
                })
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: 'Authorization error'
            })
        });
})

router.post('/cancel/:id', isAuthenticated, (req, res) => {
    const roles = req.user.roles.map(r => r.name);

    rbac.can(roles, 'orders:modify')
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    error: 'User not authorized'
                })
            }

            models.orders.update({
                cancelled: true,
                cancel_reason: req.body.reason
            }, {
                where: {id: req.params['id']}
            }).then(() => {
                res.json({success: true});
                sendOrderBroadcast('cancelled');
                sendOrderNotificationUpdate(req.params['id'], false);
            }, () => {
                res.status(400).json({
                    error: 'Could not cancel order'
                })
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: 'Authorization error'
            })
        });
})

router.get('/todo', isAuthenticated, (req, res) => {
    const roles = req.user.roles.map(r => r.name);

    rbac.can(roles, 'orders:list')
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    error: 'User not authorized'
                })
            }

            models.orders.findAll({
                where: {
                    fulfilled: false,
                    cancelled: false
                },
                attributes: {exclude: ['user_id']},
                order: [
                    // Sort by creation time
                    ['createdAt', 'asc'],
                    // Then sort the options in the product accordingly
                    ['product_orders', models.products, models.options, 'priority', 'asc']
                ],
                include: [
                    {
                        model: models.users,
                        include: {
                            model: models.roles,
                            attributes: ['name'],
                            through: {attributes: []},
                        }
                    },
                    {
                        model: models.order_products,
                        as: 'product_orders',
                        attributes: {exclude: ['id', 'order_id', 'product_id']},
                        include: [
                            {
                                model: models.order_product_options,
                                as: 'option_values',
                                // Fetch associated option and option_value as flat values in product_option
                                attributes: ['option_id', 'option_value_id']
                            },
                            {
                                model: models.products,
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
            return res.status(500).json({
                error: 'Authorization error'
            })
        });
})

module.exports = router;
