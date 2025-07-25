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
        if ($id) {
            $order = $this->orderModel->getOrderById($id);
            if ($order) {
                echo json_encode($order);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Đơn hàng không tồn tại']);
            }
        } else if (isset($query['customerId'])) {
            $orders = $this->orderModel->getOrdersByCustomerId($query['customerId']);
            echo json_encode($orders);
        } else {
            $page = isset($query['page']) ? intval($query['page']) : 1;
            $limit = isset($query['limit']) ? intval($query['limit']) : 10;
            $orders = $this->orderModel->getAllOrders($page, $limit);
            echo json_encode($orders);
        }
    }
    // POST /api/orders
    public function post($id, $input, $query) {
        $newId = $this->orderModel->createOrder($input);
        if ($newId) {
            echo json_encode(['message' => 'Tạo đơn hàng thành công', 'id' => $newId]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi tạo đơn hàng']);
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
} 