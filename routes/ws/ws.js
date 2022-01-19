const {models} = require("../../database/connectmodels");
const rbac = require("../../permissions/rbac");
const _ = require("lodash");

const notifications = {
    user_wss: {},
    order_listeners: {},
    bartenders: []
};

function cleanNotificationItem(item) {
    // Filter the list of web sockets per list
    for (let order_id of Object.keys(notifications[item])) {
        notifications[item][order_id] = notifications[item][order_id].filter(
            (ws) => !ws.shouldRemove
        );
    }
    // Remove empty listener list for item
    notifications[item] = _.pick(notifications[item], (id, wss) => wss.length > 0);
}

function cleanNotifications() {
    cleanNotificationItem('order_listeners')
    cleanNotificationItem('user_wss')

    // Clear bartender listeners
    notifications.bartenders = notifications.bartenders.filter(ws => !ws.shouldRemove);
}

function subscribeUserToOrder(user_id, order_id) {
    if (!(user_id in notifications.user_wss)) {
        return;
    }

    const user_wss = notifications.user_wss[user_id];
    if (!(order_id in notifications.order_listeners)) {
        notifications.order_listeners[order_id] = []
    }
    notifications.order_listeners[order_id].push(...user_wss)
}

function sendOrderNotificationUpdate(order_id, fulfilled) {
    if (order_id in notifications.order_listeners) {
        notifications.order_listeners[order_id].forEach((ws) => {
            ws.send(JSON.stringify({
                'order_update': {
                    'fulfilled': fulfilled
                }
            }))
        })
    }
}

function sendOrdersChangedUpdate(update_status) {
    for (let ws of notifications.bartenders) {
        ws.send(JSON.stringify({'orders_changed': update_status}))
    }
}

function wsRouter(app) {
    const express = require("express");
    const router = express.Router();
    const expressWs = require('express-ws')(app);

    router.ws('/notifications', function (ws, req) {

        console.log(req.user);
        console.log("new client!")
        if (!req.user) {
            ws.send(JSON.stringify({ 'error' : 'unauthorized'}))
            return;
        }
        const roles = req.user.roles.map(r => r.name);

        ws.isAlive = true;
        ws.shouldRemove = false;

        ws.on('pong', function () {
            this.isAlive = true;
        });

        ws.on('close', function () {
            this.shouldRemove = true;
            cleanNotifications();
        })

        // Store websocket for this user
        if (!(req.user.id in notifications.user_wss)) {
            notifications.user_wss[req.user.id] = []
        }
        notifications.user_wss[req.user.id].push(ws);

        // Subscribe to updates of current active orders
        models.orders.findAll({
            where: {
                user_id: req.user.id,
                fulfilled: false,
                cancelled: false
            },
        }).then(orders => {
            for (let order of orders) {
                if (!(order.id in notifications.order_listeners)) {
                    notifications.order_listeners[order.id] = []
                }
                notifications.order_listeners[order.id].push(ws);
            }
        })

        // Subscribe to bartender updates if applicable
        rbac.can(roles, 'bartender').then((result) => {
            if (result) {
                notifications.bartenders.push(ws)
            }
        })
    });

    const wss = expressWs.getWss('/notifications');

    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) {
                console.log("client dead")

                ws.shouldRemove = true;
                cleanNotifications();

                return ws.terminate();
            }

            ws.isAlive = false;
            ws.ping();
        });

        console.log('orders', Object.keys(notifications.order_listeners))
        console.log('users', Object.keys(notifications.user_wss))
        console.log('bartenders', notifications.bartenders.length)

    }, 1000); // every 30 seconds

    wss.on('close', function close() {
        clearInterval(interval);
    });

    return router
}

module.exports = {
    wsRouter,
    sendOrderNotificationUpdate,
    subscribeUserToOrder,
    sendOrdersChangedUpdate
}
