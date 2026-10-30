
require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const crypto = require("crypto");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

app.use(cors({
  origin: [
    "https://luludodo54.github.io",
    "http://localhost:3000"
  ]
}));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
});

const EXPIRATION = 24 * 60 * 60 * 1000;

// PAGE PRINCIPALE
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DropShare</title>
<style>
*{box-sizing:border-box}
body{
margin:0;min-height:100vh;padding:20px;
display:flex;align-items:center;justify-content:center;
background:#090e1b;color:white;
font-family:Arial,sans-serif
}
.container{
width:100%;max-width:550px;padding:35px;
background:#141c2e;border:1px solid #293650;
border-radius:22px;text-align:center;
box-shadow:0 20px 70px #0005
}
.logo{font-size:36px;font-weight:bold;color:#68a5ff}
.subtitle{color:#9baac2;margin-bottom:30px}
.drop{
padding:40px 15px;border:2px dashed #45618c;
border-radius:16px;background:#1b2840;cursor:pointer;
transition:.2s
}
.drop:hover,.drop.active{border-color:#68a5ff;background:#223452}
.emoji{font-size:48px}
#filename{color:#79b0ff;margin-top:15px;overflow-wrap:anywhere}
button{
width:100%;padding:15px;border:0;border-radius:10px;
background:#3984f7;color:white;font-size:16px;
font-weight:bold;cursor:pointer;margin-top:20px
}
button:hover{background:#286bd0}
button:disabled{opacity:.5;cursor:wait}
#result{
display:none;margin-top:25px;padding:20px;
background:#1d3040;border-radius:12px
}
#link{color:#7eb5ff;overflow-wrap:anywhere;display:block;margin:15px 0}
#status{color:#a9b9d1}
.info{color:#8292ac;font-size:12px;margin-top:25px}
</style>
</head>
<body>
<div class="container">
<div class="logo">☁ DropShare</div>
<p class="subtitle">Partage tes fichiers simplement et rapidement.</p>

<div class="drop" id="drop">
<div class="emoji">📁</div>
<h3>Dépose ton fichier ici</h3>
<p>ou clique pour parcourir tes fichiers</p>
<input type="file" id="file" hidden>
<div id="filename"></div>
</div>

<button id="send">Envoyer mon fichier</button>
<p id="status"></p>

<div id="result">
<h3>🎉 Fichier envoyé !</h3>
<p>Ton lien de téléchargement :</p>
<a id="link"></a>
<button id="copy">📋 Copier le lien</button>
<p class="info">⏳ Ce lien expire dans 24 heures.</p>
</div>

<p class="info">DropShare • 50 Mo maximum • Liens valables 24h</p>
</div>

<script>
const API = location.origin;
const input = document.getElementById("file");
const drop = document.getElementById("drop");
const send = document.getElementById("send");
let selectedFile = null;

drop.onclick = () => input.click();

input.onchange = () => {
selectedFile = input.files[0];
showFile();
};

function showFile(){
if(selectedFile){
document.getElementById("filename").textContent =
"📄 " + selectedFile.name;
document.getElementById("status").textContent = "";
document.getElementById("result").style.display = "none";
}
}

drop.ondragover = e => {
e.preventDefault();
drop.classList.add("active");
};

drop.ondragleave = () => drop.classList.remove("active");

drop.ondrop = e => {
e.preventDefault();
drop.classList.remove("active");
selectedFile = e.dataTransfer.files[0];
showFile();
};

send.onclick = async () => {
if(!selectedFile) return alert("Choisis un fichier !");

if(selectedFile.size > 50 * 1024 * 1024)
return alert("Maximum 50 Mo !");

const data = new FormData();
data.append("file", selectedFile);

send.disabled = true;
send.textContent = "Envoi en cours...";
document.getElementById("status").textContent = "Téléversement...";

try{
const response = await fetch(API + "/api/upload",{
method:"POST",
body:data
});

const json = await response.json();
if(!response.ok) throw new Error(json.error);

const link = document.getElementById("link");
link.href = json.downloadUrl;
link.textContent = json.downloadUrl;

document.getElementById("result").style.display = "block";
document.getElementById("status").textContent = "Envoi terminé !";
send.textContent = "Envoyer un autre fichier";

}catch(error){
document.getElementById("status").textContent = "❌ " + error.message;
send.textContent = "Réessayer";
}finally{
send.disabled = false;
}
};

document.getElementById("copy").onclick = async () => {
await navigator.clipboard.writeText(
document.getElementById("link").href
);
document.getElementById("copy").textContent = "Lien copié !";
};
</script>
</body>
</html>`);
});

// UPLOAD
app.post("/api/upload", (req, res) => {
  upload.single("file")(req, res, async err => {
    try {
      if (err) {
        return res.status(400).json({
          error: "Fichier trop volumineux (50 Mo maximum)."
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: "Aucun fichier sélectionné."
        });
      }

      const token = crypto.randomBytes(24).toString("hex");
      const storagePath = crypto.randomUUID();
      const filename = path.basename(req.file.originalname);
      const expiresAt = new Date(Date.now() + EXPIRATION);

      const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(storagePath, req.file.buffer, {
          contentType: req.file.mimetype
        });

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from("shared_files")
        .insert({
          id: token,
          storage_path: storagePath,
          filename,
          file_size: req.file.size,
          expires_at: expiresAt.toISOString()
        });

      if (dbError) {
        await supabase.storage.from("files").remove([storagePath]);
        throw dbError;
      }

      res.json({
        success: true,
        token,
        downloadUrl: `${req.protocol}://${req.get("host")}/f/${token}`,
        expiresAt
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Erreur lors de l'envoi du fichier."
      });
    }
  });
});

