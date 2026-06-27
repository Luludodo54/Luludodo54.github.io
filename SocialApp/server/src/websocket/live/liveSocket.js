let liveRooms = {};

function initLive(io) {

    io.on("connection", (socket) => {

        socket.on("join-live", (liveId) => {
            socket.join(liveId);

            if (!liveRooms[liveId]) liveRooms[liveId] = 0;

            liveRooms[liveId]++;

            io.to(liveId).emit("viewer-update", liveRooms[liveId]);
        });

        socket.on("leave-live", (liveId) => {
            socket.leave(liveId);

            if (liveRooms[liveId]) liveRooms[liveId]--;

            io.to(liveId).emit("viewer-update", liveRooms[liveId]);
        });

        socket.on("live-message", ({ liveId, message }) => {
            io.to(liveId).emit("live-message", message);
        });

    });
}

module.exports = initLive;
