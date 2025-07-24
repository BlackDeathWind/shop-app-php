import KhachHang from '../models/KhachHang.model';
import NhanVien from '../models/NhanVien.model';
import SanPham from '../models/SanPham.model';
import DanhMuc from '../models/DanhMuc.model';
import HoaDon from '../models/HoaDon.model';
import VaiTro from '../models/VaiTro.model';
import { Op } from 'sequelize';
import { sequelize } from '../config/db.config';
import bcrypt from 'bcrypt';

export default class AdminService {
  /**
   * Lấy thông tin tổng quan cho dashboard
   */
  public async getDashboardSummary() {
    try {
      const totalProducts = await SanPham.count();
      const totalCategories = await DanhMuc.count();
      const totalCustomers = await KhachHang.count();
      const totalOrders = await HoaDon.count();
      
      // Tính tổng doanh thu
      const revenue = await HoaDon.sum('TongTien', {
        where: {
          TrangThai: {
            [Op.ne]: 'Đã hủy'
          }
        }
      });

      return {
        totalProducts,
        totalCategories,
        totalCustomers,
        totalOrders,
        revenue: revenue || 0
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Quản lý khách hàng
   */
  public async getAllCustomers(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { count, rows } = await KhachHang.findAndCountAll({
        attributes: { 
          exclude: ['MatKhau'] 
        },
        include: [{ 
          model: VaiTro, 
          as: 'VaiTro'
        }],
        limit,
        offset,
        order: [['MaKhachHang', 'ASC']]
      });

      return {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        customers: rows
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Quản lý nhân viên
   */
  public async getAllStaff(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { count, rows } = await NhanVien.findAndCountAll({
        attributes: { 
          exclude: ['MatKhau'] 
        },
        include: [{ 
          model: VaiTro, 
          as: 'VaiTro'
        }],
        limit,
        offset,
        order: [['MaNhanVien', 'ASC']]
      });

      return {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        staff: rows
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy thông tin người dùng theo ID
   */
  public async getUserById(id: number, role: number) {
    try {
      let user;

      if (role === 2) {
        // Khách hàng
        user = await KhachHang.findByPk(id, {
          attributes: { exclude: ['MatKhau'] },
          include: [{ model: VaiTro, as: 'VaiTro' }]
        });
      } else {
        // Nhân viên hoặc Admin
        user = await NhanVien.findByPk(id, {
          attributes: { exclude: ['MatKhau'] },
          include: [{ model: VaiTro, as: 'VaiTro' }]
        });
      }

      if (!user) {
        throw new Error('Người dùng không tồn tại');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo người dùng mới
   */
  public async createUser(userData: any) {
    const t = await sequelize.transaction();
    
    try {
      const { MaVaiTro, MatKhau, SoDienThoai, ...rest } = userData;
      
      // Kiểm tra số điện thoại đã tồn tại chưa
      let existingUser;
      if (MaVaiTro === 2) {
        existingUser = await KhachHang.findOne({ where: { SoDienThoai } });
      } else {
        existingUser = await NhanVien.findOne({ where: { SoDienThoai } });
      }
      if (existingUser) {
        throw new Error('Số điện thoại đã được sử dụng');
      }
      
      let newUser;
      
      if (MaVaiTro === 2) {
        // Tạo khách hàng
        newUser = await KhachHang.create({
          ...rest,
          MaVaiTro,
          SoDienThoai,
          MatKhau // plain text, model sẽ tự hash
        }, { transaction: t });
      } else {
        // Tạo nhân viên hoặc admin
        newUser = await NhanVien.create({
          ...rest,
          MaVaiTro,
          SoDienThoai,
          MatKhau // plain text, model sẽ tự hash
        }, { transaction: t });
      }
      
      await t.commit();
      
      // Trả về người dùng không kèm mật khẩu
      const userObj = newUser.get({ plain: true });
      const { MatKhau: _, ...userWithoutPassword } = userObj;
      
      return userWithoutPassword;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Cập nhật thông tin người dùng
   */
  public async updateUser(id: number, role: number, userData: any) {
    try {
      // Không cho phép cập nhật mật khẩu qua API này
      const { MatKhau, ...updateData } = userData;
      
      if (role === 2) {
        // Khách hàng
        const user = await KhachHang.findByPk(id);
        
        if (!user) {
          throw new Error('Người dùng không tồn tại');
        }
        
        await user.update(updateData);
        
        // Trả về user không kèm mật khẩu
        const userObj = user.get({ plain: true });
        const { MatKhau: _, ...userWithoutPassword } = userObj;
        return userWithoutPassword;
      } else {
        // Nhân viên hoặc Admin
        const user = await NhanVien.findByPk(id);
        
        if (!user) {
          throw new Error('Người dùng không tồn tại');
        }
        
        await user.update(updateData);
        
        // Trả về user không kèm mật khẩu
        const userObj = user.get({ plain: true });
        const { MatKhau: _, ...userWithoutPassword } = userObj;
        return userWithoutPassword;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa người dùng
   */
  public async deleteUser(id: number, role: number) {
    try {
      if (role === 2) {
        // Khách hàng
        const user = await KhachHang.findByPk(id);
        
        if (!user) {
          throw new Error('Người dùng không tồn tại');
        }
        
        await user.destroy();
      } else {
        // Nhân viên hoặc Admin
        const user = await NhanVien.findByPk(id);
        
        if (!user) {
          throw new Error('Người dùng không tồn tại');
        }
        
        if (user.MaVaiTro === 0) {
          // Kiểm tra xem còn admin khác không
          const adminCount = await NhanVien.count({
            where: { MaVaiTro: 0 }
          });
          
          if (adminCount <= 1) {
            throw new Error('Không thể xóa admin duy nhất');
          }
        }
        
        await user.destroy();
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Thay đổi vai trò người dùng
   */
  public async changeUserRole(id: number, role: number, newRole: number) {
    try {
      if (role === 2) {
        // Khách hàng
        const user = await KhachHang.findByPk(id);
        
        if (!user) {
          throw new Error('Người dùng không tồn tại');
        }
        
        await user.update({ MaVaiTro: newRole });
      } else {
        // Nhân viên hoặc Admin
        const user = await NhanVien.findByPk(id);
        
        if (!user) {
          throw new Error('Người dùng không tồn tại');
        }
        
        // Kiểm tra nếu là admin cuối cùng
        if (user.MaVaiTro === 0 && newRole !== 0) {
          const adminCount = await NhanVien.count({
            where: { MaVaiTro: 0 }
          });
          
          if (adminCount <= 1) {
            throw new Error('Không thể thay đổi vai trò của admin duy nhất');
          }
        }
        
        await user.update({ MaVaiTro: newRole });
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }
} 