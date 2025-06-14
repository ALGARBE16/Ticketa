<?php
$conn = new PDO('mysql:host=localhost;dbname=soporte_tecnico', 'root', '');
if (!$conn) {
    die("Error de conexión: " . $conn->errorInfo());
} else {
    echo "Conexión exitosa a la base de datos.";
}
?>
