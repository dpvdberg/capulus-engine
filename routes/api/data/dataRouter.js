const express = require('express');
const router = express.Router();
const {models} = require('../../../database/connectmodels');
const {isAuthenticated, filterUser} = require("../auth/authenticate");
const rbac = require("../../../permissions/rbac");

router.get('/categories', function (req, res) {
    models.categories_descendants.findAll(
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

function getFullProductOptions() {
    return {
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

router.get('/product/:productId', (req, res) => {

    let productId = req.params['productId'];

    // fetch base info
    models.products.findByPk(productId,
        getFullProductOptions()
    ).then((data) => {
        // Propagate name of option
        data.options = propagateOptionName(data.options);
        res.json(data);
    });
});

router.post('/orders/put', isAuthenticated, (req, res) => {
    if (!Array.isArray(req.body)) {
        return res.status(400).send('Expected an array of products');
    }

    const order_products = []
    try {
        for (let product_order of req.body) {
            const product_options = []
            for (let product_option of product_order.product.options) {
                if (product_option.option_values.length > 0) {
                    // If this product option has option values, then the choice must reference one of those options.
                    product_options.push({
                        option_id: product_option.id,
                        option_value_id: product_option.choice
                    })
                } else {
                    // This option is boolean, only add if true, simply settings the option value reference to null
                    if (product_option.choice) {
                        product_options.push({
                            option_id: product_option.id,
                            option_value_id: null
                        })
                    }
                }
            }
            order_products.push({
                product_id: product_order.product.id,
                quantity: product_order.quantity,
                order_product_options: product_options
            })
        }
    } catch (e) {
        return res.status(400).send('Order request malformed');
    }

    models.orders.create({
        user_id: req.user.id,
        order_products: order_products
    }, {
        include: {
            model: models.order_products,
            include: {
                model: models.order_product_options
            }
        }
    });
})

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

router.get('/orders/get', isAuthenticated, (req, res) => {
    models.orders.findAll({
        where: {
            fulfilled: false,
            cancelled: false
        },
        order: ['createdAt']
    }).then((queuedOrders) => {
        models.orders.findAll({
            where: {user_id: req.user.id},
            attributes: {exclude: ['user_id', 'id']},
            order: [
                // First show in-progress orders
                ['fulfilled', 'asc'],
                // Put cancelled orders below fulfilled orders
                ['cancelled', 'asc'],
                // Then sort by creation time
                ['createdAt', 'desc'],
                // Then sort the options in the product accordingly
                ['product_orders', models.products, models.options, 'priority', 'asc']
            ],
            include: {
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


router.post('/bartender/orders/fulfill/:id', isAuthenticated, (req, res) => {
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


router.post('/bartender/orders/cancel/:id', isAuthenticated, (req, res) => {
    if (!req.body.reason) {
        res.status(400).json({
            name: "ReasonError",
            message: "Please provide a reason",
        })
        return;
    }

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

router.get('/bartender/orders/todo', isAuthenticated, (req, res) => {
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