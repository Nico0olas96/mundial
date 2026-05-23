<?php
include '../conexion/bd.php';

$allowed_origins = [
    'http://localhost:5173',
    'https://nico0olas96.github.io'
];

if (
    !isset($_SERVER['HTTP_ORIGIN']) ||
    in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)
) {

    if (isset($_SERVER['HTTP_ORIGIN'])) {

        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    }

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
if (!$data) {

    http_response_code(403);

    exit("acceso denegado");

}
$evento = $data["evento"];
$usuario = $data["usuario"];

$sql = "UPDATE npartidos 
        SET cerrado = 1 
        WHERE cerrado = 0
        AND NOW() >= DATE_SUB(fecha, INTERVAL 30 MINUTE)";

if (!$conexion->query($sql)) {
    die("Error SQL: " . $conexion->error);
}

$stmt = $conexion->prepare("INSERT INTO nlog (nombre, fecha, evento) VALUES (?, NOW(), ?)");

$stmt->bind_param("ss", $usuario, $evento);

if (!$stmt->execute()) {
    die("Error SQL: " . $stmt->error);
}
?>