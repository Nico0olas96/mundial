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

$usuario_id = $data["usuario_id"] ?? null;

if (!$usuario_id) {
    echo json_encode([
        "error" => "usuario_id no recibido"
    ]);
    exit;
}

$sql = "SELECT 
            np.id,
            np.goles_local,
            np.goles_visitante,
            np.fecha,
            ne.nombre AS local_team,
            nv.nombre AS visitante_team,
            pr.pred_local,
            pr.pred_visitante,
            ne.grupo AS grupo,

            CASE 
                WHEN pr.pred_local IS NULL THEN NULL

                WHEN pr.pred_local = np.goles_local 
                 AND pr.pred_visitante = np.goles_visitante 
                THEN 3

                WHEN 
                    (pr.pred_local > pr.pred_visitante AND np.goles_local > np.goles_visitante)
                    OR
                    (pr.pred_local < pr.pred_visitante AND np.goles_local < np.goles_visitante)
                    OR
                    (pr.pred_local = pr.pred_visitante AND np.goles_local = np.goles_visitante)
                THEN 1

                ELSE 0
            END AS acierto

        FROM npartidos np
        JOIN nequipos ne ON np.equipo_local_id = ne.id
        JOIN nequipos nv ON np.equipo_visitante_id = nv.id
        LEFT JOIN npronosticos pr 
            ON pr.partido_id = np.id 
            AND pr.usuario_id = ?

        WHERE np.cerrado = 1
        ORDER BY np.fecha DESC";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    die(json_encode(["error" => $conexion->error]));
}

$stmt->bind_param("i", $usuario_id);

$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$conexion->close();

?>