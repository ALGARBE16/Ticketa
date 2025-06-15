<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "message" => "Método no permitido. Usa POST."
        ]);
        exit;
    }

    require 'conn.php'; // Asegúrate que este archivo exista y funcione

    $requiredFields = ['title', 'description', 'status', 'created_at', 'resolved_at', 'priority'];
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
        "message" => "Reporte enviado correctamente.",
        "id" => $conn->lastInsertId()
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error del servidor: " . $e->getMessage()
    ]);
}