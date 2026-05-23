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

$id = $data["id"];

$user = $data["user"];
$user_rol = $data["user_rol"];

$permitidos = ["Nico0olas", "Monito30", "Beturri", "Braian95"];

if ($user_rol != "admin" || !in_array($user, $permitidos)) {
    echo json_encode(["error" => "No tienes permiso para editar usuarios"]);
    exit;
}

/* RESET PASSWORD */
if (isset($data["reset_password"]) && $data["reset_password"] == true) {

    $password = password_hash($data["password"], PASSWORD_DEFAULT);

    $sql = "UPDATE nusuarios SET password = ? WHERE id = ?";

    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        die(json_encode([
            "error" => $conexion->error
        ]));
    }

    $stmt->bind_param("si", $password, $id);

    $stmt->execute();

    echo json_encode([
        "status" => "ok",
        "message" => "Contraseña reseteada"
    ]);

    $stmt->close();
    $conexion->close();
    exit;
}

/* EDITAR USUARIO */

$nombre = $data["nombre"];
$usuario = $data["usuario"];

$sql = "UPDATE nusuarios 
        SET usuario = ?, nombre = ?
        WHERE id = ?";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    die(json_encode([
        "error" => $conexion->error
    ]));
}

$stmt->bind_param("ssi", $usuario, $nombre, $id);

$stmt->execute();

echo json_encode([
    "status" => "ok"
]);

$stmt->close();
$conexion->close();
?>