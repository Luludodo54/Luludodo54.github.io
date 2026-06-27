#!/bin/bash

echo "🚀 CREATION SOCIAL APP FINAL BOSS..."

BASE="SocialApp"

# =========================
# ROOT
# =========================
mkdir -p $BASE/{client,server,database,docs,scripts,uploads}

# =========================
# CLIENT (REACT READY STRUCTURE)
# =========================
mkdir -p $BASE/client/src/{pages,components,services,context,styles,utils}

mkdir -p $BASE/client/src/pages/{home,video,mideo,live,chat,login,register,profile,studio,settings}

mkdir -p $BASE/client/src/components/{navbar,sidebar,video,mideo,chat,live,comments,upload}

mkdir -p $BASE/client/src/services
mkdir -p $BASE/client/src/context

# =========================
# SERVER (NODE BACKEND)
# =========================
mkdir -p $BASE/server/src/{routes,controllers,models,services,middleware,config,websocket,ai,monetization}

mkdir -p $BASE/server/src/routes/{auth,users,videos,mideos,live,chat,ads,follow}

mkdir -p $BASE/server/uploads/{videos,mideos,avatars,banners,temp}

# =========================
# DATABASE
# =========================
mkdir -p $BASE/database/{migrations,seeders,schema}

# =========================
# DOCS
# =========================
mkdir -p $BASE/docs

# =========================
# FILES FRONTEND
# =========================
touch $BASE/client/src/services/api.js
touch $BASE/client/src/services/auth.js
touch $BASE/client/src/context/AuthContext.js
touch $BASE/client/src/styles/global.css
touch $BASE/client/src/pages/home/Home.jsx

# =========================
# FILES BACKEND CORE
# =========================
touch $BASE/server/src/server.js
touch $BASE/server/src/config/db.js

# =========================
# BASIC SERVER SETUP
# =========================

cat > $BASE/server/src/server.js <<EOL
const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// ROUTES PLACEHOLDER
app.get("/", (req, res) => {
    res.send("🔥 SOCIAL APP FINAL BOSS RUNNING");
});

server.listen(3000, () => {
    console.log("Server running on 3000 🚀");
});
EOL

# =========================
# API BASE FRONTEND
# =========================

cat > $BASE/client/src/services/api.js <<EOL
import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api"
});

export default API;
EOL

# =========================
# AUTH CONTEXT FRONTEND
# =========================

cat > $BASE/client/src/context/AuthContext.js <<EOL
import { createContext } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    );
}
EOL

# =========================
# HOME PAGE
# =========================

cat > $BASE/client/src/pages/home/Home.jsx <<EOL
import React from "react";

export default function Home() {
    return (
        <div>
            <h1>🔥 Social App Home Feed</h1>
        </div>
    );
}
EOL

# =========================
# DONE
# =========================

echo "✅ SOCIAL APP FINAL BOSS CREATED"
echo "📁 Project: $BASE"
echo "🚀 Ready to scale like YouTube + TikTok + Twitch"