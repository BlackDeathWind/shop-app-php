import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export interface ProfileUpdateRequest {
  TenKhachHang?: string;
  TenNhanVien?: string;
  SoDienThoai?: string;
  DiaChi?: string;
}

export interface PasswordChangeRequest {
  MatKhauCu: string;
  MatKhauMoi: string;
  XacNhanMatKhau: string;
}

export interface UserResponse {
  MaKhachHang?: number;
  MaNhanVien?: number;
  TenKhachHang?: string;
  TenNhanVien?: string;
  SoDienThoai: string;
  DiaChi?: string;
  MaVaiTro: number;
  VaiTro?: {
    MaVaiTro: number;
    TenVaiTro: string;
  };
}

export const getUserProfile = async (): Promise<UserResponse> => {
  const response = await api.get(API_ENDPOINTS.USER.GET_PROFILE);
  return response.data;
};

export const updateUserProfile = async (profileData: ProfileUpdateRequest): Promise<UserResponse> => {
  const response = await api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData);
  return response.data;
};

export const changePassword = async (passwordData: PasswordChangeRequest): Promise<{ message: string }> => {
  const response = await api.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, passwordData);
  return response.data;
};

// Admin functions
export const getAllCustomers = async (page = 1, limit = 10): Promise<{
  total: number;
  totalPages: number;
  currentPage: number;
  users: UserResponse[];
}> => {
  const response = await api.get(`${API_ENDPOINTS.ADMIN.USERS.GET_ALL_CUSTOMERS}?page=${page}&limit=${limit}`);
  return { ...response.data, users: response.data.customers };
};

export const getAllStaff = async (page = 1, limit = 10): Promise<{
  total: number;
  totalPages: number;
  currentPage: number;
  users: UserResponse[];
}> => {
  const response = await api.get(`${API_ENDPOINTS.ADMIN.USERS.GET_ALL_STAFF}?page=${page}&limit=${limit}`);
  return { ...response.data, users: response.data.staff };
};

export const getUserById = async (id: number): Promise<UserResponse> => {
  const response = await api.get(API_ENDPOINTS.ADMIN.USERS.GET_BY_ID(id));
  return response.data;
};

export const createUser = async (userData: {
  TenKhachHang?: string;
  TenNhanVien?: string;
  SoDienThoai: string;
  MatKhau: string;
  DiaChi?: string;
  MaVaiTro: number;
}): Promise<UserResponse> => {
  const response = await api.post(API_ENDPOINTS.ADMIN.USERS.CREATE, userData);
  return response.data;
};

export const updateUser = async (id: number, userData: {
  TenKhachHang?: string;
  TenNhanVien?: string;
  SoDienThoai?: string;
  DiaChi?: string;
}): Promise<UserResponse> => {
  const response = await api.put(API_ENDPOINTS.ADMIN.USERS.UPDATE(id), userData);
  return response.data;
};

// export const deleteUser = async (id: number): Promise<void> => {
//   await api.delete(API_ENDPOINTS.ADMIN.USERS.DELETE(id));
// };

// export const changeUserRole = async (id: number, roleId: number): Promise<UserResponse> => {
//   const response = await api.put(API_ENDPOINTS.ADMIN.USERS.CHANGE_ROLE(id), { MaVaiTro: roleId });
//   return response.data;
// }; 