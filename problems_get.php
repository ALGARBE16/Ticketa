<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'conn.php'; // Asegurate que este archivo contenga solo la conexión PDO, sin echo ni print

try {
    $stmt = $conn->query("SELECT * FROM problems ORDER BY created_at DESC");
    $reportes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "reportes" => $reportes
    ]);
    exit;
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al obtener reportes: " . $e->getMessage()
    ]);
    exit;
}
