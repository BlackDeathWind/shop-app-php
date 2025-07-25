<?php
class RoleMiddleware {
    public static function check($roles = []) {
        session_start();
        $user = $_SESSION['user'] ?? null;
        if (!$user || !in_array($user['MaVaiTro'], $roles)) {
            http_response_code(403);
            echo json_encode(['message' => 'Bạn không có quyền truy cập chức năng này']);
            exit;
        }
    }
} 