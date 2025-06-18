<?php
require 'vendor/autoload.php';
use Firebase\JWT\JWT;

require 'conn.php';

// HEADERS CORS - IMPORTANTE QUE ESTÉN ANTES DE CUALQUIER SALIDA
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

$secretKey = 'TU_SECRETO_AQUI'; // Cambiala por una clave segura

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email'], $data['password'])) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Faltan datos.']);
  exit;
}

$email = $data['email'];
$password = $data['password'];

try {
  $stmt = $conn->prepare('SELECT * FROM users WHERE email = ?');
  $stmt->execute([$email]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Email o contraseña incorrectos.']);
    exit;
  }

  $payload = [
    'iss' => 'ticketa_local',
    'iat' => time(),
    'exp' => time() + 3600, // 1 hora de validez
    'sub' => $user['id'],
    'email' => $user['email']
  ];

  $jwt = JWT::encode($payload, $secretKey, 'HS256');

  echo json_encode(['success' => true, 'token' => $jwt]);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
