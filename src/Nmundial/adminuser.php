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

$user = $data["usuario_id"]["usuario"];
$user_rol = $data["usuario_id"]["rol"];

$permitidos = ["Nico0olas", "Monito30", "Beturri", "Braian95"];

if ($user_rol != "admin" || !in_array($user, $permitidos)) {
    echo json_encode(["error" => "Sin permisos"]);
    exit;
}


$sql = "SELECT id, nombre, usuario, rol FROM nusuarios";

$resultado = $conexion->query($sql);

if (!$resultado) {
    die("Error SQL: " . $conexion->error);
}

echo json_encode($resultado->fetch_all(MYSQLI_ASSOC));
$resultado->close();
$conexion->close();
?>