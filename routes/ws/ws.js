const models = require("../../database/models")
const rbac = require("../../permissions/rbac");
const {Op} = require("sequelize");

let io = null;

function subscribeUserToOrder(user_id, order_id) {
    io.in(`user-${user_id}`)
        .fetchSockets()
        .then((sockets) => {
            for (let socket of sockets) {
                socket.join(`order-${order_id}`)
            }
        })
}

function subscribeUserToOrders(user_id) {
    const sockets = io.in(`user-${user_id}`)
        .fetchSockets();

    const orders = models.order.findAll({
        where: {
            user_id: user_id,
            fulfilled: false,
            cancelled: false
        },
    });

    Promise.all([sockets, orders])
        .then(([sockets, orders]) => {
            for (let order of orders) {
                for (let socket of sockets) {
                    socket.join(`order-${order.id}`)
                }
            }
    })
}

function sendOrderNotificationUpdate(order_id, update) {
    io.to(`order-${order_id}`).emit('order_update',
        JSON.stringify({
            'update' : update
        })
    )
}

function sendOrderBroadcast(update_status) {
    io.to('order-listeners').volatile.emit('orders_changed',
        JSON.stringify({
            'status' : update_status
        }))
}

function sendOrderQueueUpdate(order) {
    // Get order that is next in line and push a notification
    models.order.findOne({
        where: {
            fulfilled: false,
            cancelled: false,
            createdAt: {
                [Op.gt]: order.createdAt
            }
        },
        order: [['createdAt', 'ASC']]
    }).then((o) => {
        console.log("TEST1");
        if (o) {
            console.log("TEST2");
            console.log("TEST2");
            sendOrderNotificationUpdate(o.id, 'queue');
        }
    })
}

function sendIngredientBroadcast() {
    io.to('ingredient-listeners').emit('ingredients_changed')
}

function setup(server, _io) {
    io = _io;

    io.filterSocketsByUser = filterFn =>
        Object.values(io.sockets.connected)
            .filter(socket => socket.handshake && filterFn(socket.conn.request.user))

    io.emitToUser = (_id, event, ...args) =>
        io.filterSocketsByUser(user => user.id.equals(_id))
            .forEach(socket => socket.emit(event, ...args))

    io.on('connection', (socket) => {
        console.log("[SOCKET] New client")

        // Everyone subscribes to ingredient updates
        socket.join('ingredient-listeners')

        socket.on("disconnect", (reason) => {
            console.log("[SOCKET] Disconnect: " + reason)
        });

        if (!socket.request.user) {
            console.log("[SOCKET] Guest detected")
            return;
        }

        ////
        // Signed in users
        ////

        // Subscribe user to its own user pool
        socket.join(`user-${socket.request.user.id}`)

        // Subscribe to updates of current active orders
        subscribeUserToOrders(socket.request.user.id)

        // Subscribe to bartender updates if applicable
        const roles = socket.request.user.roles.map(r => r.name);
        rbac.can(roles, 'orders:notifications').then((result) => {
            if (result) {
                socket.join('order-listeners')
            }
        })
    });

    // setInterval(function () {
    //     console.log('#clients', io.engine.clientsCount);
    // }, 1000)
}

module.exports = {
    setup,
    subscribeUserToOrder,
    subscribeUserToOrders,
    sendOrderNotificationUpdate,
    sendOrderQueueUpdate,
    sendOrderBroadcast,
    sendIngredientBroadcast
}
