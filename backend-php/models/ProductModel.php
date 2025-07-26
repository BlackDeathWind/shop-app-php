<?php
require_once 'BaseModel.php';
class ProductModel extends BaseModel {
    public function getAllProducts($page = 1, $limit = 10) {
        $offset = ($page - 1) * $limit;
        $sql = 'SELECT * FROM SanPham ORDER BY NgayCapNhat DESC LIMIT ? OFFSET ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->bindValue(2, $offset, PDO::PARAM_INT);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $count = $this->conn->query('SELECT COUNT(*) FROM SanPham')->fetchColumn();
        return [
            'total' => intval($count),
            'totalPages' => ceil($count / $limit),
            'currentPage' => $page,
            'products' => $products
        ];
    }

    // Lấy sản phẩm theo danh mục, hỗ trợ phân trang
    public function getProductsByCategory($categoryId, $page = 1, $limit = 10) {
        $offset = ($page - 1) * $limit;
        $sql = 'SELECT sp.*, dm.MaDanhMuc as DanhMuc_MaDanhMuc, dm.TenDanhMuc as DanhMuc_TenDanhMuc, dm.HinhAnh as DanhMuc_HinhAnh
                FROM SanPham sp
                LEFT JOIN DanhMuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
                WHERE sp.MaDanhMuc = ?
                ORDER BY sp.NgayCapNhat DESC
                LIMIT ? OFFSET ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(1, $categoryId, PDO::PARAM_INT);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->bindValue(3, $offset, PDO::PARAM_INT);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // Map DanhMuc fields to nested array
        foreach ($products as &$product) {
            $product['DanhMuc'] = [
                'MaDanhMuc' => $product['DanhMuc_MaDanhMuc'],
                'TenDanhMuc' => $product['DanhMuc_TenDanhMuc'],
                'HinhAnh' => $product['DanhMuc_HinhAnh']
            ];
            unset($product['DanhMuc_MaDanhMuc'], $product['DanhMuc_TenDanhMuc'], $product['DanhMuc_HinhAnh']);
        }
        $countStmt = $this->conn->prepare('SELECT COUNT(*) FROM SanPham WHERE MaDanhMuc = ?');
        $countStmt->execute([$categoryId]);
        $count = $countStmt->fetchColumn();
        return [
            'total' => intval($count),
            'totalPages' => ceil($count / $limit),
            'currentPage' => $page,
            'products' => $products
        ];
    }
    public function getProductById($id) {
        $sql = 'SELECT sp.*, dm.MaDanhMuc as DanhMuc_MaDanhMuc, dm.TenDanhMuc as DanhMuc_TenDanhMuc, dm.HinhAnh as DanhMuc_HinhAnh
                FROM SanPham sp
                LEFT JOIN DanhMuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
                WHERE sp.MaSanPham = ?';
        $product = $this->fetchOne($sql, [$id]);
        if ($product) {
            // Map DanhMuc fields to nested array
            $product['DanhMuc'] = [
                'MaDanhMuc' => $product['DanhMuc_MaDanhMuc'],
                'TenDanhMuc' => $product['DanhMuc_TenDanhMuc'],
                'HinhAnh' => $product['DanhMuc_HinhAnh']
            ];
            unset($product['DanhMuc_MaDanhMuc'], $product['DanhMuc_TenDanhMuc'], $product['DanhMuc_HinhAnh']);
        }
        return $product;
    }
    public function createProduct($data) {
        $sql = 'INSERT INTO SanPham (TenSanPham, MaDanhMuc, MoTa, SoLuong, GiaSanPham, HinhAnh) VALUES (?, ?, ?, ?, ?, ?)';
        $this->execute($sql, [
            $data['TenSanPham'],
            $data['MaDanhMuc'],
            $data['MoTa'] ?? '',
            $data['SoLuong'],
            $data['GiaSanPham'],
            $data['HinhAnh'] ?? null
        ]);
        return $this->lastInsertId();
    }
    public function updateProduct($id, $data) {
        $sql = 'UPDATE SanPham SET TenSanPham = ?, MaDanhMuc = ?, MoTa = ?, SoLuong = ?, GiaSanPham = ?, HinhAnh = ? WHERE MaSanPham = ?';
        return $this->execute($sql, [
            $data['TenSanPham'],
            $data['MaDanhMuc'],
            $data['MoTa'] ?? '',
            $data['SoLuong'],
            $data['GiaSanPham'],
            $data['HinhAnh'] ?? null,
            $id
        ]);
    }
    public function deleteProduct($id) {
        $sql = 'DELETE FROM SanPham WHERE MaSanPham = ?';
        return $this->execute($sql, [$id]);
    }
} 