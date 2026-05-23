<?php

if (session_status() === PHP_SESSION_NONE) {
    $isHttps =
        isset($_SERVER['HTTPS']) &&
        $_SERVER['HTTPS'] === 'on';

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => $isHttps ? 'None' : 'Lax'
    ]);
    session_start();
}

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
}

header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../conexion/bd.php';


if(!isset($_POST['usuario']) || !isset($_POST['password'])){
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos"
    ]);
    exit;
}

$usuario = $_POST['usuario'];
$password = $_POST['password'];

$force_password_change = false;


$stmt = $conexion->prepare("SELECT * FROM nusuarios WHERE usuario = ?");
$stmt->bind_param("s", $usuario);
$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows > 0){

    $user = $result->fetch_assoc();

    if(password_verify($password, $user['password'])){

        session_regenerate_id(true);

        $_SESSION['id'] = $user['id'];
        $_SESSION['usuario'] = $user['usuario'];
        $_SESSION['rol'] = $user['rol'];
 
        if ($password === 'aa123') {
            $force_password_change = true;
        }

        echo json_encode([
            "success" => true,
            "usuario" => $user['usuario'],
            "rol" => $user['rol'],
            "nombre" => $user['nombre'],
            "id" => $user['id'],
            "force_password_change" => $force_password_change
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Contraseña incorrecta"
        ]);
    }

}else{

    echo json_encode([
        "success" => false,
        "message" => "Usuario no encontrado"
    ]);
}

$conexion->close();

?>