<?php

ini_set('display_errors', '0');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

function sendResponse($success, $data = [])
{
    echo json_encode(
        array_merge(
            ['success' => $success],
            $data
        ),
        JSON_UNESCAPED_UNICODE
    );

    exit;
}


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    sendResponse(false, [
        'error' => 'Méthode non autorisée.'
    ]);
}


if (!isset($_FILES['file'])) {

    sendResponse(false, [
        'error' => 'Aucun fichier reçu.'
    ]);
}


$file = $_FILES['file'];


if ($file['error'] !== UPLOAD_ERR_OK) {

    $errors = [

        UPLOAD_ERR_INI_SIZE =>
            'Le fichier est trop volumineux pour le serveur.',

        UPLOAD_ERR_FORM_SIZE =>
            'Le fichier est trop volumineux.',

        UPLOAD_ERR_PARTIAL =>
            'Le fichier a été envoyé partiellement.',

        UPLOAD_ERR_NO_FILE =>
            'Aucun fichier sélectionné.',

        UPLOAD_ERR_NO_TMP_DIR =>
            'Le dossier temporaire est absent.',

        UPLOAD_ERR_CANT_WRITE =>
            'Le serveur ne peut pas écrire le fichier.',

        UPLOAD_ERR_EXTENSION =>
            'Une extension PHP a bloqué le fichier.'
    ];


    sendResponse(false, [
        'error' =>
            $errors[$file['error']]
            ?? 'Erreur inconnue.'
    ]);
}


$uploadDir =
    __DIR__ .
    DIRECTORY_SEPARATOR .
    'uploads';


if (!is_dir($uploadDir)) {

    if (!mkdir(
        $uploadDir,
        0755,
        true
    )) {

        sendResponse(false, [
            'error' =>
                'Impossible de créer le dossier uploads.'
        ]);
    }
}


if (!is_writable($uploadDir)) {

    sendResponse(false, [
        'error' =>
            'Le dossier uploads n’est pas accessible en écriture.'
    ]);
}


$id =
    bin2hex(
        random_bytes(12)
    );


$originalName =
    basename($file['name']);


$extension =
    pathinfo(
        $originalName,
        PATHINFO_EXTENSION
    );


$extension =
    preg_replace(
        '/[^a-zA-Z0-9]/',
        '',
        $extension
    );


$storedName = $id;


if ($extension !== '') {

    $storedName .=
        '.' .
        $extension;
}


$destination =
    $uploadDir .
    DIRECTORY_SEPARATOR .
    $storedName;


if (!move_uploaded_file(
    $file['tmp_name'],
    $destination
)) {

    sendResponse(false, [
        'error' =>
            'Impossible d’enregistrer le fichier.'
    ]);
}


$protocol =
    (
        !empty($_SERVER['HTTPS']) &&
        $_SERVER['HTTPS'] !== 'off'
    )
    ? 'https'
    : 'http';


$host =
    $_SERVER['HTTP_HOST'];


$folder =
    rtrim(
        dirname($_SERVER['SCRIPT_NAME']),
        '/'
    );


$url =
    $protocol .
    '://' .
    $host .
    $folder .
    '/download.php?id=' .
    urlencode($id);


sendResponse(true, [

    'url' =>
        $url,

    'id' =>
        $id,

    'filename' =>
        $originalName
]);