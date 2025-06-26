<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'conn.php'; // Asegurate de que solo tenga la conexión PDO

try {
    $stmt = $conn->query("SELECT id, email, role, created_at FROM users ORDER BY created_at DESC");
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "usuarios" => $usuarios
    ]);
    exit;
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al obtener usuarios: " . $e->getMessage()
    ]);
    exit;
}
?>