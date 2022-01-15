const {models} = require("../../database/connectmodels");
const {Op} = require("sequelize");

module.exports = function (app) {
    const express = require("express");
    const router = express.Router();

    const expressWs = require('express-ws')(app);

    const notifications = {
        orders: {},

    };

    router.ws('/notifications', function (ws, req) {
        if (!req.user) {
            ws.send('unauthorized')
            return;
        }

        models.orders.findAll({
            where: {user_id: req.user.id},
        }).then(orders => {
            for (let order of orders) {
                notifications.orders[order.id] = ws;
            }
        })

        ws.on('message', function (msg) {
            if (msg === 'queue_status') {
                console.log("requested queue status")
                models.orders.count({
                    where: {
                        fulfilled: false,
                        cancelled: false,
                        [Op.not]: [
                            {user_id: [req.user.id]}
                        ]
                    }
                }).then(c =>
                    ws.send(JSON.stringify({'queue_status': c}))
                )
            }
        });
    });

    // fake updates
    setInterval(function () {
        for (const [orderId, ws] of Object.entries(notifications.orders)) {
            ws.send(JSON.stringify({'order_update': orderId}))
        }
    }, 5000);

    return router;
}