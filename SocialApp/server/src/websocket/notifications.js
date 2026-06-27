let usersSockets = {};

function initNotifications(io) {
    io.on("connection", (socket) => {

        socket.on("register", (userId) => {
            usersSockets[userId] = socket.id;
        });

        socket.on("notify", ({ userId, message }) => {
            const socketId = usersSockets[userId];
            if (socketId) {
                io.to(socketId).emit("notification", message);
            }
        });
    });
}

module.exports = initNotifications;
