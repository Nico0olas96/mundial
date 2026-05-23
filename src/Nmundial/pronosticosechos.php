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
            pr.id,
            pr.partido_id,
            pr.pred_local,
            pr.pred_visitante,
            
            p.fecha,
            p.cerrado,

            local.nombre AS local_team,
            visitante.nombre AS visitante_team,

            local.grupo AS grupo
        
        FROM npronosticos pr

        JOIN npartidos p 
            ON pr.partido_id = p.id

        JOIN nequipos local 
            ON p.equipo_local_id = local.id

        JOIN nequipos visitante 
            ON p.equipo_visitante_id = visitante.id

        WHERE pr.usuario_id = ? 
        ORDER BY p.fecha DESC";
        
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