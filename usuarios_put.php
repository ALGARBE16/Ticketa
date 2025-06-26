<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'conn.php'; // Asegurate que solo tenga la conexión PDO

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Usá POST."
    ]);
    exit;
}

$id = $_POST['id'] ?? null;
$role = $_POST['role'] ?? null;

if (!$id || !$role) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Faltan parámetros: ID y/o rol."
    ]);
    exit;
}

// Validar rol permitido (solo admin o user)
$role = strtolower($role);
if (!in_array($role, ['admin', 'user'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Rol inválido. Solo se permite 'admin' o 'user'."
    ]);
    exit;
}

try {
    $sql = "UPDATE users SET role = :role WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':role' => $role,
        ':id' => $id
    ]);

    if ($stmt->rowCount() === 0) {
        echo json_encode([
            "success" => false,
            "message" => "No se modificó ningún registro (ID inválido o sin cambios)."
        ]);
    } else {
        echo json_encode([
            "success" => true,
            "message" => "Rol actualizado correctamente."
        ]);
    }
    exit;
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar el rol: " . $e->getMessage()
    ]);
    exit;
}