<?php

if (!isset($_GET["id"])) {
    http_response_code(400);
    exit("Lien invalide.");
}

$id = $_GET["id"];

if (!preg_match("/^[a-f0-9]{16}$/", $id)) {
    http_response_code(400);
    exit("Lien invalide.");
}

$uploadDir = __DIR__ . "/uploads/";

$files = glob($uploadDir . $id . ".*");

if (!$files || count($files) === 0) {
    http_response_code(404);
    exit("Fichier introuvable.");
}

$file = $files[0];

$extension = pathinfo(
    $file,
    PATHINFO_EXTENSION
);

$downloadName = "fichier";

if ($extension !== "") {
    $downloadName .= "." . $extension;
}

header("Content-Type: application/octet-stream");

header(
    "Content-Disposition: attachment; filename=\"" .
    basename($downloadName) .
    "\""
);

header(
    "Content-Length: " .
    filesize($file)
);

readfile($file);
exit;