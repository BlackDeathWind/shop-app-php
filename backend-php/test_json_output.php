<?php
require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json');

try {
    $db = new Database();
    $conn = $db->getConnection();

    $stmt = $conn->prepare('SELECT * FROM DanhMuc ORDER BY TenDanhMuc ASC');
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($categories, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
