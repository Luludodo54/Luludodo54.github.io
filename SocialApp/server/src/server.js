const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// 🔥 HOME
// =========================
app.get("/", (req, res) => {
    res.send("🔥 SOCIAL APP FINAL BOSS RUNNING");
});

// =========================
// 🎥 VIDEOS (YouTube style)
// =========================
app.get("/api/videos", (req, res) => {
    res.json([
        {
            id: 1,
            title: "Welcome to SocialApp",
            url: "https://example.com/video1.mp4",
            likes: 120
        },
        {
            id: 2,
            title: "How TikTok system works",
            url: "https://example.com/video2.mp4",
            likes: 98
        }
    ]);
});

// =========================
// 📱 MIDEOS (TikTok style)
// =========================
app.get("/api/mideos", (req, res) => {
    res.json([
        {
            id: 1,
            caption: "First mideo 🔥",
            url: "https://example.com/mideo1.mp4",
            likes: 300
        },
        {
            id: 2,
            caption: "Swipe up 🚀",
            url: "https://example.com/mideo2.mp4",
            likes: 450
        }
    ]);
});

// =========================
// 💬 CHAT SIMPLE
// =========================
app.get("/api/chat", (req, res) => {
    res.json([
        { user: "Alex", msg: "Hello 👋" },
        { user: "Sam", msg: "Yo bro 🔥" },
        { user: "Mina", msg: "Nice app 😎" }
    ]);
});

// =========================
// 🔴 LIVE SYSTEM (basic)
// =========================
app.get("/api/live", (req, res) => {
    res.json({
        status: "offline",
        viewers: 0,
        title: "No live running"
    });
});

// =========================
// 🚀 START SERVER
// =========================
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🔥 SERVER RUNNING ON http://localhost:${PORT}`);
});