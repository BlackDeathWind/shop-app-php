<?php
require_once 'BaseModel.php';
class OrderModel extends BaseModel {
    public function getAllOrders($page = 1, $limit = 10) {
        $offset = ($page - 1) * $limit;
        $sql = 'SELECT HoaDon.*, KhachHang.TenKhachHang, KhachHang.SoDienThoai FROM HoaDon LEFT JOIN KhachHang ON HoaDon.MaKhachHang = KhachHang.MaKhachHang ORDER BY HoaDon.NgayLap DESC LIMIT ? OFFSET ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->bindValue(2, $offset, PDO::PARAM_INT);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $count = $this->conn->query('SELECT COUNT(*) FROM HoaDon')->fetchColumn();
        return [
            'total' => intval($count),
            'totalPages' => ceil($count / $limit),
            'currentPage' => $page,
            'orders' => $orders
        ];
    }
    public function getOrderById($id) {
        $sql = 'SELECT * FROM HoaDon WHERE MaHoaDon = ?';
        return $this->fetchOne($sql, [$id]);
    }
    public function getOrdersByCustomerId($customerId) {
        $sql = 'SELECT * FROM HoaDon WHERE MaKhachHang = ? ORDER BY NgayLap DESC';
        return $this->fetchAll($sql, [$customerId]);
    }
    public function createOrder($data) {
        $sql = 'INSERT INTO HoaDon (MaKhachHang, MaNhanVien, NgayLap, TongTien, PhuongThucTT, DiaChi, TrangThai) VALUES (?, ?, NOW(), ?, ?, ?, ?)';
        $this->execute($sql, [
            $data['MaKhachHang'],
            $data['MaNhanVien'] ?? null,
            $data['TongTien'],
            $data['PhuongThucTT'],
            $data['DiaChi'],
            $data['TrangThai'] ?? 'Đang xử lý'
        ]);
        return $this->lastInsertId();
    }
    public function updateOrderStatus($id, $status) {
        $sql = 'UPDATE HoaDon SET TrangThai = ? WHERE MaHoaDon = ?';
        return $this->execute($sql, [$status, $id]);
    }
    public function deleteOrder($id) {
        $sql = 'DELETE FROM HoaDon WHERE MaHoaDon = ?';
        return $this->execute($sql, [$id]);
    }
} 