<?php
// index.php - Entrypoint cho REST API PHP
require_once __DIR__ . '/config/database.php';

// Autoload controllers/models/utils nếu cần
spl_autoload_register(function ($class) {
    foreach ([
        __DIR__ . '/controllers/' . $class . '.php',
        __DIR__ . '/models/' . $class . '.php',
        __DIR__ . '/middlewares/' . $class . '.php',
        __DIR__ . '/utils/' . $class . '.php',
    ] as $file) {
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// Xử lý CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Parse URL
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = trim($uri, '/');
$segments = explode('/', $uri);

// Route: /api/{resource}/{id?}
if (count($segments) >= 2 && $segments[0] === 'api') {
    $resource = $segments[1];
    $id = $segments[2] ?? null;
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $query = $_GET;

    // Map resource to controller
    $controllerMap = [
        'auth' => 'AuthController',
        'products' => 'ProductController',
        'categories' => 'CategoryController',
        'orders' => 'OrderController',
        'users' => 'UserController',
        'admin' => 'AdminController',
        'order-details' => 'OrderDetailController',
        'upload' => 'UploadController',
    ];
    if (isset($controllerMap[$resource])) {
        $controllerName = $controllerMap[$resource];
        if (!class_exists($controllerName)) {
            http_response_code(404);
            echo json_encode(['message' => 'API không tồn tại']);
            exit;
        }
        $controller = new $controllerName();
        // Gọi action phù hợp
        $action = strtolower($method);
        if (method_exists($controller, $action)) {
            $controller->$action($id, $input, $query);
        } else {
            http_response_code(405);
            echo json_encode(['message' => 'Phương thức không được hỗ trợ']);
        }
        exit;
    }
}
// Nếu không khớp route
http_response_code(404);
echo json_encode(['message' => 'Không tìm thấy API endpoint']);
