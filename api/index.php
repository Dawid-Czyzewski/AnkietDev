<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/controllers/RegisterController.php';
require_once __DIR__ . '/controllers/LoginController.php';
require_once __DIR__ . '/controllers/LogoutController.php';
require_once __DIR__ . '/controllers/SurveyController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/database/config.php';

$controllerParam = $_GET['controller'] ?? 'register';
$actionParam = $_GET['action'] ?? 'index';

$controllerName = ucfirst($controllerParam) . 'Controller';
$action = $actionParam;

if (class_exists($controllerName)) {
    $controller = new $controllerName($link);

    if (method_exists($controller, $action)) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $jsonData = json_decode(file_get_contents('php://input'), true);
            $controller->$action($jsonData);
        } else {
            $controller->$action();
        }
    } else {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['error' => "Unknown action: $action"]);
    }
} else {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => "Unknown controller: $controllerName"]);
}
