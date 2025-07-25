import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export interface ProductResponse {
  MaSanPham: number;
  TenSanPham: string;
  MaDanhMuc: number;
  MoTa?: string;
  SoLuong: number;
  GiaSanPham: number;
  HinhAnh?: string;
  Ngaytao?: string;
  NgayCapNhat?: string;
  DanhMuc?: {
    MaDanhMuc: number;
    TenDanhMuc: string;
  };
}

export interface ProductListResponse {
  total: number;
  totalPages: number;
  currentPage: number;
  products: ProductResponse[];
}

export const getAllProducts = async (page = 1, limit = 10): Promise<ProductListResponse> => {
  const response = await api.get(`${API_ENDPOINTS.PRODUCT.GET_ALL}?page=${page}&limit=${limit}`);
  return response.data;
};

export const getProductById = async (id: number): Promise<ProductResponse> => {
  const response = await api.get(API_ENDPOINTS.PRODUCT.GET_BY_ID(id));
  return response.data;
};

export const getProductsByCategory = async (categoryId: number, page = 1, limit = 10): Promise<ProductListResponse> => {
  // PHP backend: filter trên frontend nếu không có endpoint riêng
  const response = await api.get(`${API_ENDPOINTS.PRODUCT.GET_ALL}?page=${page}&limit=${limit}`);
  const all = response.data.products.filter((p: ProductResponse) => p.MaDanhMuc === categoryId);
  return {
    total: all.length,
    totalPages: Math.ceil(all.length / limit),
    currentPage: page,
    products: all.slice((page - 1) * limit, page * limit)
  };
};

export const searchProducts = async (query: string, page = 1, limit = 10): Promise<ProductListResponse> => {
  // PHP backend: filter trên frontend nếu không có endpoint riêng
  const response = await api.get(`${API_ENDPOINTS.PRODUCT.GET_ALL}?page=1&limit=1000`); // lấy nhiều để filter
  const all = response.data.products.filter((p: ProductResponse) =>
    p.TenSanPham.toLowerCase().includes(query.toLowerCase()) ||
    (p.MoTa && p.MoTa.toLowerCase().includes(query.toLowerCase()))
  );
  return {
    total: all.length,
    totalPages: Math.ceil(all.length / limit),
    currentPage: page,
    products: all.slice((page - 1) * limit, page * limit)
  };
};

// Admin functions
export const createProduct = async (productData: FormData): Promise<ProductResponse> => {
  const response = await api.post(API_ENDPOINTS.PRODUCT.CREATE, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProduct = async (id: number, productData: FormData): Promise<ProductResponse> => {
  const response = await api.put(API_ENDPOINTS.PRODUCT.UPDATE(id), productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.product || response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(API_ENDPOINTS.PRODUCT.DELETE(id));
}; 