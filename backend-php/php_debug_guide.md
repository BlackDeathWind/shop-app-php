# Hướng dẫn kiểm tra cấu hình PHP và chạy script trên CLI để xác định lỗi JSON không hợp lệ

## 1. Kiểm tra cấu hình PHP

- Mở file php.ini (thường nằm trong thư mục cài đặt PHP hoặc XAMPP, ví dụ: `D:\xampp\php\php.ini`).
- Tìm các extension liên quan đến debug như `xdebug`.
- Nếu có, tạm thời comment hoặc tắt extension này bằng cách thêm dấu `;` trước dòng:
  ```
  ;zend_extension = "path\to\xdebug.dll"
  ```
- Lưu file php.ini và khởi động lại Apache.

## 2. Chạy script PHP trên command line (CLI)

- Mở terminal hoặc command prompt.
- Điều hướng đến thư mục chứa script:
  ```
  cd D:\xampp\htdocs\shop-app\backend-php
  ```
- Chạy script PHP test xuất JSON:
  ```
  php test_json_output.php
  ```
- Kiểm tra kết quả xuất ra trên terminal.
- Nếu JSON xuất ra đúng định dạng (có dấu phẩy giữa các trường), thì lỗi do môi trường web server hoặc extension.
- Nếu vẫn lỗi, có thể do dữ liệu hoặc code PHP.

## 3. Các bước tiếp theo

- Nếu lỗi do extension, tắt hoặc cấu hình lại extension.
- Nếu lỗi do dữ liệu, kiểm tra dữ liệu trong database.
- Nếu cần hỗ trợ thêm, bạn có thể cung cấp kết quả chạy trên CLI để tôi giúp phân tích.

---
Nếu bạn cần, tôi có thể giúp bạn thực hiện các bước trên hoặc giải thích chi tiết hơn.
