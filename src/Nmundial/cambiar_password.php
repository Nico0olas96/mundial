<?php
include '../conexion/bd.php';


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
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

} else {

    http_response_code(403);
    exit("acceso denegado");

}

// PREFLIGHT
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

    http_response_code(204);
    exit;

}

$data = json_decode(file_get_contents("php://input"), true);

$password = $data["nueva_password"];
$usuario_id = $data["usuario_id"];

// HASH PASSWORD
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// UPDATE
$sql = "UPDATE nusuarios SET password = ? WHERE id = ?";

// PREPARE
$stmt = $conexion->prepare($sql);

if (!$stmt) {

    die(json_encode([
        "success" => false,
        "error" => $conexion->error
    ]));

}

// BIND
$stmt->bind_param("si", $passwordHash, $usuario_id);

// EXECUTE
if ($stmt->execute()) {

    echo json_encode([
        "success" => true
    ]);

} else {

    echo json_encode([
        "success" => false,
        "error" => $stmt->error
    ]);

}

$stmt->close();
$conexion->close();
?>