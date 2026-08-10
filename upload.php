<?php

header("Content-Type: application/json; charset=utf-8");

$uploadDir = __DIR__ . "/uploads/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if (!isset($_FILES["file"])) {
    echo json_encode([
        "success" => false,
        "error" => "Aucun fichier reçu."
    ]);
    exit;
}

$file = $_FILES["file"];

if ($file["error"] !== UPLOAD_ERR_OK) {
    echo json_encode([
        "success" => false,
        "error" => "Erreur pendant l'envoi."
    ]);
    exit;
}

/*
 * Identifiant aléatoire.
 * Exemple : 8f3a91c2b7d4e601
 */
$id = bin2hex(random_bytes(8));

$extension = pathinfo(
    $file["name"],
    PATHINFO_EXTENSION
);

$extension = preg_replace(
    "/[^a-zA-Z0-9]/",
    "",
    $extension
);

$storedName = $id;

if ($extension !== "") {
    $storedName .= "." . $extension;
}

$destination = $uploadDir . $storedName;

if (!move_uploaded_file(
    $file["tmp_name"],
    $destination
)) {

    echo json_encode([
        "success" => false,
        "error" => "Impossible d'enregistrer le fichier."
    ]);

    exit;
}

$protocol = (
    isset($_SERVER["HTTPS"]) &&
    $_SERVER["HTTPS"] !== "off"
) ? "https" : "http";

$host = $_SERVER["HTTP_HOST"];

$url = $protocol .
       "://" .
       $host .
       "/transfert/download.php?id=" .
       urlencode($id);

echo json_encode([
    "success" => true,
    "url" => $url,
    "id" => $id
]);