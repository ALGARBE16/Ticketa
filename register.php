<?php
require 'vendor/autoload.php'; // para Composer
require 'conn.php'; // tu conexión a la base de datos

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email'], $data['password'])) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Faltan datos.']);
  exit;
}

$email = $data['email'];
$password = $data['password'];

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

try {
  $stmt = $conn->prepare('INSERT INTO users (email, password) VALUES (?, ?)');
  $stmt->execute([$email, $passwordHash]);

  echo json_encode(['success' => true, 'message' => 'Usuario registrado correctamente.']);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
