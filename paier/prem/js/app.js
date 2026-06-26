function sendQuestion(){

    let q = document.getElementById("question").value;

    let data = JSON.parse(localStorage.getItem("questions") || "[]");
    data.push(q);

    localStorage.setItem("questions", JSON.stringify(data));

    alert("Envoyé ✔");
}