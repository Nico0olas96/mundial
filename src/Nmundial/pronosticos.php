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

$usuario_id = $data["usuario_id"];
$partido_id = $data["partido_id"];
$pred_local = $data["pred_local"];
$pred_visitante = $data["pred_visitante"];

$pred_local = (int)$data["pred_local"];
$pred_visitante = (int)$data["pred_visitante"];

$sql_verificar = "SELECT id FROM npartidos WHERE id = ? AND cerrado = 1";
$stmt = $conexion->prepare($sql_verificar);
$stmt->bind_param("i", $partido_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(403);
    exit("El partido está cerrado, no se puede enviar el pronóstico");
}

$sql = "INSERT INTO npronosticos 
        (usuario_id, partido_id, pred_local, pred_visitante, created_at)
        VALUES (?, ?, ?, ?, NOW())";

// 🔥 PREPARE
$stmt = $conexion->prepare($sql);

// Verificar errores
if (!$stmt) {
    die(json_encode([
        "error" => $conexion->error
    ]));
}

// 🔥 Bind
$stmt->bind_param("iiii", $usuario_id, $partido_id, $pred_local, $pred_visitante);

// 🔥 Execute
$stmt->execute();


echo json_encode(["status" => "ok"]);
$stmt->close();
$conexion->close();
?>