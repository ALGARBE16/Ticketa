<?php
require 'vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// HEADERS CORS - ANTES DE CUALQUIER SALIDA
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

// Obtener headers
$headers = apache_request_headers();

if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Token no proporcionado"]);
    exit;
}

$authHeader = $headers['Authorization'];

// Extraer token con expresión regular
if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $jwt = $matches[1];
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Formato de token incorrecto"]);
    exit;
}

try {
    $secretKey = 'TU_SECRETO_AQUI'; // Mismo secreto que en login.php

    $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));

    echo json_encode([
        "success" => true,
        "message" => "Acceso concedido",
        "user" => $decoded->email,
        "role" => $decoded->role // ✅ devolvemos el rol también
    ]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Token inválido: " . $e->getMessage()]);
    exit;
}
