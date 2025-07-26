<?php
require_once __DIR__ . '/../vendor/autoload.php'; // Thư viện JWT, cần cài firebase/php-jwt qua composer
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtMiddleware {
    private static $secretKey = 'your-secret-key'; // Thay bằng secret key thực tế

    public static function check() {
        $headers = getallheaders();
        error_log('JwtMiddleware check: Authorization header: ' . ($headers['Authorization'] ?? 'null'));
        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Thiếu token xác thực']);
            exit;
        }
        $authHeader = $headers['Authorization'];
        list($type, $token) = explode(' ', $authHeader, 2);
        if (strcasecmp($type, 'Bearer') != 0 || empty($token)) {
            http_response_code(401);
            echo json_encode(['message' => 'Token không hợp lệ']);
            exit;
        }
        try {
            $decoded = JWT::decode($token, new Key(self::$secretKey, 'HS256'));
            // Lưu thông tin user vào biến toàn cục hoặc context
            $_SERVER['user'] = $decoded->user ?? null;
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['message' => 'Token không hợp lệ hoặc hết hạn']);
            exit;
        }
    }

    public static function getUser() {
        return $_SERVER['user'] ?? null;
    }
}
