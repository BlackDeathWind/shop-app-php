<?php
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../models/ProductModel.php';
require_once __DIR__ . '/../models/OrderModel.php';
require_once __DIR__ . '/../models/CategoryModel.php';
class AdminController {
    private $userModel;
    private $productModel;
    private $orderModel;
    private $categoryModel;
    public function __construct() {
        $this->userModel = new UserModel();
        $this->productModel = new ProductModel();
        $this->orderModel = new OrderModel();
        $this->categoryModel = new CategoryModel();
    }
    // GET /api/admin/dashboard
    public function get($id, $input, $query) {
        $totalProducts = $this->productModel->getAllProducts(1, 1)['total'];
        $totalCategories = count($this->categoryModel->getAllCategories());
        $totalCustomers = $this->userModel->fetchAll('SELECT * FROM KhachHang') ? count($this->userModel->fetchAll('SELECT * FROM KhachHang')) : 0;
        $totalOrders = $this->orderModel->getAllOrders(1, 1)['total'];
        $revenue = $this->orderModel->conn->query("SELECT SUM(TongTien) as revenue FROM HoaDon WHERE TrangThai != 'Đã hủy'")->fetch()['revenue'] ?? 0;
        echo json_encode([
            'totalProducts' => $totalProducts,
            'totalCategories' => $totalCategories,
            'totalCustomers' => $totalCustomers,
            'totalOrders' => $totalOrders,
            'revenue' => $revenue
        ]);
    }
} 