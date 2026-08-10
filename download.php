<?php

if (!isset($_GET['id'])) {

    http_response_code(400);

    exit('Lien invalide.');
}


$id = $_GET['id'];


if (!preg_match(
    '/^[a-f0-9]{24}$/',
    $id
)) {

    http_response_code(400);

    exit('Lien invalide.');
}


$uploadDir =
    __DIR__ .
    DIRECTORY_SEPARATOR .
    'uploads';


$files =
    glob(
        $uploadDir .
        DIRECTORY_SEPARATOR .
        $id .
        '.*'
    );


if (!$files || count($files) === 0) {

    http_response_code(404);

    exit('Fichier introuvable.');
}


$file = $files[0];


if (!is_file($file)) {

    http_response_code(404);

    exit('Fichier introuvable.');
}


$extension =
    pathinfo(
        $file,
        PATHINFO_EXTENSION
    );


$downloadName =
    'fichier';


if ($extension !== '') {

    $downloadName .=
        '.' .
        $extension;
}


header(
    'Content-Type: application/octet-stream'
);


header(
    'Content-Disposition: attachment; filename="' .
    $downloadName .
    '"'
);


header(
    'Content-Length: ' .
    filesize($file)
);


header(
    'Cache-Control: no-cache, no-store, must-revalidate'
);


readfile($file);

exit;