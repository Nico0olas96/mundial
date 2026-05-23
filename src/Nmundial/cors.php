<?php
// ======================
// CONFIG SESIÓN
// ======================
if (session_status() === PHP_SESSION_NONE) {

    $secure = true;

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'None'
    ]);

    session_start();
}

// ======================
// CORS WHITELIST (STRICT)
// ======================
$allowed_origins = [
    'http://localhost:5173',
    'https://nico0olas96.github.io'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? null;

// Si viene desde navegador con Origin
if ($origin) {

    if (in_array($origin, $allowed_origins)) {

        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
        header("Vary: Origin");

    } else {

        // 🚫 BLOQUEO TOTAL
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            "error" => "Acceso bloqueado "
        ]);
        exit();
    }
}

// ======================
// HEADERS PERMITIDOS
// ======================
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// ======================
// PREFLIGHT
// ======================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}