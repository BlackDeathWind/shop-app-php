USE shop;
GO

-- Tạo bảng VaiTro
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'VaiTro')
BEGIN
    CREATE TABLE VaiTro (
        MaVaiTro INT PRIMARY KEY,
        TenVaiTro NVARCHAR(50) NOT NULL
    );
END;
GO

-- Tạo bảng NhanVien
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'NhanVien')
BEGIN
    CREATE TABLE NhanVien (
        MaNhanVien INT IDENTITY(1,1) PRIMARY KEY,
        MaVaiTro INT NOT NULL,
        TenNhanVien NVARCHAR(100) NOT NULL,
        SoDienThoai VARCHAR(15) NOT NULL UNIQUE,
        MatKhau VARCHAR(255) NOT NULL,
        DiaChi NVARCHAR(255),
        CONSTRAINT FK_NhanVien_VaiTro FOREIGN KEY (MaVaiTro) REFERENCES VaiTro(MaVaiTro)
    );
END;
GO

-- Tạo bảng KhachHang
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'KhachHang')
BEGIN
    CREATE TABLE KhachHang (
        MaKhachHang INT IDENTITY(1,1) PRIMARY KEY,
        MaVaiTro INT NOT NULL,
        TenKhachHang NVARCHAR(100) NOT NULL,
        SoDienThoai VARCHAR(15) NOT NULL UNIQUE,
        MatKhau VARCHAR(255) NOT NULL,
        DiaChi NVARCHAR(255),
        CONSTRAINT FK_KhachHang_VaiTro FOREIGN KEY (MaVaiTro) REFERENCES VaiTro(MaVaiTro)
    );
END;
GO

-- Tạo bảng DanhMuc
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DanhMuc')
BEGIN
    CREATE TABLE DanhMuc (
        MaDanhMuc INT IDENTITY(1,1) PRIMARY KEY,
        TenDanhMuc NVARCHAR(100) NOT NULL,
        HinhAnh NVARCHAR(255)
    );
END;
GO

-- Tạo bảng SanPham
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SanPham')
BEGIN
    CREATE TABLE SanPham (
        MaSanPham INT IDENTITY(1,1) PRIMARY KEY,
        TenSanPham NVARCHAR(100) NOT NULL,
        MaDanhMuc INT NOT NULL,
        MoTa NVARCHAR(MAX),
        SoLuong INT NOT NULL DEFAULT 0,
        GiaSanPham DECIMAL(18, 2) NOT NULL,
        Ngaytao DATETIME DEFAULT GETDATE(),
        NgayCapNhat DATETIME DEFAULT GETDATE(),
        HinhAnh NVARCHAR(255),
        CONSTRAINT FK_SanPham_DanhMuc FOREIGN KEY (MaDanhMuc) REFERENCES DanhMuc(MaDanhMuc)
    );
END;
GO

-- Tạo bảng HoaDon
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'HoaDon')
BEGIN
    CREATE TABLE HoaDon (
        MaHoaDon INT IDENTITY(1,1) PRIMARY KEY,
        MaKhachHang INT NOT NULL,
        MaNhanVien INT NULL,
        NgayLap DATETIME DEFAULT GETDATE(),
        TongTien DECIMAL(18, 2) NOT NULL,
        PhuongThucTT NVARCHAR(50) NOT NULL,
        DiaChi NVARCHAR(255) NOT NULL,
        TrangThai NVARCHAR(50) DEFAULT N'Đang xử lý',
        CONSTRAINT FK_HoaDon_KhachHang FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaKhachHang),
        CONSTRAINT FK_HoaDon_NhanVien FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien)
    );
END;
GO

-- Tạo bảng ChiTietHoaDon
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ChiTietHoaDon')
BEGIN
    CREATE TABLE ChiTietHoaDon (
        MaChiTiet INT IDENTITY(1,1) PRIMARY KEY,
        MaHoaDon INT NOT NULL,
        MaSanPham INT NOT NULL,
        SoLuong INT NOT NULL,
        DonGia DECIMAL(18, 2) NOT NULL,
        ThanhTien DECIMAL(18, 2) NOT NULL,
        CONSTRAINT FK_ChiTietHoaDon_HoaDon FOREIGN KEY (MaHoaDon) REFERENCES HoaDon(MaHoaDon),
        CONSTRAINT FK_ChiTietHoaDon_SanPham FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
    );
END;
GO 