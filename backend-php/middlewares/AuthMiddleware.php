<?php
class AuthMiddleware {
    public static function check() {
        session_start();
        if (!isset($_SESSION['user'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Bạn chưa đăng nhập']);
            exit;
        }
    }
    public static function getUser() {
        session_start();
        return $_SESSION['user'] ?? null;
    }
} 