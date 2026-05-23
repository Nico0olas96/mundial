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

$sql = "SELECT 
            p.id,
            locall.nombre AS local_team,
            visitante.nombre AS visitante_team,
            p.fecha,
            p.goles_local,
            p.goles_visitante,
            p.cerrado,
            locall.grupo AS grupo_local,
            visitante.grupo AS grupo_visitante
        FROM npartidos p
        JOIN nequipos locall 
            ON p.equipo_local_id = locall.id 
            
        JOIN nequipos visitante 
            ON p.equipo_visitante_id = visitante.id
        LEFT JOIN npronosticos pr 
            ON p.id = pr.partido_id 
            AND pr.usuario_id = ?
        WHERE pr.id IS NULL
        ORDER BY p.cerrado ASC, p.fecha ASC";

// 🔥 PREPARE
$stmt = $conexion->prepare($sql);

// Verificar errores
if (!$stmt) {
    die(json_encode([
        "error" => $conexion->error
    ]));
}

// 🔥 Bind
$stmt->bind_param("i", $usuario_id);

// 🔥 Execute
$stmt->execute();

$result = $stmt->get_result();

$partidos = [];

while ($row = $result->fetch_assoc()) {
    $partidos[] = $row;
}

echo json_encode($partidos);

$stmt->close();
$conexion->close();

?>