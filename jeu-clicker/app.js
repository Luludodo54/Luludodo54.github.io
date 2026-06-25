let player = "";
let money = 0;
let power = 1;
let prestigeLevel = 0;

let shop = document.getElementById("shop");
let leaderboard = document.getElementById("leaderboard");
let eventText = document.getElementById("event");

let upgrades = [];

// 🛒 SHOP ÉNORME généré automatiquement
function generateShop() {
    upgrades = [];

    for (let i = 1; i <= 20; i++) {
        upgrades.push({
            name: `+${i} puissance`,
            price: i * 100,
            buy: () => power += i
        });
    }

    upgrades.push({
        name: "🏭 Auto clic +1/s",
        price: 300,
        buy: () => setInterval(() => {
            money += 1;
            update();
        }, 1000)
    });

    upgrades.push({
        name: "⚡ x2 puissance",
        price: 1000,
        buy: () => power *= 2
    });

    upgrades.push({
        name: "💥 x10 boost 10s",
        price: 2000,
        buy: () => {
            let old = power;
            power *= 10;
            setTimeout(() => power = old, 10000);
        }
    });
}

// 👤 START
function startGame() {
    player = document.getElementById("name").value;
    if (!player) return;

    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "block";

    document.getElementById("playerName").textContent = player;

    load();
    generateShop();
    renderShop();
    renderLeaderboard();
}

// 💸 CLICK
document.getElementById("clickBtn").addEventListener("click", () => {
    money += power;
    update();
});

// 🛒 SHOP
function renderShop() {
    shop.innerHTML = "";

    upgrades.forEach((u, i) => {
        let div = document.createElement("div");
        div.className = "shop-item";

        div.innerHTML = `
            <h3>${u.name}</h3>
            <p>Prix : ${u.price}</p>
            <button onclick="buy(${i})">Acheter</button>
        `;

        shop.appendChild(div);
    });
}

function buy(i) {
    let item = upgrades[i];

    if (money >= item.price) {
        money -= item.price;
        item.buy();
        update();
    } else {
        alert("Pas assez d'argent !");
    }
}

// 🌪️ EVENTS ALÉATOIRES
setInterval(() => {
    let events = [
        { text: "💥 BOOM x2 argent pendant 10s", effect: () => money *= 2 },
        { text: "😢 taxe -20%", effect: () => money *= 0.8 },
        { text: "🔥 bonus +500", effect: () => money += 500 }
    ];

    let e = events[Math.floor(Math.random() * events.length)];
    eventText.textContent = e.text;

    e.effect();
    update();

    setTimeout(() => eventText.textContent = "", 5000);

}, 15000);

// 🏆 PRESTIGE
function prestige() {
    prestigeLevel++;
    power = 1 + prestigeLevel;
    money = 0;

    saveLeaderboard();

    update();
    renderLeaderboard();
}

// 🏅 LEADERBOARD LOCAL
function saveLeaderboard() {
    let board = JSON.parse(localStorage.getItem("board")) || [];

    board.push({
        name: player,
        prestige: prestigeLevel,
        money: money
    });

    localStorage.setItem("board", JSON.stringify(board));
}

function renderLeaderboard() {
    let board = JSON.parse(localStorage.getItem("board")) || [];

    board.sort((a, b) => b.money - a.money);

    leaderboard.innerHTML = "";

    board.slice(0, 10).forEach(p => {
        leaderboard.innerHTML += `
            <p>🏅 ${p.name} - 💰 ${p.money} - 🏆 ${p.prestige}</p>
        `;
    });
}

// 💾 SAVE
function update() {
    document.getElementById("money").textContent = Math.floor(money);
    document.getElementById("prestige").textContent = prestigeLevel;

    localStorage.setItem("money", money);
    localStorage.setItem("power", power);
    localStorage.setItem("prestige", prestigeLevel);
}

function load() {
    money = parseFloat(localStorage.getItem("money")) || 0;
    power = parseFloat(localStorage.getItem("power")) || 1;
    prestigeLevel = parseInt(localStorage.getItem("prestige")) || 0;
}