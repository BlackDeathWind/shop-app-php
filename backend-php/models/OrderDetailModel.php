<?php
require_once 'BaseModel.php';
class OrderDetailModel extends BaseModel {
    public function getOrderDetailsByOrderId($orderId) {
        $sql = 'SELECT ChiTietHoaDon.*, 
                       SanPham.TenSanPham AS "SanPham.TenSanPham", 
                       SanPham.GiaSanPham AS "SanPham.GiaSanPham", 
                       SanPham.HinhAnh AS "SanPham.HinhAnh"
                FROM ChiTietHoaDon 
                LEFT JOIN SanPham ON ChiTietHoaDon.MaSanPham = SanPham.MaSanPham 
                WHERE ChiTietHoaDon.MaHoaDon = ?';
        return $this->fetchAll($sql, [$orderId]);
    }
    public function getOrderDetailById($id) {
        $sql = 'SELECT * FROM ChiTietHoaDon WHERE MaChiTiet = ?';
        return $this->fetchOne($sql, [$id]);
    }
    public function createOrderDetail($data) {
        $sql = 'INSERT INTO ChiTietHoaDon (MaHoaDon, MaSanPham, SoLuong, DonGia, ThanhTien) VALUES (?, ?, ?, ?, ?)';
        $this->execute($sql, [
            $data['MaHoaDon'],
            $data['MaSanPham'],
            $data['SoLuong'],
            $data['DonGia'],
            $data['ThanhTien']
        ]);
        return $this->lastInsertId();
    }
    public function updateOrderDetail($id, $data) {
        $sql = 'UPDATE ChiTietHoaDon SET MaSanPham = ?, SoLuong = ?, DonGia = ?, ThanhTien = ? WHERE MaChiTiet = ?';
        return $this->execute($sql, [
            $data['MaSanPham'],
            $data['SoLuong'],
            $data['DonGia'],
            $data['ThanhTien'],
            $id
        ]);
    }
    public function deleteOrderDetail($id) {
        $sql = 'DELETE FROM ChiTietHoaDon WHERE MaChiTiet = ?';
        return $this->execute($sql, [$id]);
    }
} 