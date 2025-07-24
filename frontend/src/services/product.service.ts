import api from './api';
import { API_ENDPOINTS, API_BASE_URL } from '../constants/api';

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
  const response = await api.get(`${API_ENDPOINTS.PRODUCT.GET_BY_CATEGORY(categoryId)}?page=${page}&limit=${limit}`);
  return response.data;
};

export const searchProducts = async (query: string, page = 1, limit = 10): Promise<ProductListResponse> => {
  const response = await api.get(`${API_ENDPOINTS.PRODUCT.SEARCH}?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  return response.data;
};

// Admin functions
export const createProduct = async (productData: FormData): Promise<ProductResponse> => {
  const response = await api.post(API_ENDPOINTS.ADMIN.PRODUCTS.CREATE, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProduct = async (id: number, productData: FormData): Promise<ProductResponse> => {
  console.log('Sending update request to:', API_ENDPOINTS.PRODUCT.UPDATE(id));
  const response = await api.put(API_ENDPOINTS.PRODUCT.UPDATE(id), productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.product || response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(API_ENDPOINTS.ADMIN.PRODUCTS.DELETE(id));
}; 