<?php
// config/database.php
class Database {
    private $host = 'localhost';
    private $port = 3306;
    private $db_name = 'shop';
    private $username = 'root';
    private $password = '21050043';
    public $conn;

    public function getConnection() {
        $tryList = [
            [
                'host' => $this->host,
                'port' => $this->port,
                'username' => $this->username,
                'password' => $this->password,
                'db_name' => $this->db_name
            ],
            // Fallback: XAMPP default (nếu có thể tuỳ chỉnh thêm)
            [
                'host' => '127.0.0.1',
                'port' => 3306,
                'username' => 'root',
                'password' => '',
                'db_name' => $this->db_name
            ]
        ];
        foreach ($tryList as $cfg) {
            try {
                $this->conn = new PDO(
                    "mysql:host={$cfg['host']};port={$cfg['port']};dbname={$cfg['db_name']};charset=utf8mb4",
                    $cfg['username'],
                    $cfg['password']
                );
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return $this->conn;
            } catch (PDOException $exception) {
                // Thử cấu hình tiếp theo
            }
        }
        die('Không thể kết nối đến MySQL. Vui lòng kiểm tra cấu hình.');
    }
} 