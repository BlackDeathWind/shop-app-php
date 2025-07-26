<?php
require_once __DIR__ . '/config/database.php';

// Autoload controllers/models/middlewares/utils
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
// Thay đổi để hỗ trợ gửi cookie session qua CORS
$allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']; // frontend URLs
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Parse URL
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = trim($uri, '/');

// Xử lý loại bỏ base path nếu backend-php không phải thư mục gốc của server
// Ví dụ: nếu URL là http://localhost/shop-app/backend-php/api/categories
// thì $uri sẽ là "shop-app/backend-php/api/categories", cần loại bỏ "shop-app/backend-php"
$basePath = 'shop-app/backend-php';
if (strpos($uri, $basePath) === 0) {
    $uri = substr($uri, strlen($basePath));
    $uri = trim($uri, '/');
}

// Xử lý loại bỏ tiền tố "index.php" trong URI nếu có
if (strpos($uri, 'index.php') === 0) {
    $uri = substr($uri, strlen('index.php'));
    $uri = trim($uri, '/');
}

$method = $_SERVER['REQUEST_METHOD'];

// Load routes
$routes = require __DIR__ . '/routes/web.php';

// Tìm route phù hợp
$found = false;
foreach ($routes as $route) {
    $routePath = trim($route['path'], '/');
    $pattern = preg_replace('/\{[^\/]+\}/', '([^/]+)', $routePath);
    $pattern = str_replace('/', '\/', $pattern);
    if (strtoupper($route['method']) === $method && preg_match('/^' . $pattern . '$/', $uri, $matches)) {
        $found = true;
        $controllerName = $route['controller'];
        $action = $route['action'];
        $id = isset($matches[1]) ? $matches[1] : null;
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $query = $_GET;
        // Middleware
        if (isset($route['middleware'])) {
            if ($route['middleware'] === 'AuthMiddleware') {
                AuthMiddleware::check();
            } elseif ($route['middleware'] === 'RoleMiddleware') {
                $roles = $route['roles'] ?? [];
                RoleMiddleware::check($roles);
            }
        }
        // Gọi controller
        if (!class_exists($controllerName)) {
            http_response_code(404);
            echo json_encode(['message' => 'API không tồn tại']);
            exit;
        }
        $controller = new $controllerName();
        if (!method_exists($controller, $action)) {
            http_response_code(405);
            echo json_encode(['message' => 'Phương thức không được hỗ trợ']);
            exit;
        }
        $controller->$action($id, $input, $query);
        exit;
    }
}
if (!$found) {
    http_response_code(404);
    echo json_encode(['message' => 'Không tìm thấy API endpoint']);
}
