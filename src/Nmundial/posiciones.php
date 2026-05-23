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


$sql = "SELECT 
            u.id,
            u.nombre,
            COALESCE(SUM(
                CASE 
                    -- 🥇 EXACTO: 3 puntos
                    WHEN p.pred_local = m.goles_local 
                    AND p.pred_visitante = m.goles_visitante 
                    THEN 3

                    -- 🥈 RESULTADO GENERAL: 1 punto
                    WHEN 
                        (p.pred_local > p.pred_visitante AND m.goles_local > m.goles_visitante)
                        OR
                        (p.pred_local < p.pred_visitante AND m.goles_local < m.goles_visitante)
                        OR
                        (p.pred_local = p.pred_visitante AND m.goles_local = m.goles_visitante)
                    THEN 1

                    ELSE 0
                END
            ), 0) AS puntos

        FROM nusuarios u

        LEFT JOIN npronosticos p 
            ON u.id = p.usuario_id

        LEFT JOIN npartidos m 
            ON p.partido_id = m.id 
            AND m.cerrado = 1

        GROUP BY u.id, u.nombre
        ORDER BY puntos DESC;
";

$result = $conexion->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$conexion->close();

?>