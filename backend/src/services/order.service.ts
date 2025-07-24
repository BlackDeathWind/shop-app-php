import { Transaction } from 'sequelize';
import { sequelize } from '../config/db.config';
import HoaDon from '../models/HoaDon.model';
import ChiTietHoaDon from '../models/ChiTietHoaDon.model';
import SanPham from '../models/SanPham.model';
import KhachHang from '../models/KhachHang.model';
import NhanVien from '../models/NhanVien.model';
import { IHoaDon } from '../interfaces/models.interface';
import { QueryTypes } from 'sequelize';

interface OrderItem {
  MaSanPham: number;
  SoLuong: number;
  DonGia: number;
  ThanhTien: number;
}

interface CreateOrderData {
  MaKhachHang: number;
  MaNhanVien?: number | null;
  PhuongThucTT: string;
  DiaChi: string;
  TongTien: number;
  items: OrderItem[];
}

interface InsertedOrder {
  MaHoaDon: number;
  MaKhachHang: number;
  MaNhanVien?: number | null;
  NgayLap: Date;
  TongTien: number;
  PhuongThucTT: string;
  DiaChi: string;
  TrangThai: string;
}

export default class OrderService {
  public async createOrder(orderData: CreateOrderData) {
    const t: Transaction = await sequelize.transaction();

    try {
      // Tạo hóa đơn sử dụng raw query
      const result = await sequelize.query(`
        INSERT INTO HoaDon (MaKhachHang, MaNhanVien, NgayLap, TongTien, PhuongThucTT, DiaChi, TrangThai)
        OUTPUT INSERTED.*
        VALUES (:makhachhang, :manhanvien, GETDATE(), :tongtien, :phuongthuctt, :diachi, N'Đã đặt hàng')
      `, {
        replacements: {
          makhachhang: orderData.MaKhachHang,
          manhanvien: orderData.MaNhanVien || null,
          tongtien: orderData.TongTien,
          phuongthuctt: orderData.PhuongThucTT,
          diachi: orderData.DiaChi
        },
        type: QueryTypes.INSERT,
        transaction: t
      });
      
      // Kiểm tra kết quả trả về và lấy MaHoaDon
      const insertedRows = result[0] as unknown as any[];
      
      if (!Array.isArray(insertedRows) || insertedRows.length === 0) {
        throw new Error('Không thể tạo hóa đơn: Không có dữ liệu trả về');
      }
      
      const maHoaDon = insertedRows[0].MaHoaDon;
      
      if (!maHoaDon) {
        throw new Error('Không thể tạo hóa đơn: Không có mã hóa đơn');
      }
      
      // Xử lý từng sản phẩm trong đơn hàng
      for (const item of orderData.items) {
        // Kiểm tra số lượng sản phẩm
        const productResult = await sequelize.query(`
          SELECT * FROM SanPham WHERE MaSanPham = :masanpham
        `, {
          replacements: {
            masanpham: item.MaSanPham
          },
          type: QueryTypes.SELECT,
          transaction: t
        });
        
        const productRows = productResult as unknown as any[];
        
        if (!Array.isArray(productRows) || productRows.length === 0) {
          throw new Error(`Sản phẩm với mã ${item.MaSanPham} không tồn tại`);
        }
        
        const product = productRows[0];
        if (product.SoLuong < item.SoLuong) {
          throw new Error(`Sản phẩm ${product.TenSanPham} không đủ số lượng`);
        }

        // Thêm chi tiết hóa đơn
        await sequelize.query(`
          INSERT INTO ChiTietHoaDon (MaHoaDon, MaSanPham, SoLuong, DonGia, ThanhTien)
          VALUES (:mahoadon, :masanpham, :soluong, :dongia, :thanhtien)
        `, {
          replacements: {
            mahoadon: maHoaDon,
            masanpham: item.MaSanPham,
            soluong: item.SoLuong,
            dongia: item.DonGia,
            thanhtien: item.ThanhTien
          },
          type: QueryTypes.INSERT,
          transaction: t
        });

        // Cập nhật số lượng sản phẩm
        await sequelize.query(`
          UPDATE SanPham
          SET SoLuong = SoLuong - :soluong
          WHERE MaSanPham = :masanpham
        `, {
          replacements: {
            soluong: item.SoLuong,
            masanpham: item.MaSanPham
          },
          type: QueryTypes.UPDATE,
          transaction: t
        });
      }

      await t.commit();
      
      // Trả về đầy đủ thông tin hóa đơn
      const order = await HoaDon.findByPk(maHoaDon);
      return order;
    } catch (error) {
      try {
        await t.rollback();
      } catch (rollbackError) {
        console.error('Lỗi khi rollback:', rollbackError);
      }
      throw error;
    }
  }

