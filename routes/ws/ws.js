const { Server } = require("socket.io");
const {models} = require("../../database/connectmodels");
const rbac = require("../../permissions/rbac");

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

    const orders = models.orders.findAll({
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

function sendOrderNotificationUpdate(order_id, fulfilled) {
    io.to(`order-${order_id}`).emit('order_update',
        JSON.stringify({
            'fulfilled' : fulfilled
        })
    )
}

function sendOrderBroadcast(update_status) {
    io.to('order-listeners').emit('orders_changed',
        JSON.stringify({
            'status' : update_status
        }))
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

        if (!socket.request.user) {
            socket.send(JSON.stringify({'error': 'unauthorized'}))
            return;
        }

        socket.on("disconnect", (reason) => {
            console.log("[SOCKET] Disconnect: " + reason)
        });

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

    setInterval(function () {
        console.log('#clients', io.engine.clientsCount);
    }, 1000)
}

module.exports = {
    setup,
    subscribeUserToOrder,
    subscribeUserToOrders,
    sendOrderNotificationUpdate,
    sendOrderBroadcast
}
