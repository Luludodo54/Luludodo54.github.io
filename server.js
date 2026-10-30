
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const UPLOAD_DIR = path.join(__dirname, "uploads");
const DATA_DIR = path.join(__dirname, "data");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    cb(null, crypto.randomUUID());
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DropShare - Partage de fichiers</title>
<style>
* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #090e1b;
  color: white;
  font-family: Arial, sans-serif;
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 550px;
  background: #141c2e;
  padding: 35px;
  border-radius: 22px;
  border: 1px solid #293650;
  text-align: center;
  box-shadow: 0 20px 70px #0005;
}

.logo {
  font-size: 32px;
  font-weight: bold;
  color: #68a5ff;
}

.subtitle {
  color: #9baac2;
  margin-bottom: 30px;
}

.drop {
  border: 2px dashed #45618c;
  border-radius: 16px;
  padding: 40px 15px;
  cursor: pointer;
  background: #1b2840;
  transition: .2s;
}

.drop:hover, .drop.active {
  border-color: #68a5ff;
  background: #223452;
}

.drop .emoji { font-size: 45px; }

.drop p { color: #a9b9d1; }

button {
  width: 100%;
  border: none;
  background: #3984f7;
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}

button:hover { background: #286bd0; }
button:disabled { opacity: .5; cursor: wait; }

#filename {
  color: #79b0ff;
  margin-top: 15px;
  overflow-wrap: anywhere;
}

#result {
  display: none;
  margin-top: 25px;
  padding: 20px;
  background: #1d3040;
  border-radius: 12px;
}

#link {
  display: block;
  color: #7eb5ff;
  overflow-wrap: anywhere;
  margin: 15px 0;
}

.info {
  color: #8292ac;
  font-size: 12px;
  margin-top: 25px;
}
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

  <button id="send">Envoyer le fichier</button>

  <div id="result">
    <h3>🎉 Ton fichier est en ligne !</h3>
    <p>Voici ton lien de téléchargement :</p>
    <a id="link" target="_blank"></a>
    <button id="copy">Copier le lien</button>
  </div>

  <p class="info">Partage de fichiers • Maximum 100 Mo par fichier</p>
</div>

<script>
const drop = document.getElementById("drop");
const input = document.getElementById("file");
const filename = document.getElementById("filename");
const send = document.getElementById("send");
const result = document.getElementById("result");

let selectedFile = null;

drop.onclick = () => input.click();

input.onchange = () => {
  selectedFile = input.files[0];
  showFile();
};

function showFile() {
  if (selectedFile) {
    filename.textContent = "📄 " + selectedFile.name;
    result.style.display = "none";
  }
}

drop.ondragover = (e) => {
  e.preventDefault();
  drop.classList.add("active");
};

drop.ondragleave = () => drop.classList.remove("active");

drop.ondrop = (e) => {
  e.preventDefault();
  drop.classList.remove("active");
  selectedFile = e.dataTransfer.files[0];
  showFile();
};

send.onclick = async () => {
  if (!selectedFile) {
    alert("Choisis d'abord un fichier !");
    return;
  }

  if (selectedFile.size > 100 * 1024 * 1024) {
    alert("Le fichier dépasse la limite de 100 Mo.");
    return;
  }

  const data = new FormData();
  data.append("file", selectedFile);

  send.disabled = true;
  send.textContent = "Envoi en cours...";

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: data
    });

    const json = await response.json();

    if (!response.ok) throw new Error(json.error);

    const url = location.origin + "/f/" + json.token;

    document.getElementById("link").href = url;
    document.getElementById("link").textContent = url;

    result.style.display = "block";
    send.textContent = "Fichier envoyé !";

  } catch (error) {
    alert(error.message || "Une erreur est survenue.");
    send.textContent = "Envoyer le fichier";
  } finally {
    send.disabled = false;
  }
};

document.getElementById("copy").onclick = async () => {
  const url = document.getElementById("link").href;
  await navigator.clipboard.writeText(url);
  document.getElementById("copy").textContent = "Lien copié !";
};
</script>
</body>
</html>
  `);
});

// Envoyer un fichier
app.post("/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: err.code === "LIMIT_FILE_SIZE"
          ? "Fichier trop volumineux (100 Mo maximum)."
          : "Impossible d'envoyer ce fichier."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Aucun fichier sélectionné."
      });
    }

    const token = crypto.randomBytes(24).toString("hex");

    const metadata = {
      filename: req.file.originalname,
      storedName: req.file.filename,
      size: req.file.size,
      createdAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(DATA_DIR, token + ".json"),
      JSON.stringify(metadata)
    );

    res.json({ token });
  });
});

// Télécharger un fichier
app.get("/f/:token", (req, res) => {
  const token = req.params.token;

  if (!/^[a-f0-9]{48}$/.test(token)) {
    return res.status(404).send("Lien invalide.");
  }

  const metadataPath = path.join(DATA_DIR, token + ".json");

  if (!fs.existsSync(metadataPath)) {
    return res.status(404).send("Fichier introuvable.");
  }

  const metadata = JSON.parse(
    fs.readFileSync(metadataPath, "utf8")
  );

  const filePath = path.join(UPLOAD_DIR, metadata.storedName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Fichier supprimé.");
  }

  res.download(filePath, path.basename(metadata.filename));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("DropShare lancé sur le port " + PORT);
});
