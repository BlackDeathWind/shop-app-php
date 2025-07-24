import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import ProductService from '../services/product.service';
import * as path from 'path';
import * as fs from 'fs';

export default class ProductController {
  private productService = new ProductService();

  public getAllProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.productService.getAllProducts(page, limit);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || 'Lỗi khi lấy danh sách sản phẩm'
      });
    }
  };

  public getProductById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.getProductById(id);
      return res.status(200).json(product);
    } catch (error: any) {
      return res.status(404).json({
        message: error.message
      });
    }
  };

  public getProductsByCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.productService.getProductsByCategory(categoryId, page, limit);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || 'Lỗi khi lấy danh sách sản phẩm theo danh mục'
      });
    }
  };

  public searchProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({
          message: 'Vui lòng nhập từ khóa tìm kiếm'
        });
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.productService.searchProducts(query, page, limit);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || 'Lỗi khi tìm kiếm sản phẩm'
      });
    }
  };

  public createProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Xử lý tệp hình ảnh nếu có
      let imagePath = null;
      if (req.file) {
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const uploadPath = path.join(__dirname, '../../public/uploads', fileName);
        
        // Đảm bảo thư mục tồn tại
        const dir = path.dirname(uploadPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(uploadPath, req.file.buffer);
        imagePath = `/uploads/${fileName}`;
      }

      const productData = {
        ...req.body,
        HinhAnh: imagePath || req.body.HinhAnh
      };

      const product = await this.productService.createProduct(productData);
      return res.status(201).json({
        message: 'Tạo sản phẩm thành công',
        product
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || 'Lỗi khi tạo sản phẩm'
      });
    }
  };

  public updateProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      console.log('=== START updateProduct ===');
      console.log('Request URL:', req.originalUrl);
      console.log('Request params:', req.params);
      console.log('Request headers:', req.headers);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      // Kiểm tra id hợp lệ
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        console.log('Invalid ID:', req.params.id);
        return res.status(400).json({
          message: 'ID sản phẩm không hợp lệ'
        });
      }

      // Log thông tin request để debug
      console.log('Update product request:', {
        id,
        body: req.body,
        file: req.file ? 'File exists' : 'No file'
      });

      // Xử lý tệp hình ảnh nếu có
      let imagePath = null;
      if (req.file) {
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const uploadPath = path.join(__dirname, '../../public/uploads', fileName);
        
        // Đảm bảo thư mục tồn tại
        const dir = path.dirname(uploadPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(uploadPath, req.file.buffer);
        imagePath = `/uploads/${fileName}`;
      }

      // Chuẩn bị dữ liệu cập nhật
      const productData: any = {
        TenSanPham: req.body.TenSanPham,
        MaDanhMuc: parseInt(req.body.MaDanhMuc),
        MoTa: req.body.MoTa || '',
        SoLuong: parseInt(req.body.SoLuong),
        GiaSanPham: parseFloat(req.body.GiaSanPham)
      };

      // Thêm hình ảnh nếu có
      if (imagePath) {
        productData.HinhAnh = imagePath;
      }

      console.log('Product data to update:', productData);

      // Cập nhật sản phẩm
      const product = await this.productService.updateProduct(id, productData);
      console.log('Product updated successfully:', product.MaSanPham);
      
      return res.status(200).json({
        message: 'Cập nhật sản phẩm thành công',
        product
      });
    } catch (error: any) {
      console.error('Error updating product:', error);
      console.error('Error stack:', error.stack);
      return res.status(500).json({
        message: error.message || 'Lỗi khi cập nhật sản phẩm'
      });
    }
  };

  public deleteProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = parseInt(req.params.id);
      await this.productService.deleteProduct(id);
      return res.status(200).json({
        message: 'Xóa sản phẩm thành công'
      });
    } catch (error: any) {
      return res.status(404).json({
        message: error.message
      });
    }
  };
} 