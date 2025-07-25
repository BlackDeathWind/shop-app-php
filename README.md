# Shop App - Hệ thống Quản lý Bán Hoa & Quà tặng

## 1. Yêu cầu hệ thống
- **XAMPP** (hoặc PHP >= 8.0, MySQL >= 5.7)
- **Node.js** >= 16
- **npm** >= 8

## 2. Cài đặt & Khởi chạy Backend (PHP)
### 2.1. Cấu hình MySQL
- Mở XAMPP, bật **Apache** và **MySQL**.
- Tạo database `shop`:
  - Import các file SQL:
    - `1_create_schema_mysql.sql`
    - `2_create_tables_mysql.sql`
    - `3_insert_sample_data_mysql.sql`
- Thông tin kết nối mặc định:
  - Host: `localhost`
  - Port: `3306`
  - Username: `root`
  - Password: `21050043` (nếu không kết nối được, thử password rỗng)

### 2.2. Cấu hình backend PHP
- Đường dẫn backend: `shop-app/backend-php`
- Cấu trúc thư mục:
  - `controllers/` - Xử lý logic API
  - `models/` - Kết nối và thao tác DB
  - `middlewares/` - Xác thực, phân quyền
  - `routes/web.php` - Định nghĩa route
  - `public/uploads/` - Lưu file upload
  - `index.php` - Entrypoint
- Không cần cài đặt thêm package ngoài (chạy thuần PHP + PDO)

### 2.3. Khởi chạy backend
- Đảm bảo XAMPP Apache đã bật.
- Truy cập API qua đường dẫn: `http://localhost/shop-app/backend-php/index.php/api/...`
- Nếu dùng Windows, đảm bảo thư mục `public/uploads` có quyền ghi.

#### **Kiểm tra API backend đã hoạt động**
- Sau khi bật Apache và MySQL, kiểm tra API bằng cách:
  - **Cách 1:** Mở trình duyệt và truy cập: [http://localhost/shop-app/backend-php/index.php/api/categories](http://localhost/shop-app/backend-php/index.php/api/categories)
    - Nếu API hoạt động, bạn sẽ thấy danh sách các danh mục sản phẩm trả về dạng JSON.
  - **Cách 2:** Sử dụng lệnh `curl` trong terminal:
    ```bash
    curl http://localhost/shop-app/backend-php/index.php/api/categories
    ```
    - Nếu API hoạt động, sẽ trả về dữ liệu JSON danh mục sản phẩm.
- Nếu không nhận được dữ liệu, kiểm tra lại cấu hình XAMPP, database, hoặc xem log lỗi của Apache.

## 3. Cài đặt & Khởi chạy Frontend (React)
### 3.1. Cài đặt
```bash
cd shop-app/frontend
npm install
```

### 3.2. Khởi chạy
```bash
npm run dev
```
- Truy cập: [http://localhost:5173](http://localhost:5173)
- Frontend sẽ gọi API PHP qua `http://localhost/shop-app/backend-php/index.php/api`

## 4. Đăng nhập & Tài khoản mẫu
- **Admin:**
  - SĐT: `0901234567`
  - Mật khẩu: `Admin@1`
- **Nhân viên:**
  - SĐT: `0912345678` / `0912345679`
  - Mật khẩu: `Nhanvien@1` / `Nhanvien@2`
- **Khách hàng:**
  - SĐT: `0923456789` / ...
  - Mật khẩu: `Khachhang@1` / ...

## 5. Một số lệnh hữu ích
- **Cài lại node_modules:**
  ```bash
  cd frontend
  rm -rf node_modules
  npm install
  ```
- **Reset database:**
  - Xóa và import lại các file SQL trong XAMPP phpMyAdmin.

## 6. Ghi chú quan trọng
- Nếu upload ảnh không được, kiểm tra quyền ghi thư mục `backend-php/public/uploads`.
- Nếu API trả về lỗi 401/403, hãy đăng nhập lại hoặc kiểm tra quyền tài khoản.
- Nếu sửa code backend, chỉ cần refresh trình duyệt (không cần build lại như Node.js).

## 7. Cấu trúc thư mục chính
```
shop-app/
  backend-php/
    controllers/
    models/
    middlewares/
    routes/
    public/uploads/
    index.php
  frontend/
    src/
    ...
```

## 8. Liên hệ & Hỗ trợ
- Email: 21050043@student.bdu.edu.vn
- Zalo: 0938 320 498

---
**Chúc bạn sử dụng hệ thống thành công!**
