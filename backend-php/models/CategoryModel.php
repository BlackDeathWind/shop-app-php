<?php
require_once 'BaseModel.php';
class CategoryModel extends BaseModel {
    public function getAllCategories() {
        $sql = 'SELECT * FROM DanhMuc ORDER BY TenDanhMuc ASC';
        return $this->fetchAll($sql);
    }
    public function getCategoryById($id) {
        $sql = 'SELECT * FROM DanhMuc WHERE MaDanhMuc = ?';
        return $this->fetchOne($sql, [$id]);
    }
    public function createCategory($data) {
        $sql = 'INSERT INTO DanhMuc (TenDanhMuc, HinhAnh) VALUES (?, ?)';
        $this->execute($sql, [$data['TenDanhMuc'], $data['HinhAnh'] ?? null]);
        return $this->lastInsertId();
    }
    public function updateCategory($id, $data) {
        $sql = 'UPDATE DanhMuc SET TenDanhMuc = ?, HinhAnh = ? WHERE MaDanhMuc = ?';
        return $this->execute($sql, [$data['TenDanhMuc'], $data['HinhAnh'] ?? null, $id]);
    }
    public function deleteCategory($id) {
        $sql = 'DELETE FROM DanhMuc WHERE MaDanhMuc = ?';
        return $this->execute($sql, [$id]);
    }
} 