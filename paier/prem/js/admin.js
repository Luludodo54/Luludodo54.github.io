if(localStorage.getItem("auth") !== "true"){
    window.location.href="admin.html";
}

let q = JSON.parse(localStorage.getItem("questions") || "[]");

document.getElementById("questions").innerHTML =
q.map(x => "• " + x).join("<br>");

let clicks = localStorage.getItem("clicks") || 0;
document.getElementById("clicks").innerText = clicks;