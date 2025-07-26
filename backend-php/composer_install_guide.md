# Hướng dẫn cài đặt Composer và thư viện firebase/php-jwt cho backend PHP

## 1. Cài đặt Composer

- Truy cập trang chủ Composer: https://getcomposer.org/download/
- Tải và cài đặt Composer cho Windows theo hướng dẫn.
- Sau khi cài đặt, mở Command Prompt và chạy lệnh:
  ```
  composer --version
  ```
  để kiểm tra Composer đã được cài đặt thành công.

## 2. Cài đặt thư viện firebase/php-jwt

- Mở Command Prompt, điều hướng đến thư mục backend-php:
  ```
  cd D:\xampp\htdocs\shop-app\backend-php
  ```
- Chạy lệnh sau để cài đặt thư viện JWT:
  ```
  composer require firebase/php-jwt
  ```
- Lệnh này sẽ tạo thư mục `vendor` và file `vendor/autoload.php`.

## 3. Kiểm tra

- Kiểm tra file `vendor/autoload.php` đã tồn tại trong thư mục backend-php.
- Khởi động lại Apache nếu cần.

---

# Hướng dẫn sửa lỗi frontend "Cannot read properties of undefined (reading 'MaDanhMuc')" trong ProductsByCategory.tsx

## Nguyên nhân

- Dữ liệu sản phẩm trả về thiếu trường DanhMuc hoặc trường này undefined.

## Cách sửa

- Trong file `ProductsByCategory.tsx`, trước khi truy cập `product.DanhMuc.MaDanhMuc`, kiểm tra tồn tại `product.DanhMuc`:
  ```tsx
  if (!product.DanhMuc) {
    // Xử lý khi không có DanhMuc, ví dụ bỏ qua hoặc gán giá trị mặc định
  }
  ```
- Hoặc sửa backend PHP trả về dữ liệu sản phẩm có trường DanhMuc đầy đủ (tương tự như đã làm với getProductById).

---

Nếu bạn cần, tôi có thể giúp bạn sửa code frontend cụ thể hoặc hỗ trợ thêm.
