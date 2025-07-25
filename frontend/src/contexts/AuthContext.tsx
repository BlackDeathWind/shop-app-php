import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login as loginApi, register as registerApi, getCurrentUser, logout as logoutApi } from '../services/auth.service';
import type { LoginRequest, RegisterRequest } from '../services/auth.service';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Khởi tạo phiên làm việc từ localStorage khi load trang
  useEffect(() => {
    setLoading(true);
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await loginApi(data);
    setUser(response.user);
  };

  const register = async (data: RegisterRequest) => {
    const response = await registerApi(data);
    setUser(response.user);
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.MaVaiTro === 0;
  const isStaff = user?.MaVaiTro === 1;

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isStaff,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 