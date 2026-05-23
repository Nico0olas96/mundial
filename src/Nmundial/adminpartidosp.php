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

/* 🔥 SOLO PARTIDOS CERRADOS */
$sql = "SELECT 
            np.id,
            np.goles_local,
            np.goles_visitante,
            np.fecha,
            ne.nombre AS local_team,
            nv.nombre AS visitante_team

        FROM npartidos np
        JOIN nequipos ne ON np.equipo_local_id = ne.id
        JOIN nequipos nv ON np.equipo_visitante_id = nv.id

        WHERE np.cerrado = 1
        AND (np.goles_local IS NULL OR np.goles_visitante IS NULL)

        ORDER BY np.fecha DESC";

$result = $conexion->query($sql);

if (!$result) {
    die(json_encode(["error" => $conexion->error]));
}

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$conexion->close();
?>