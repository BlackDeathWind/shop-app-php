    <?php
require_once __DIR__ . '/../models/OrderModel.php';
require_once __DIR__ . '/../utils/helpers.php';
class OrderController {
    private $orderModel;
    public function __construct() {
        $this->orderModel = new OrderModel();
    }
    // GET /api/orders or /api/orders/{id}
    public function get($id, $input, $query) {
        require_once __DIR__ . '/../middlewares/JwtMiddleware.php';
        $user = JwtMiddleware::getUser();

        if ($id) {
            require_once __DIR__ . '/../models/OrderDetailModel.php';
            require_once __DIR__ . '/../models/UserModel.php';

            $order = $this->orderModel->getOrderById($id);
            if ($order) {
                $orderDetailModel = new OrderDetailModel();
                $order['ChiTietHoaDons'] = $orderDetailModel->getOrderDetailsByOrderId($id);

                $userModel = new UserModel();

                $order['KhachHang'] = $userModel->getUserById($order['MaKhachHang'], 2);
                if ($order['KhachHang']) {
                    unset($order['KhachHang']['MatKhau']);
                }
                $order['NhanVien'] = $userModel->getUserById($order['MaNhanVien'], 1);
                if ($order['NhanVien']) {
                    unset($order['NhanVien']['MatKhau']);
                }

                echo json_encode($order);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Đơn hàng không tồn tại']);
            }
        } else if (isset($query['customerId'])) {
            require_once __DIR__ . '/../models/OrderDetailModel.php';
            $orderDetailModel = new OrderDetailModel();

            $orders = $this->orderModel->getOrdersByCustomerId($query['customerId']);
            foreach ($orders as &$order) {
                $orderDetails = $orderDetailModel->getOrderDetailsByOrderId($order['MaHoaDon']);
                // Transform each order detail to nest product info into SanPham object
                foreach ($orderDetails as &$detail) {
                    $detail['SanPham'] = [
                        'MaSanPham' => $detail['MaSanPham'],
                        'TenSanPham' => $detail['TenSanPham'],
                        'GiaSanPham' => $detail['GiaSanPham'],
                        'HinhAnh' => $detail['HinhAnh']
                    ];
                    // Remove the flat product fields from detail
                    unset($detail['TenSanPham'], $detail['GiaSanPham'], $detail['HinhAnh']);
                }
                $order['ChiTietHoaDons'] = $orderDetails;
            }
            echo json_encode($orders);
        } else if ($user) {
            if (isset($user->MaVaiTro) && ($user->MaVaiTro == 0 || $user->MaVaiTro == 1)) {
                // Admin or staff: return paginated orders with customer info
                $page = isset($query['page']) ? intval($query['page']) : 1;
                $limit = isset($query['limit']) ? intval($query['limit']) : 10;
                $data = $this->orderModel->getAllOrders($page, $limit);

                require_once __DIR__ . '/../models/UserModel.php';
                $userModel = new UserModel();

                foreach ($data['orders'] as &$order) {
                    $order['KhachHang'] = $userModel->getUserById($order['MaKhachHang'], 2);
                    if ($order['KhachHang']) {
                        unset($order['KhachHang']['MatKhau']);
                    }
                }

                echo json_encode($data);
            } else if (isset($user->MaVaiTro) && $user->MaVaiTro == 2 && isset($user->MaKhachHang)) {
                require_once __DIR__ . '/../models/OrderDetailModel.php';
                $orderDetailModel = new OrderDetailModel();

                $page = isset($query['page']) ? intval($query['page']) : 1;
                $limit = isset($query['limit']) ? intval($query['limit']) : 10;
                $orders = $this->orderModel->getOrdersByCustomerId($user->MaKhachHang, $page, $limit);
                foreach ($orders as &$order) {
                $orderDetails = $orderDetailModel->getOrderDetailsByOrderId($order['MaHoaDon']);
                // Transform each order detail to nest product info into SanPham object
                foreach ($orderDetails as &$detail) {
                    $detail['SanPham'] = [
                        'MaSanPham' => $detail['MaSanPham'],
                        'TenSanPham' => $detail['TenSanPham'],
                        'GiaSanPham' => $detail['GiaSanPham'],
                        'HinhAnh' => $detail['HinhAnh']
                    ];
                    unset($detail['TenSanPham'], $detail['GiaSanPham'], $detail['HinhAnh']);
                }
                $order['ChiTietHoaDons'] = $orderDetails;
                }
                echo json_encode($orders);
            } else {
                // Nếu không phải khách hàng hoặc thiếu MaKhachHang, trả về mảng rỗng
                echo json_encode([]);
            }
        } else {
            http_response_code(401);
            echo json_encode(['message' => 'Chưa xác thực người dùng']);
        }
    }
    // POST /api/orders
    public function post($id, $input, $query) {
        require_once __DIR__ . '/../models/OrderDetailModel.php';
        $orderDetailModel = new OrderDetailModel();

        $this->orderModel->conn->beginTransaction();
        try {
            $newOrderId = $this->orderModel->createOrder($input);
            if (!$newOrderId) {
                throw new Exception('Lỗi khi tạo đơn hàng');
            }

            if (isset($input['items']) && is_array($input['items'])) {
                foreach ($input['items'] as $item) {
                    $item['MaHoaDon'] = $newOrderId;
                    $newDetailId = $orderDetailModel->createOrderDetail($item);
                    if (!$newDetailId) {
                        throw new Exception('Lỗi khi tạo chi tiết đơn hàng');
                    }
                }
            }

            $this->orderModel->conn->commit();
            echo json_encode(['message' => 'Tạo đơn hàng thành công', 'id' => $newOrderId]);
        } catch (Exception $e) {
            $this->orderModel->conn->rollBack();
            http_response_code(500);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }
    // PUT /api/orders/{id}
    public function put($id, $input, $query) {
        if (!$id || !isset($input['TrangThai'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu thông tin cập nhật trạng thái']);
            return;
        }
        $success = $this->orderModel->updateOrderStatus($id, $input['TrangThai']);
        if ($success) {
            echo json_encode(['message' => 'Cập nhật trạng thái đơn hàng thành công']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi cập nhật trạng thái đơn hàng']);
        }
    }
    // DELETE /api/orders/{id}
    public function delete($id, $input, $query) {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu ID đơn hàng']);
            return;
        }
        $success = $this->orderModel->deleteOrder($id);
        if ($success) {
            echo json_encode(['message' => 'Xóa đơn hàng thành công']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi xóa đơn hàng']);
        }
    }

    // GET /api/admin/orders/by-customer/{id}
    public function getOrdersByCustomerIdAdmin($id, $input, $query) {
        require_once __DIR__ . '/../models/OrderDetailModel.php';
        $orderDetailModel = new OrderDetailModel();

        $page = isset($query['page']) ? intval($query['page']) : 1;
        $limit = isset($query['limit']) ? intval($query['limit']) : 10;
        $orders = $this->orderModel->getOrdersByCustomerId($id, $page, $limit);
        foreach ($orders as &$order) {
                $orderDetails = $orderDetailModel->getOrderDetailsByOrderId($order['MaHoaDon']);
                // Transform each order detail to nest product info into SanPham object
                foreach ($orderDetails as &$detail) {
                    $detail['SanPham'] = [
                        'MaSanPham' => $detail['MaSanPham'],
                        'TenSanPham' => $detail['TenSanPham'],
                        'GiaSanPham' => $detail['GiaSanPham'],
                        'HinhAnh' => $detail['HinhAnh']
                    ];
                    unset($detail['TenSanPham'], $detail['GiaSanPham'], $detail['HinhAnh']);
                }
                $order['ChiTietHoaDons'] = $orderDetails;
        }
        echo json_encode($orders);
    }
}
