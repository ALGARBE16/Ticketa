<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respuesta preflight para CORS
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents("php://input"), $putData);

    $id = $putData['id'] ?? null;
    $title = $putData['title'] ?? null;
    $description = $putData['description'] ?? null;
    $status = $putData['status'] ?? null;
    $created_at = $putData['created_at'] ?? null;
    $resolved_at = $putData['resolved_at'] ?? null;
    $priority = $putData['priority'] ?? null;

    if (!$id || !$title || !$description || !$status || !$created_at || !$priority) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Faltan campos obligatorios."
        ]);
        exit;
    }

    try {
        $stmt = $conn->prepare("UPDATE problems 
            SET title = :title,
                description = :description,
                status = :status,
                created_at = :created_at,
                resolved_at = :resolved_at,
                priority = :priority
            WHERE id = :id");

        $stmt->execute([
            ':id' => $id,
            ':title' => $title,
            ':description' => $description,
            ':status' => $status,
            ':created_at' => $created_at,
            ':resolved_at' => $resolved_at,
            ':priority' => $priority
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Reporte actualizado correctamente."
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al actualizar: " . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Usa PUT."
    ]);
}
?>