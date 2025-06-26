<?php
// Permitir CORS y headers necesarios
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Responder rápido a OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

require 'conn.php';

try {
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if (isset($_GET['id'])) {
        // Traer un reporte por ID
        $id = $_GET['id'];
        $stmt = $conn->prepare('SELECT * FROM problems WHERE id = ?');
        $stmt->execute([$id]);
        $reporte = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($reporte) {
            echo json_encode([
                'success' => true,
                'reporte' => $reporte
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Reporte no encontrado.'
            ]);
        }
    } else {
        // Traer todos los reportes
        $stmt = $conn->query('SELECT * FROM problems ORDER BY created_at DESC');
        $reportes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'reportes' => $reportes
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error en la base de datos: ' . $e->getMessage()
    ]);
}
?>
