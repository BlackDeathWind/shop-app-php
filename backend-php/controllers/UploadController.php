<?php
class UploadController {
    // POST /api/upload (single image)
    public function post($id, $input, $query) {
        if (!isset($_FILES['image'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Không tìm thấy file để upload']);
            return;
        }
        $file = $_FILES['image'];
        $targetDir = __DIR__ . '/../public/uploads/';
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }
        $fileName = time() . '-' . basename($file['name']);
        $targetFile = $targetDir . $fileName;
        if (move_uploaded_file($file['tmp_name'], $targetFile)) {
            $relativePath = '/uploads/' . $fileName;
            echo json_encode([
                'message' => 'Upload thành công',
                'fileName' => $fileName,
                'filePath' => $relativePath
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Lỗi khi upload file']);
        }
    }
    // POST /api/upload/multiple (multiple images)
    public function multiple($id, $input, $query) {
        if (!isset($_FILES['images'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Không tìm thấy file để upload']);
            return;
        }
        $files = $_FILES['images'];
        $targetDir = __DIR__ . '/../public/uploads/';
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }
        $filePaths = [];
        for ($i = 0; $i < count($files['name']); $i++) {
            $fileName = time() . '-' . $i . '-' . basename($files['name'][$i]);
            $targetFile = $targetDir . $fileName;
            if (move_uploaded_file($files['tmp_name'][$i], $targetFile)) {
                $filePaths[] = [
                    'fileName' => $fileName,
                    'filePath' => '/uploads/' . $fileName
                ];
            }
        }
        echo json_encode([
            'message' => 'Upload thành công',
            'files' => $filePaths
        ]);
    }
} 