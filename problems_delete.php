<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'conn.php'; // tu conexión PDO

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Leer parámetros desde query string
    parse_str(file_get_contents("php://input"), $deleteData);
    $id = $deleteData['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Falta el ID del reporte a eliminar."
        ]);
        exit;
    }

    try {
        $stmt = $conn->prepare("DELETE FROM problems WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "Reporte eliminado correctamente."
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al eliminar: " . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Usa DELETE."
    ]);
}
