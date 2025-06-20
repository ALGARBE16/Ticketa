<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Usa POST."
    ]);
    exit;
}

require 'conn.php'; // tu conexión PDO

$requiredFields = ['title', 'description', 'priority', 'created_at'];

foreach ($requiredFields as $field) {
    if (!isset($_POST[$field]) || empty($_POST[$field])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Falta el campo '$field'."
        ]);
        exit;
    }
}

// Capturar campos
$title = $_POST['title'];
$description = $_POST['description'];
$priority = $_POST['priority'];
$created_at = $_POST['created_at'];
$resolved_at = $_POST['resolved_at'] ?? null;
$area = $_POST['area'] ?? null;
$user_name = $_POST['user_name'] ?? null;
$status = 'pendiente'; // estado inicial

// Manejo de imagen
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

// Insertar en la base de datos
try {
    $stmt = $conn->prepare("INSERT INTO problems 
        (title, description, status, created_at, resolved_at, priority, image_path, area, user_name)
        VALUES 
        (:title, :description, :status, :created_at, :resolved_at, :priority, :image_path, :area, :user_name)");

    $stmt->execute([
        ':title' => $title,
        ':description' => $description,
        ':status' => $status,
        ':created_at' => $created_at,
        ':resolved_at' => $resolved_at,
        ':priority' => $priority,
        ':image_path' => $image_path,
        ':area' => $area,
        ':user_name' => $user_name
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Reporte creado correctamente.",
        "id" => $conn->lastInsertId()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error en la base de datos: " . $e->getMessage()
    ]);
}