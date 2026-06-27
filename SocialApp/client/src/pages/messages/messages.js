const socket = io("http://localhost:3000");

socket.on("message", (msg) => {
    const div = document.createElement("div");
    div.textContent = msg;
    document.getElementById("chatBox").appendChild(div);
});

function send() {
    const input = document.getElementById("msg");
    socket.emit("message", input.value);
    input.value = "";
}
