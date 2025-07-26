import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export interface OrderItemRequest {
  MaSanPham: number;
  SoLuong: number;
  DonGia: number;
  ThanhTien: number;
}

export interface OrderRequest {
  DiaChi: string;
  PhuongThucTT: string;
  items: OrderItemRequest[];
}

export interface OrderResponse {
  MaHoaDon: number;
  MaKhachHang: number;
  MaNhanVien?: number;
  NgayLap: string;
  TongTien: number;
  PhuongThucTT: string;
  DiaChi: string;
  TrangThai: string;
  KhachHang?: {
    MaKhachHang: number;
    TenKhachHang: string;
    SoDienThoai: string;
    DiaChi?: string;
  };
  NhanVien?: {
    MaNhanVien: number;
    TenNhanVien: string;
    SoDienThoai: string;
  };
  ChiTietHoaDons?: {
    MaChiTiet: number;
    MaHoaDon: number;
    MaSanPham: number;
    SoLuong: number;
    DonGia: number;
    ThanhTien: number;
    SanPham?: {
      MaSanPham: number;
      TenSanPham: string;
      GiaSanPham: number;
      HinhAnh?: string;
    };
  }[];
}

export const createOrder = async (orderData: OrderRequest): Promise<OrderResponse> => {
  const response = await api.post(API_ENDPOINTS.ORDER.CREATE, orderData);
  return response.data;
};

export const getMyOrders = async (): Promise<OrderResponse[]> => {
  try {
    console.log('Gọi API lấy đơn hàng của tôi');
    const userString = localStorage.getItem('user');
    if (!userString) {
      console.error('Không tìm thấy thông tin người dùng');
      return [];
    }
    const user = JSON.parse(userString);
    const customerId = user.MaKhachHang;
    if (!customerId) {
      console.error('Người dùng không có mã khách hàng');
      return [];
    }
    const url = API_ENDPOINTS.ORDER.GET_MY_ORDERS.replace('ME', customerId.toString());
    const response = await api.get(url);
    
    if (!response.data) {
      console.error('Không có dữ liệu đơn hàng');
      return [];
    }
    
    console.log(`Nhận được ${Array.isArray(response.data) ? response.data.length : 0} đơn hàng`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng của tôi:', error);
    throw error;
  }
};

export const getOrderById = async (id: number): Promise<OrderResponse> => {
  const userRole = localStorage.getItem('role');
  const url = userRole === '1' ? API_ENDPOINTS.ADMIN.ORDERS.GET_BY_ID(id) : API_ENDPOINTS.ORDER.GET_BY_ID(id);
  const response = await api.get(url);
  return response.data;
};

export const getAllOrders = async (page = 1, limit = 10): Promise<{
  total: number;
  totalPages: number;
  currentPage: number;
  orders: OrderResponse[];
}> => {
  const response = await api.get(`${API_ENDPOINTS.ADMIN.ORDERS.GET_ALL}?page=${page}&limit=${limit}`);
  return response.data;
};

export const updateOrderStatus = async (id: number, status: string): Promise<OrderResponse> => {
  const response = await api.put(API_ENDPOINTS.ADMIN.ORDERS.UPDATE_STATUS(id), { trangThai: status });
  return response.data;
}; 

export const getOrdersByCustomerId = async (customerId: number): Promise<OrderResponse[]> => {
  const response = await api.get(`${API_ENDPOINTS.ADMIN.ORDERS.GET_ALL}/by-customer/${customerId}`);
  return response.data;
};
