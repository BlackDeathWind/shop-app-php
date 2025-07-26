<?php
require_once __DIR__ . '/JwtMiddleware.php';

class RoleMiddleware {
    public static function check($roles = []) {
        JwtMiddleware::check();
        $user = JwtMiddleware::getUser();
        if (!$user || !in_array($user->MaVaiTro, $roles)) {
            http_response_code(403);
            echo json_encode(['message' => 'Bạn không có quyền truy cập chức năng này']);
            exit;
        }
    }
}
