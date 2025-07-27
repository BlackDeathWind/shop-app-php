<?php
// config/database.php
class Database {
    private $host = '127.0.0.1';
    private $port = 3306;
    private $db_name = 'shop';
    private $username = 'root';
    private $password = '';
    public $conn;

    public function getConnection() {
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->conn;
        } catch (PDOException $exception) {
            die('Không thể kết nối đến MySQL. Vui lòng kiểm tra cấu hình.');
        }
    }
} 