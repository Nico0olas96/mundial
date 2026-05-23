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


$nombre = $data["nombre"];
$usuario = $data["usuario"];
$password = $data["password"];
$rol = $data["rol"];

$user = $data["user"];
$user_rol = $data["user_rol"];

$permitidos = ["Nico0olas", "Monito30", "Beturri", "Braian95"];

if ($user_rol != "admin" || !in_array($user, $permitidos)) {
    echo json_encode(["error" => "Sin permisos"]);
    exit;
}

$password = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO nusuarios SET nombre = ?, usuario = ?, password = ?, rol = ?, created_at = NOW()";


// 🔥 PREPARE
$stmt = $conexion->prepare($sql);

// Verificar errores
if (!$stmt) {
    die(json_encode([
        "error" => $conexion->error
    ]));
}

// 🔥 Bind
$stmt->bind_param("ssss", $nombre, $usuario, $password, $rol);

// 🔥 Execute
$stmt->execute();


echo json_encode(["status" => "ok"]);
$stmt->close();
$conexion->close();
?>