<?php
require_once __DIR__ . '/../models/OrderDetailModel.php';
require_once __DIR__ . '/../utils/helpers.php';
class OrderDetailController {
    private $orderDetailModel;
    public function __construct() {
        $this->orderDetailModel = new OrderDetailModel();
    }
    // GET /api/order-details or /api/order-details/{id}
    public function get($id, $input, $query) {
        if ($id) {
            $detail = $this->orderDetailModel->getOrderDetailById($id);
            if ($detail) {
                echo json_encode($detail);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Chi tiết hóa đơn không tồn tại']);
            }
        } else if (isset($query['orderId'])) {
            $details = $this->orderDetailModel->getOrderDetailsByOrderId($query['orderId']);
            echo json_encode($details);
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu thông tin mã hóa đơn']);
        }
    }
    // POST /api/order-details
    public function post($id, $input, $query) {
        $newId = $this->orderDetailModel->createOrderDetail($input);
        if ($newId) {
            echo json_encode(['message' => 'Tạo chi tiết hóa đơn thành công', 'id' => $newId]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi tạo chi tiết hóa đơn']);
        }
    }
    // PUT /api/order-details/{id}
    public function put($id, $input, $query) {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu ID chi tiết hóa đơn']);
            return;
        }
        $success = $this->orderDetailModel->updateOrderDetail($id, $input);
        if ($success) {
            echo json_encode(['message' => 'Cập nhật chi tiết hóa đơn thành công']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi cập nhật chi tiết hóa đơn']);
        }
    }
    // DELETE /api/order-details/{id}
    public function delete($id, $input, $query) {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu ID chi tiết hóa đơn']);
            return;
        }
        $success = $this->orderDetailModel->deleteOrderDetail($id);
        if ($success) {
            echo json_encode(['message' => 'Xóa chi tiết hóa đơn thành công']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi xóa chi tiết hóa đơn']);
        }
    }
} 