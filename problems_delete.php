<?php
header("Content-Type: application/json");

// Verificamos que el método sea DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Obtenemos los datos del cuerpo del DELETE
    parse_str(file_get_contents("php://input"), $deleteData);

    // Validar que venga el ID
    if (!isset($deleteData['id'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Falta el campo 'id'."]);
        exit;
    }

    $id = $deleteData['id'];

    require 'conn.php'; // Asegúrate de que este archivo existe y contiene la conexión a la base de datos

    try {
        // Conexión a la base de datos
        $conn = new PDO('mysql:host=localhost;dbname=soporte_tecnico', 'root', '');
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Verificar si el registro existe
        $checkStmt = $conn->prepare("SELECT COUNT(*) FROM problems WHERE id = :id");
        $checkStmt->bindParam(':id', $id, PDO::PARAM_INT);
        $checkStmt->execute();
        if ($checkStmt->fetchColumn() == 0) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "No se encontró el problema con ID $id."]);
            exit;
        }
        ##alsdasdasd

        // Eliminar el registro
        $stmt = $conn->prepare("DELETE FROM problems WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        echo json_encode(["success" => true, "message" => "Problema eliminado correctamente."]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error de base de datos: " . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405); // Método no permitido
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Usa DELETE."
    ]);
}
?>
