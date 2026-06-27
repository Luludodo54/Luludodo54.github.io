const socket = io("http://localhost:3000");

const liveId = window.location.search.split("=")[1];

socket.emit("join-live", liveId);

socket.on("viewer-update", (count) => {
    document.getElementById("viewerCount").innerText = "Viewers: " + count;
});

socket.on("live-message", (msg) => {
    const div = document.createElement("div");
    div.textContent = msg;
    document.getElementById("chat").appendChild(div);
});

function send() {
    const input = document.getElementById("msg");

    socket.emit("live-message", {
        liveId,
        message: input.value
    });

    input.value = "";
}
