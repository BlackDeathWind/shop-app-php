<?php
require_once __DIR__ . '/../config/database.php';
class BaseModel {
    protected $conn;
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }
    // Hàm thực thi query trả về nhiều dòng
    protected function fetchAll($sql, $params = []) {
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    // Hàm thực thi query trả về 1 dòng
    protected function fetchOne($sql, $params = []) {
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    // Hàm thực thi insert/update/delete
    protected function execute($sql, $params = []) {
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($params);
    }
    // Lấy ID vừa insert
    protected function lastInsertId() {
        return $this->conn->lastInsertId();
    }

    // Thêm phương thức public để lấy kết nối
    public function getConnection() {
        return $this->conn;
    }
}
