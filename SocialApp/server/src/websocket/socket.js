const { Server } = require("socket.io");

function initSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("message", (msg) => {
            io.emit("message", msg);
        });
    });
}

module.exports = initSocket;
