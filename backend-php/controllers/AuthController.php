<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../utils/helpers.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController {
    private $userModel;
    private static $secretKey = 'your-secret-key'; // Thay bằng secret key thực tế
    private static $tokenExpire = 3600; // 1 giờ

    public function __construct() {
        $this->userModel = new UserModel();
    }
    // POST /api/auth/login
    public function post($id, $input, $query) {
        if (!isset($input['SoDienThoai']) || !isset($input['MatKhau'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu thông tin đăng nhập']);
            return;
        }
        $user = $this->userModel->getUserByPhone($input['SoDienThoai']);
        if ($user && password_verify($input['MatKhau'], $user['MatKhau'])) {
            unset($user['MatKhau']);
            // Tạo payload cho JWT
            $payload = [
                'iat' => time(),
                'exp' => time() + self::$tokenExpire,
                'user' => $user
            ];
            $jwt = JWT::encode($payload, self::$secretKey, 'HS256');
            echo json_encode(['message' => 'Đăng nhập thành công', 'user' => $user, 'accessToken' => $jwt]);
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Số điện thoại hoặc mật khẩu không đúng']);
        }
    }
    // POST /api/auth/register
    public function register($id, $input, $query) {
        if (!isset($input['SoDienThoai']) || !isset($input['MatKhau']) || !isset($input['TenKhachHang'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu thông tin đăng ký']);
            return;
        }
        $input['MatKhau'] = password_hash($input['MatKhau'], PASSWORD_BCRYPT);
        $input['MaVaiTro'] = 2;
        $newId = $this->userModel->createUser($input, 2);
        if ($newId) {
            echo json_encode(['message' => 'Đăng ký thành công', 'id' => $newId]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi đăng ký']);
        }
    }
    // POST /api/auth/logout
    public function logout($id, $input, $query) {
        // Nếu dùng session: session_destroy();
        echo json_encode(['message' => 'Đăng xuất thành công']);
    }
}
