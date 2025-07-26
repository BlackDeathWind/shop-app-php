<?php
require_once __DIR__ . '/../models/ProductModel.php';
require_once __DIR__ . '/../utils/helpers.php';
class ProductController {
    private $productModel;
    public function __construct() {
        $this->productModel = new ProductModel();
    }
    // GET /api/products or /api/products/{id}
    public function get($id, $input, $query) {
        if ($id) {
            $product = $this->productModel->getProductById($id);
            if ($product) {
                echo json_encode($product);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Sản phẩm không tồn tại']);
            }
        } else {
            $page = isset($query['page']) ? intval($query['page']) : 1;
            $limit = isset($query['limit']) ? intval($query['limit']) : 10;
            $products = $this->productModel->getAllProducts($page, $limit);
            echo json_encode($products);
        }
    }
    // GET /api/products/category/{categoryId}
    public function getByCategory($categoryId, $input, $query) {
        $page = isset($query['page']) ? intval($query['page']) : 1;
        $limit = isset($query['limit']) ? intval($query['limit']) : 10;
        $products = $this->productModel->getProductsByCategory($categoryId, $page, $limit);
        echo json_encode($products);
    }
    // POST /api/products
    public function post($id, $input, $query) {
        $newId = $this->productModel->createProduct($input);
        if ($newId) {
            echo json_encode(['message' => 'Tạo sản phẩm thành công', 'id' => $newId]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi tạo sản phẩm']);
        }
    }
    // PUT /api/products/{id}
    public function put($id, $input, $query) {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu ID sản phẩm']);
            return;
        }
        $success = $this->productModel->updateProduct($id, $input);
        if ($success) {
            echo json_encode(['message' => 'Cập nhật sản phẩm thành công']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi cập nhật sản phẩm']);
        }
    }
    // DELETE /api/products/{id}
    public function delete($id, $input, $query) {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu ID sản phẩm']);
            return;
        }
        $success = $this->productModel->deleteProduct($id);
        if ($success) {
            echo json_encode(['message' => 'Xóa sản phẩm thành công']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi xóa sản phẩm']);
        }
    }
} 