  public async getOrdersByCustomerId(customerId: number) {
    try {
      // Sử dụng raw query để đảm bảo lấy chính xác dữ liệu từ SQL Server
      const sql = `
        SELECT 
          hd.MaHoaDon, hd.MaKhachHang, hd.MaNhanVien, hd.NgayLap, 
          hd.TongTien, hd.PhuongThucTT, hd.DiaChi, hd.TrangThai
        FROM 
          HoaDon hd
        WHERE 
          hd.MaKhachHang = :customerId
        ORDER BY 
          hd.NgayLap DESC
      `;
      
      const orders = await sequelize.query(sql, {
        replacements: { customerId },
        type: QueryTypes.SELECT
      });
      
      // Nếu không có đơn hàng, trả về mảng rỗng
      if (!Array.isArray(orders) || orders.length === 0) {
        return [];
      }
      
      // Lấy thông tin chi tiết cho từng đơn hàng
      const ordersWithDetails = await Promise.all(orders.map(async (order: any) => {
        const detailsSql = `
          SELECT 
            ct.MaChiTiet, ct.MaHoaDon, ct.MaSanPham, ct.SoLuong, 
            ct.DonGia, ct.ThanhTien,
            sp.TenSanPham, sp.HinhAnh, sp.GiaSanPham
          FROM 
            ChiTietHoaDon ct
          JOIN 
            SanPham sp ON ct.MaSanPham = sp.MaSanPham
          WHERE 
            ct.MaHoaDon = :orderId
        `;
        
        const details = await sequelize.query(detailsSql, {
          replacements: { orderId: order.MaHoaDon },
          type: QueryTypes.SELECT
        });
        
        // Định dạng lại chi tiết để phù hợp với cấu trúc dữ liệu cần thiết
        const formattedDetails = details.map((detail: any) => ({
          MaChiTiet: detail.MaChiTiet,
          MaHoaDon: detail.MaHoaDon,
          MaSanPham: detail.MaSanPham,
          SoLuong: detail.SoLuong,
          DonGia: detail.DonGia,
          ThanhTien: detail.ThanhTien,
          SanPham: {
            MaSanPham: detail.MaSanPham,
            TenSanPham: detail.TenSanPham,
            GiaSanPham: detail.GiaSanPham,
            HinhAnh: detail.HinhAnh
          }
        }));
        
        return {
          ...order,
          ChiTietHoaDons: formattedDetails
        };
      }));
      
      return ordersWithDetails;
    } catch (error) {
      console.error('Error in getOrdersByCustomerId:', error);
      throw error;
    }
  }

  public async getOrderById(orderId: number) {
    try {
      const order = await HoaDon.findByPk(orderId, {
        include: [
          {
            model: ChiTietHoaDon,
            as: 'ChiTietHoaDons',
            include: [{ model: SanPham, as: 'SanPham' }]
          },
          { model: KhachHang, as: 'KhachHang' },
          { model: NhanVien, as: 'NhanVien' }
        ]
      });

      if (!order) {
        throw new Error('Đơn hàng không tồn tại');
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  public async getAllOrders(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { count, rows } = await HoaDon.findAndCountAll({
        include: [
          { model: KhachHang, as: 'KhachHang' },
          { model: NhanVien, as: 'NhanVien' }
        ],
        limit,
        offset,
        order: [['NgayLap', 'DESC']]
      });

      return {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        orders: rows
      };
    } catch (error) {
      throw error;
    }
  }

  public async updateOrderStatus(orderId: number, trangThai: string) {
    try {
      const order = await HoaDon.findByPk(orderId);
      
      if (!order) {
        throw new Error('Đơn hàng không tồn tại');
      }

      // Kiểm tra luồng chuyển trạng thái hợp lệ
      const validTransitions: { [key: string]: string[] } = {
        'Đã đặt hàng': ['Đang xử lý', 'Đã hủy'],
        'Đang xử lý': ['Đang giao hàng', 'Đã hủy'],
        'Đang giao hàng': ['Đã giao hàng', 'Đã hủy'],
        'Đã giao hàng': [],
        'Đã hủy': []
      };

      const currentStatus = order.TrangThai;
      if (!currentStatus) {
        throw new Error('Trạng thái hiện tại của đơn hàng không hợp lệ');
      }
      const allowedNextStatuses = validTransitions[currentStatus] || [];

      if (!allowedNextStatuses.includes(trangThai)) {
        throw new Error(`Không thể chuyển trạng thái từ "${currentStatus}" sang "${trangThai}"`);
      }

      await order.update({ TrangThai: trangThai });
      return order;
    } catch (error) {
      throw error;
    }
  }
} 