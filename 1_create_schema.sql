-- Tạo database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'shop')
BEGIN
    CREATE DATABASE shop;
END;
GO

USE shop;
GO

-- Kiểm tra và tạo schema nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'dbo')
BEGIN
    EXEC('CREATE SCHEMA dbo');
END;
GO 