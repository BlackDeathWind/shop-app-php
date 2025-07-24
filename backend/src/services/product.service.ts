import SanPham from '../models/SanPham.model';
import DanhMuc from '../models/DanhMuc.model';
import { Op, QueryTypes } from 'sequelize';
import { ISanPham } from '../interfaces/models.interface';
import { formatDateForSqlServer } from '../utils/helpers';

export default class ProductService {
  public async getAllProducts(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { count, rows } = await SanPham.findAndCountAll({
        include: [{ model: DanhMuc, as: 'DanhMuc' }],
        limit,
        offset,
        order: [['NgayCapNhat', 'DESC']]
      });

      return {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        products: rows
      };
    } catch (error) {
      throw error;
    }
  }

  public async getProductById(id: number) {
    try {
      const product = await SanPham.findByPk(id, {
        include: [{ model: DanhMuc, as: 'DanhMuc' }]
      });

      if (!product) {
        throw new Error('Sản phẩm không tồn tại');
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  public async getProductsByCategory(categoryId: number, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { count, rows } = await SanPham.findAndCountAll({
        where: { MaDanhMuc: categoryId },
        include: [{ model: DanhMuc, as: 'DanhMuc' }],
        limit,
        offset,
        order: [['NgayCapNhat', 'DESC']]
      });

      return {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        products: rows
      };
    } catch (error) {
      throw error;
    }
  }

  public async searchProducts(query: string, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { count, rows } = await SanPham.findAndCountAll({
        where: {
          [Op.or]: [
            { TenSanPham: { [Op.like]: `%${query}%` } },
            { MoTa: { [Op.like]: `%${query}%` } }
          ]
        },
        include: [{ model: DanhMuc, as: 'DanhMuc' }],
        limit,
        offset,
        order: [['NgayCapNhat', 'DESC']]
      });

      return {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        products: rows
      };
    } catch (error) {
      throw error;
    }
  }

  public async createProduct(productData: Partial<ISanPham>) {
    try {
      console.log('=== Service: createProduct ===');
      console.log('Product data:', productData);
      
      // Kiểm tra các trường bắt buộc
      if (!productData.TenSanPham || !productData.MaDanhMuc || productData.SoLuong === undefined || productData.GiaSanPham === undefined) {
        throw new Error('Thiếu thông tin sản phẩm bắt buộc');
      }
      
      // Định dạng ngày tháng phù hợp với SQL Server
      const now = formatDateForSqlServer();
      
      // Sử dụng raw query để tạo sản phẩm
      const sequelize = SanPham.sequelize;
      if (!sequelize) {
        throw new Error('Sequelize không được khởi tạo');
      }
      
      const sql = `
        INSERT INTO [SanPham] (
          [TenSanPham], 
          [MaDanhMuc], 
          [MoTa], 
          [SoLuong], 
          [GiaSanPham], 
          [HinhAnh], 
          [Ngaytao], 
          [NgayCapNhat]
        ) 
        VALUES (
          :tenSanPham, 
          :maDanhMuc, 
          :moTa, 
          :soLuong, 
          :giaSanPham, 
          :hinhAnh, 
          :ngayTao, 
          :ngayCapNhat
        );
        SELECT SCOPE_IDENTITY() as id;
      `;
      
      const replacements = {
        tenSanPham: productData.TenSanPham,
        maDanhMuc: productData.MaDanhMuc,
        moTa: productData.MoTa || null,
        soLuong: productData.SoLuong,
        giaSanPham: productData.GiaSanPham,
        hinhAnh: productData.HinhAnh || null,
        ngayTao: now,
        ngayCapNhat: now
      };
      
      console.log('Executing SQL:', sql);
      console.log('With replacements:', replacements);
      
      const result = await sequelize.query(sql, { 
        replacements,
        type: QueryTypes.INSERT 
      });
      
      // Lấy ID của sản phẩm mới tạo
      // Kết quả trả về từ sequelize.query với SELECT SCOPE_IDENTITY() as id;
      // thường là [[{ id: 9 }], ...] hoặc [ [ { id: 9 } ], ... ]
      let newProductId: number | null = null;
      if (Array.isArray(result) && Array.isArray(result[0]) && typeof result[0][0] === 'object' && result[0][0] !== null && 'id' in result[0][0]) {
        const obj: any = result[0][0];
        newProductId = obj.id;
      } else if (Array.isArray(result) && typeof result[0] === 'object' && result[0] !== null && 'id' in result[0]) {
        const obj: any = result[0];
        newProductId = obj.id;
      } else if (Array.isArray(result) && typeof result[0] === 'number') {
        newProductId = result[0];
      } else if (typeof result === 'number') {
        newProductId = result;
      }
      if (!newProductId) {
        throw new Error('Không thể tạo sản phẩm mới');
      }
      console.log('Product created with ID:', newProductId);
      // Lấy sản phẩm đã tạo
      const product = await SanPham.findByPk(newProductId);
      
      if (!product) {
        throw new Error('Không thể lấy sản phẩm đã tạo');
      }
      
      return product;
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }

  public async updateProduct(id: number, productData: Partial<ISanPham>) {
    try {
      console.log('=== Service: updateProduct ===');
      console.log('Product ID:', id);
      console.log('Update data:', productData);
      
      // Kiểm tra sự tồn tại của sản phẩm trước
      const product = await SanPham.findByPk(id);
      
      if (!product) {
        console.log('Product not found with ID:', id);
        throw new Error('Sản phẩm không tồn tại');
      }

      // Chuẩn bị dữ liệu để cập nhật
      const updateData: Partial<ISanPham> = {};
      if (productData.TenSanPham !== undefined) updateData.TenSanPham = productData.TenSanPham;
      if (productData.MaDanhMuc !== undefined) updateData.MaDanhMuc = productData.MaDanhMuc;
      if (productData.MoTa !== undefined) updateData.MoTa = productData.MoTa;
      if (productData.SoLuong !== undefined) updateData.SoLuong = productData.SoLuong;
      if (productData.GiaSanPham !== undefined) updateData.GiaSanPham = productData.GiaSanPham;
      if (productData.HinhAnh !== undefined) updateData.HinhAnh = productData.HinhAnh;
      
      console.log('Final update data:', updateData);

      // Sử dụng raw query với định dạng ngày tháng đúng
      const sequelize = SanPham.sequelize;
      if (!sequelize) {
        throw new Error('Sequelize không được khởi tạo');
      }

      // Định dạng ngày tháng phù hợp với SQL Server
      const formattedDate = formatDateForSqlServer();
      
      // Tạo mảng các trường cần cập nhật
      const updateFields = [];
      const replacements: any = { id };
      
      // Thêm các trường cần cập nhật vào câu lệnh SQL
      if (updateData.TenSanPham !== undefined) {
        updateFields.push('[TenSanPham] = :tenSanPham');
        replacements.tenSanPham = updateData.TenSanPham;
      }
      
      if (updateData.MaDanhMuc !== undefined) {
        updateFields.push('[MaDanhMuc] = :maDanhMuc');
        replacements.maDanhMuc = updateData.MaDanhMuc;
      }
      
      if (updateData.MoTa !== undefined) {
        updateFields.push('[MoTa] = :moTa');
        replacements.moTa = updateData.MoTa;
      }
      
      if (updateData.SoLuong !== undefined) {
        updateFields.push('[SoLuong] = :soLuong');
        replacements.soLuong = updateData.SoLuong;
      }
      
      if (updateData.GiaSanPham !== undefined) {
        updateFields.push('[GiaSanPham] = :giaSanPham');
        replacements.giaSanPham = updateData.GiaSanPham;
      }
      
      if (updateData.HinhAnh !== undefined) {
        updateFields.push('[HinhAnh] = :hinhAnh');
        replacements.hinhAnh = updateData.HinhAnh;
      }
      
      // Thêm trường NgayCapNhat
      updateFields.push('[NgayCapNhat] = :ngayCapNhat');
      replacements.ngayCapNhat = formattedDate;
      
      // Tạo câu lệnh SQL với các tham số thay thế
      const sql = `UPDATE [SanPham] SET ${updateFields.join(', ')} WHERE [MaSanPham] = :id`;
      
      console.log('Executing SQL:', sql);
      console.log('With replacements:', replacements);
      
      await sequelize.query(sql, {
        replacements,
        type: QueryTypes.UPDATE
      });
      
      console.log('SQL query executed successfully');
      
      // Lấy sản phẩm đã cập nhật
      const updatedProduct = await SanPham.findByPk(id, {
        include: [{ model: DanhMuc, as: 'DanhMuc' }]
      });
      
      if (!updatedProduct) {
        console.log('Updated product not found');
        throw new Error('Không thể lấy sản phẩm đã cập nhật');
      }
      
      console.log('Product updated successfully');
      return updatedProduct;
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }

  public async deleteProduct(id: number) {
    try {
      const product = await SanPham.findByPk(id);
      
      if (!product) {
        throw new Error('Sản phẩm không tồn tại');
      }

      await product.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
} 