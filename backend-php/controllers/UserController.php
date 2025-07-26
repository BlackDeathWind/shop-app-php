<?php
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../utils/helpers.php';
class UserController {
    private $userModel;
    public function __construct() {
        $this->userModel = new UserModel();
    }
    // GET /api/users/{id}
    public function get($id, $input, $query) {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu ID người dùng']);
            return;
        }
        $role = isset($query['role']) ? intval($query['role']) : 2;
        $user = $this->userModel->getUserById($id, $role);
        if ($user) {
            unset($user['MatKhau']);
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Người dùng không tồn tại']);
        }
    }
    // PUT /api/users/{id}
    public function put($id, $input, $query) {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu ID người dùng']);
            return;
        }
        $role = isset($query['role']) ? intval($query['role']) : 2;
        $success = $this->userModel->updateUser($id, $role, $input);
        if ($success) {
            echo json_encode(['message' => 'Cập nhật thông tin thành công']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi cập nhật thông tin']);
        }
    }
    // POST /api/users (tạo mới)
    public function post($id, $input, $query) {
        $role = isset($input['MaVaiTro']) ? intval($input['MaVaiTro']) : 2;
        if (!isset($input['MatKhau'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu mật khẩu']);
            return;
        }
        $input['MatKhau'] = password_hash($input['MatKhau'], PASSWORD_BCRYPT);
        $newId = $this->userModel->createUser($input, $role);
        if ($newId) {
            echo json_encode(['message' => 'Tạo người dùng thành công', 'id' => $newId]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi tạo người dùng']);
        }
    }
    // Đổi mật khẩu: PUT /api/users/{id}/change-password
    public function change_password($id, $input, $query) {
        if (!$id || !isset($input['MatKhauCu']) || !isset($input['MatKhauMoi'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu thông tin đổi mật khẩu']);
            return;
        }
        $role = isset($query['role']) ? intval($query['role']) : 2;
        $user = $this->userModel->getUserById($id, $role);
        if (!$user || !password_verify($input['MatKhauCu'], $user['MatKhau'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Mật khẩu hiện tại không chính xác']);
            return;
        }
        $hashed = password_hash($input['MatKhauMoi'], PASSWORD_BCRYPT);
        $success = $this->userModel->updatePassword($id, $role, $hashed);
        if ($success) {
            echo json_encode(['message' => 'Đổi mật khẩu thành công']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi đổi mật khẩu']);
        }
    }

    // GET /api/admin/users/customers
    public function getAllCustomers($id, $input, $query) {
        $page = isset($query['page']) ? intval($query['page']) : 1;
        $limit = isset($query['limit']) ? intval($query['limit']) : 10;
        $result = $this->userModel->getAllCustomers($page, $limit);
        if ($result) {
            foreach ($result['users'] as &$user) {
                unset($user['MatKhau']);
            }
            echo json_encode($result);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi lấy danh sách khách hàng']);
        }
    }

    // GET /api/admin/users/staff
    public function getAllStaff($id, $input, $query) {
        $page = isset($query['page']) ? intval($query['page']) : 1;
        $limit = isset($query['limit']) ? intval($query['limit']) : 10;
        $result = $this->userModel->getAllStaff($page, $limit);
        if ($result) {
            foreach ($result['users'] as &$user) {
                unset($user['MatKhau']);
            }
            echo json_encode($result);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi lấy danh sách nhân viên']);
        }
    }
}
