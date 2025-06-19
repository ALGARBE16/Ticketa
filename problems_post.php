<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Manejo de preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "message" => "Método no permitido. Usa POST."
        ]);
        exit;
    }

    require 'conn.php';

    $requiredFields = ['title', 'description','priority', 'status', 'created_at', 'resolved_at'];
    foreach ($requiredFields as $field) {
        if (!isset($_POST[$field])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Falta el campo '$field'."]);
            exit;
        }
    }

    $stmt = $conn->prepare("INSERT INTO problems (title, description, status, created_at, resolved_at, priority)
                            VALUES (:title, :description, :status, :created_at, :resolved_at, :priority)");

    $stmt->execute([
        ':title' => $_POST['title'],
        ':description' => $_POST['description'],
        ':status' => $_POST['status'],
        ':created_at' => $_POST['created_at'],
        ':resolved_at' => $_POST['resolved_at'],
        ':priority' => $_POST['priority']
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Reporte creado exitosamente",
        "id" => $conn->lastInsertId()
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error del servidor: " . $e->getMessage()
    ]);
}
foreach ($requiredFields as $field) {
    if (!isset($_POST[$field])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Falta el campo '$field'.",
            "post_data" => $_POST
        ]);
        exit;
    }
}