// RECUPERER ET VERIFIER UN FICHIER
async function getValidFile(token) {
  if (!/^[a-f0-9]{48}$/.test(token)) return null;

  const { data, error } = await supabase
    .from("shared_files")
    .select("*")
    .eq("id", token)
    .maybeSingle();

  if (error || !data) return null;

  const expiration = data.expires_at
    ? new Date(data.expires_at)
    : new Date(new Date(data.created_at).getTime() + EXPIRATION);

  if (Date.now() >= expiration.getTime()) {
    await supabase.storage.from("files").remove([data.storage_path]);

    await supabase
      .from("shared_files")
      .delete()
      .eq("id", token);

    return null;
  }

  return { ...data, expiration };
}

// PAGE DE TELECHARGEMENT
app.get("/f/:token", async (req, res) => {
  try {
    const file = await getValidFile(req.params.token);

    if (!file) {
      return res.status(404).send(`
        <h1>Lien expiré ou introuvable</h1>
        <p>Ce fichier n'est plus disponible.</p>
        <a href="/">Retour à DropShare</a>
      `);
    }

    const remaining = Math.max(
      0,
      file.expiration.getTime() - Date.now()
    );

    res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Télécharger - DropShare</title>
<style>
body{
margin:0;min-height:100vh;display:flex;
align-items:center;justify-content:center;
background:#090e1b;color:white;font-family:Arial;
padding:20px
}
.card{
width:100%;max-width:450px;background:#141c2e;
padding:35px;border-radius:20px;text-align:center;
border:1px solid #293650
}
.icon{font-size:55px}
h1{color:#68a5ff}
.name{overflow-wrap:anywhere;color:#b8c8df}
button{
width:100%;padding:16px;background:#3984f7;
color:white;border:0;border-radius:10px;
font-size:17px;font-weight:bold;cursor:pointer;
margin-top:25px
}
.info{color:#9baac2;font-size:13px;margin-top:20px}
a{color:#68a5ff}
</style>
</head>
<body>
<div class="card">
<div class="icon">📄</div>
<h1>Ton fichier est prêt !</h1>
<p class="name">${escapeHtml(file.filename)}</p>
<p class="info">${(file.file_size / 1024 / 1024).toFixed(2)} Mo</p>
<button onclick="location.href='/api/download/${req.params.token}'">
⬇ Télécharger le fichier
</button>
<p class="info">⏳ Ce fichier expire dans 24 heures après son envoi.</p>
<a href="/">Partager un fichier</a>
</div>
</body>
</html>`);

  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur.");
  }
});

// TELECHARGEMENT REEL
app.get("/api/download/:token", async (req, res) => {
  try {
    const file = await getValidFile(req.params.token);

    if (!file) {
      return res.status(404).send("Ce fichier a expiré.");
    }

    const { data, error } = await supabase.storage
      .from("files")
      .createSignedUrl(file.storage_path, 60, {
        download: file.filename
      });

    if (error) throw error;

    res.redirect(data.signedUrl);

  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur de téléchargement.");
  }
});

// SECURISER LE NOM AFFICHÉ
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log("DropShare lancé sur le port " + PORT);
});
