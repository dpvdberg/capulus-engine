const {createServer} = require('http');
const {Server} = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log('a user connected');
});

httpServer.listen(process.env.WSPORT, () => {
    console.log(`Listening for sockets on ${process.env.WSPORT}`)
});
