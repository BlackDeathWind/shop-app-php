import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export interface LoginRequest {
  SoDienThoai: string;
  MatKhau: string;
}

export interface RegisterRequest {
  TenKhachHang: string;
  SoDienThoai: string;
  MatKhau: string;
  DiaChi?: string;
}

export interface AuthResponse {
  message: string;
  accessToken?: string;
  user: any;
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
  // Nếu backend trả về accessToken thì lưu, nếu không chỉ lưu user
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    // ignore
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

// PHP backend không hỗ trợ refreshToken
export const refreshToken = async (): Promise<{ accessToken: string; expiresIn: number }> => {
  throw new Error('Not supported');
};

export const getCurrentUser = (): any => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

 