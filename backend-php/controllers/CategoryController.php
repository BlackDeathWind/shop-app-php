<?php
require_once __DIR__ . '/../models/CategoryModel.php';
require_once __DIR__ . '/../utils/helpers.php';
class CategoryController {
    private $categoryModel;
    public function __construct() {
        $this->categoryModel = new CategoryModel();
    }
    // GET /api/categories or /api/categories/{id}
    public function get($id, $input, $query) {
        if ($id) {
            $category = $this->categoryModel->getCategoryById($id);
            if ($category) {
                echo json_encode($category);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Danh mục không tồn tại']);
            }
        } else {
            $categories = $this->categoryModel->getAllCategories();
            echo json_encode($categories);
        }
    }
    // POST /api/categories
    public function post($id, $input, $query) {
        $newId = $this->categoryModel->createCategory($input);
        if ($newId) {
            echo json_encode(['message' => 'Tạo danh mục thành công', 'id' => $newId]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi tạo danh mục']);
        }
    }
    // PUT /api/categories/{id}
    public function put($id, $input, $query) {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu ID danh mục']);
            return;
        }
        $success = $this->categoryModel->updateCategory($id, $input);
        if ($success) {
            echo json_encode(['message' => 'Cập nhật danh mục thành công']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi cập nhật danh mục']);
        }
    }
    // DELETE /api/categories/{id}
    public function delete($id, $input, $query) {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu ID danh mục']);
            return;
        }
        $success = $this->categoryModel->deleteCategory($id);
        if ($success) {
            echo json_encode(['message' => 'Xóa danh mục thành công']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi xóa danh mục']);
        }
    }
} 