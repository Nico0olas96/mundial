<?php

if (session_status() === PHP_SESSION_NONE) {
    $isHttps =
        isset($_SERVER['HTTPS']) &&
        $_SERVER['HTTPS'] === 'on';

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => $isHttps ? 'None' : 'Lax'
    ]);
    session_start();
}

$allowed_origins = [
    'http://localhost:5173',
    'https://nico0olas96.github.io'
];

if (
    isset($_SERVER['HTTP_ORIGIN']) &&
    in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)
) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if(isset($_SESSION['id'])){

    echo json_encode([
        "login" => true,
        "usuario" => $_SESSION['usuario'],
        "rol" => $_SESSION['rol']
    ]);

}else{

    echo json_encode([
        "login" => false
    ]);

}

?>