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

$partido_id = $data["partido_id"];
$goles_local = $data["goles_local"];
$goles_visitante = $data["goles_visitante"];

$usuario = $data["usuario"];
$fecha = $data["fecha"];
$fecha = date("Y-m-d H:i:s");

$user_rol = $data["user_rol"];


$permitidos = ["Nico0olas", "Monito30", "Beturri", "Braian95"];

if ($user_rol != "admin" || !in_array($usuario, $permitidos)) {
    echo json_encode(["error" => "No tienes permiso para editar"]);
    exit;
}

/* 🔥 ACTUALIZAR PARTIDO */
$sql = "UPDATE npartidos 
        SET goles_local = ?, 
            goles_visitante = ?, 
            cerrado = 1,
            actualizo = ?,
            fecha_actualizacion = ?
        WHERE id = ?";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    die(json_encode([
        "error" => $conexion->error
    ]));
}

$stmt->bind_param("iissi", $goles_local, $goles_visitante, $usuario, $fecha, $partido_id);

$stmt->execute();

echo json_encode([
    "status" => "ok",
    "message" => "Resultado guardado correctamente"
]);

$stmt->close();
$conexion->close();
?>