<?php

include '../conexion/bd.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Buscar usuarios
$query = "SELECT id, usuario, password FROM nusuarios";

$result = $conexion->query($query);

if($result->num_rows > 0){

    while($row = $result->fetch_assoc()){

        $id = $row['id'];
        $usuario = $row['usuario'];
        $passwordActual = $row['password'];

        // Si ya está hasheada no hacer nada
        if(password_get_info($passwordActual)['algo'] !== null){

            echo "✅ Usuario {$usuario} ya tiene password hasheado<br>";

            continue;

        }

        // Generar hash
        $nuevoHash = password_hash($passwordActual, PASSWORD_DEFAULT);

        // Actualizar
        $stmt = $conexion->prepare("UPDATE nusuarios SET password = ? WHERE id = ?");

        $stmt->bind_param("si", $nuevoHash, $id);

        if($stmt->execute()){

            echo "🔒 Password actualizado para {$usuario}<br>";

        }else{

            echo "❌ Error actualizando {$usuario}<br>";

        }

        $stmt->close();

    }

}else{

    echo "No hay usuarios.";

}

$conexion->close();

?>