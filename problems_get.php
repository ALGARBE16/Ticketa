<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


require 'conn.php'; // Asegurate que este archivo cree $conn

try {
    $stmt = $conn->prepare("SELECT * FROM problems ORDER BY created_at DESC");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "reportes" => $result
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error en la base de datos: " . $e->getMessage()
    ]);
}
?>