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

$usuario_id = $data['usuario_id'];
$partido_id = $data['partido_id'];
$pronostico_id = $data['pronostico_id'];
$pred_local = (int)$data['pred_local'];
$pred_visitante = (int)$data['pred_visitante'];

//EJECUTO EL SCRIPT DE CHECK_PARTIDOS
$url = "https://cpem41.edu.ar/backend.php/Nmundial/check_partidos.php";
$datos = [
    "evento" => 'check_editar',
    "usuario" => $usuario_id
];
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($datos));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_exec($ch);


$sql_verificar = "SELECT id FROM npartidos WHERE id = ? AND cerrado = 1";
$stmt = $conexion->prepare($sql_verificar);
$stmt->bind_param("i", $partido_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(403);
    exit("El partido está cerrado, no se puede enviar el pronóstico");
}

$sql = "UPDATE npronosticos SET pred_local = ?, pred_visitante = ?, created_at = NOW() WHERE id = ? AND usuario_id = ?";

// 🔥 PREPARE
$stmt = $conexion->prepare($sql);

// Verificar errores
if (!$stmt) {
    die(json_encode([
        "error" => $conexion->error
    ]));
}

// 🔥 Bind
$stmt->bind_param("iiii", $pred_local, $pred_visitante, $pronostico_id, $usuario_id);

// 🔥 Execute
$stmt->execute();


echo json_encode(["status" => "ok"]);
$stmt->close();
$conexion->close();
?>