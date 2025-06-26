<?php
require 'conn.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Usa DELETE."
    ]);
    exit;
}

// Leer ID desde query string o desde JSON body
$id = null;

// Primero intentamos obtener el id desde la query string
if (isset($_GET['id'])) {
    $id = (int) $_GET['id'];
} else {
    // Si no está en query, intentamos desde JSON body
    $input = json_decode(file_get_contents("php://input"), true);
    if (isset($input['id'])) {
        $id = (int) $input['id'];
    }
}

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
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Reporte eliminado correctamente."
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "No se encontró el reporte con ese ID."
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al eliminar: " . $e->getMessage()
    ]);
}
?>
