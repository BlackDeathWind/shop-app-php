<?php
require_once 'BaseModel.php';
class UserModel extends BaseModel {
    // Lấy thông tin user theo ID và role
    public function getUserById($id, $role = 2) {
        if ($role == 2) {
            $sql = 'SELECT * FROM KhachHang WHERE MaKhachHang = ?';
        } else {
            $sql = 'SELECT * FROM NhanVien WHERE MaNhanVien = ?';
        }
        return $this->fetchOne($sql, [$id]);
    }
    // Lấy user theo số điện thoại
    public function getUserByPhone($phone) {
        $sql = 'SELECT * FROM KhachHang WHERE SoDienThoai = ? UNION SELECT * FROM NhanVien WHERE SoDienThoai = ?';
        return $this->fetchOne($sql, [$phone, $phone]);
    }
    // Tạo user mới
    public function createUser($data, $role = 2) {
        if ($role == 2) {
            $sql = 'INSERT INTO KhachHang (MaVaiTro, TenKhachHang, SoDienThoai, MatKhau, DiaChi) VALUES (?, ?, ?, ?, ?)';
            $this->execute($sql, [
                $data['MaVaiTro'],
                $data['TenKhachHang'],
                $data['SoDienThoai'],
                $data['MatKhau'],
                isset($data['DiaChi']) ? $data['DiaChi'] : null
            ]);
            return $this->lastInsertId();
        } else {
            $sql = 'INSERT INTO NhanVien (MaVaiTro, TenNhanVien, SoDienThoai, MatKhau, DiaChi) VALUES (?, ?, ?, ?, ?)';
            $this->execute($sql, [
                $data['MaVaiTro'],
                $data['TenNhanVien'],
                $data['SoDienThoai'],
                $data['MatKhau'],
                isset($data['DiaChi']) ? $data['DiaChi'] : null
            ]);
            return $this->lastInsertId();
        }
    }
    // Cập nhật user
    public function updateUser($id, $role, $data) {
        if ($role == 2) {
            $sql = 'UPDATE KhachHang SET TenKhachHang = ?, SoDienThoai = ?, DiaChi = ? WHERE MaKhachHang = ?';
            return $this->execute($sql, [$data['TenKhachHang'], $data['SoDienThoai'], $data['DiaChi'], $id]);
        } else {
            $sql = 'UPDATE NhanVien SET TenNhanVien = ?, SoDienThoai = ?, DiaChi = ? WHERE MaNhanVien = ?';
            return $this->execute($sql, [$data['TenNhanVien'], $data['SoDienThoai'], $data['DiaChi'], $id]);
        }
    }
    // Đổi mật khẩu
    public function updatePassword($id, $role, $hashedPassword) {
        if ($role == 2) {
            $sql = 'UPDATE KhachHang SET MatKhau = ? WHERE MaKhachHang = ?';
            return $this->execute($sql, [$hashedPassword, $id]);
        } else {
            $sql = 'UPDATE NhanVien SET MatKhau = ? WHERE MaNhanVien = ?';
            return $this->execute($sql, [$hashedPassword, $id]);
        }
    }
} 