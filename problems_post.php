<?php
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validar datos recibidos
    $requiredFields = ['title', 'description', 'status', 'created_at', 'resolved_at', 'priority'];
    foreach ($requiredFields as $field) {
        if (!isset($_POST[$field])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Falta el campo '$field'."]);
            exit;
        }
    }

    $title = $_POST['title'];
    $description = $_POST['description'];
    $status = $_POST['status'];
    $created_at = $_POST['created_at'];
    $resolved_at = $_POST['resolved_at'];
    $priority = $_POST['priority'];

    require 'conn.php';

    try {
        $stmt = $conn->prepare("INSERT INTO problems (title, description, status, created_at, resolved_at, priority)
                                VALUES (:title, :description, :status, :created_at, :resolved_at, :priority)");
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':created_at', $created_at);
        $stmt->bindParam(':resolved_at', $resolved_at);
        $stmt->bindParam(':priority', $priority);
        $stmt->execute();

        echo json_encode(["success" => true, "message" => "Problema insertado correctamente.", "id" => $conn->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error en la base de datos: " . $e->getMessage()]);
    }
} else {
    http_response_code(405); // Método no permitido
    echo json_encode(["success" => false, "message" => "Método no permitido. Usa POST."]);
}
?>
