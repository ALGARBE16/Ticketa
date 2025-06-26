<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Usa POST para actualizar."
    ]);
    exit;
}

require 'conn.php';

$id = $_POST['id'] ?? null;
if (!$id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Falta el ID del reporte a modificar."
    ]);
    exit;
}

// Capturar campos
$title = $_POST['title'] ?? null;
$description = $_POST['description'] ?? null;
$status = $_POST['status'] ?? 'pendiente';
$created_at = $_POST['created_at'] ?? null;
$resolved_at = $_POST['resolved_at'] ?? null;
$priority = $_POST['priority'] ?? 'MEDIA';
$area = $_POST['area'] ?? null;
$user_name = $_POST['user_name'] ?? null;

$image_path = null;
if (!empty($_FILES['imagen']['name'])) {
    $uploadDir = 'uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $imageName = uniqid() . '_' . basename($_FILES['imagen']['name']);
    $targetPath = $uploadDir . $imageName;

    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $targetPath)) {
        $image_path = $targetPath;
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al subir la imagen."
        ]);
        exit;
    }
}

// Evitar "0000-00-00 00:00:00"
if ($resolved_at === '0000-00-00 00:00:00') {
    $resolved_at = null;
}

// Construir SET dinámicamente
$campos = [
    'title' => $title,
    'description' => $description,
    'status' => $status,
    'created_at' => $created_at,
    'resolved_at' => $resolved_at,
    'priority' => $priority,
    'area' => $area,
    'user_name' => $user_name
];

if ($image_path) {
    $campos['image_path'] = $image_path;
}

$sets = [];
$parametros = [':id' => $id];

foreach ($campos as $campo => $valor) {
    if (!is_null($valor)) {
        $sets[] = "$campo = :$campo";
        $parametros[":$campo"] = $valor;
    }
}

if (empty($sets)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "No se proporcionaron campos para actualizar."
    ]);
    exit;
}

$sql = "UPDATE problems SET " . implode(', ', $sets) . " WHERE id = :id";

try {
    $stmt = $conn->prepare($sql);
    $stmt->execute($parametros);

    if ($stmt->rowCount() === 0) {
        echo json_encode([
            "success" => false,
            "message" => "No se modificó ningún registro (ID inválido o sin cambios)."
        ]);
        exit;
    }

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
