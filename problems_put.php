<?php
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Obtener datos del cuerpo del PUT
    parse_str(file_get_contents("php://input"), $putData);

    // Validar que venga el ID
    if (!isset($putData['id'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Falta el campo 'id'."]);
        exit;
    }

    // Extraer datos
    $id = $putData['id'];
    $title = $putData['title'] ?? null;
    $description = $putData['description'] ?? null;
    $status = $putData['status'] ?? null;
    $created_at = $putData['created_at'] ?? null;
    $resolved_at = $putData['resolved_at'] ?? null;
    $priority = $putData['priority'] ?? null;

    require 'conn.php'; // Asegúrate de que este archivo existe y contiene la conexión a la base de datos   

    try {
        // Conexión a la base de datos
        $conn = new PDO('mysql:host=localhost;dbname=soporte_tecnico', 'root', '');
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Actualizar en la tabla 'problems'
        $sql = "UPDATE problems SET 
                    title = :title,
                    description = :description,
                    status = :status,
                    created_at = :created_at,
                    resolved_at = :resolved_at,
                    priority = :priority
                WHERE id = :id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':created_at', $created_at);
        $stmt->bindParam(':resolved_at', $resolved_at);
        $stmt->bindParam(':priority', $priority);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        $stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "Problema actualizado correctamente."
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error de base de datos: " . $e->getMessage()
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
