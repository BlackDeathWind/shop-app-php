import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { ChevronRight, User, Save, Loader, AlertTriangle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants/api';

interface ProfileForm {
  TenKhachHang: string;
  SoDienThoai: string;
  DiaChi: string;
  MatKhauCu?: string;
  MatKhauMoi?: string;
  XacNhanMatKhau?: string;
}

const Account = () => {
  const [formData, setFormData] = useState<ProfileForm>({
    TenKhachHang: '',
    SoDienThoai: '',
    DiaChi: '',
    MatKhauCu: '',
    MatKhauMoi: '',
    XacNhanMatKhau: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'thongTin' | 'matKhau'>('thongTin');
  
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/account', message: 'Vui lòng đăng nhập để xem tài khoản' } });
      return;
    }

    if (user) {
      setFormData({
        TenKhachHang: user.TenKhachHang || user.TenNhanVien || '',
        SoDienThoai: user.SoDienThoai || '',
        DiaChi: user.DiaChi || '',
        MatKhauCu: '',
        MatKhauMoi: '',
        XacNhanMatKhau: '',
      });
      setLoading(false);
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccessMessage(null);
      setSubmitting(true);

      // Gửi yêu cầu cập nhật thông tin cá nhân
      const payload: any = {
        SoDienThoai: formData.SoDienThoai,
        DiaChi: formData.DiaChi,
      };
      if (user?.MaVaiTro === 2) {
        payload['TenKhachHang'] = formData.TenKhachHang;
      } else {
        payload['TenNhanVien'] = formData.TenKhachHang;
      }
      await api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, payload);

      setSuccessMessage('Cập nhật thông tin thành công!');
      addToast('Cập nhật thông tin tài khoản thành công!', 'success');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.MatKhauMoi !== formData.XacNhanMatKhau) {
      setError('Xác nhận mật khẩu không khớp');
      addToast('Xác nhận mật khẩu không khớp', 'error');
      return;
    }
    
    try {
      setError(null);
      setSuccessMessage(null);
      setSubmitting(true);

      // Gửi yêu cầu đổi mật khẩu
      await api.put(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
        MatKhauCu: formData.MatKhauCu,
        MatKhauMoi: formData.MatKhauMoi,
      });

      setSuccessMessage('Đổi mật khẩu thành công!');
      addToast('Đổi mật khẩu thành công!', 'success');
      setFormData(prev => ({
        ...prev,
        MatKhauCu: '',
        MatKhauMoi: '',
        XacNhanMatKhau: '',
      }));
    } catch (err: any) {
      console.error('Error changing password:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      addToast('Đăng xuất thành công!', 'success');
      navigate('/login');
    } catch (error) {
      addToast('Có lỗi xảy ra khi đăng xuất.', 'error');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-20">
          <Loader className="animate-spin h-8 w-8 text-pink-500" />
          <span className="ml-2">Đang tải thông tin tài khoản...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4 text-center">Tài Khoản</h1>
            <div className="flex items-center text-sm">
              <Link to="/" className="hover:underline">Trang Chủ</Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span>Tài Khoản</span>
            </div>
          </div>
        </div>
      </section>

      {/* Account Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                    <User className="h-8 w-8 text-pink-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{formData.TenKhachHang}</p>
                    <p className="text-gray-600">{formData.SoDienThoai}</p>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <button 
                    className={`w-full text-left px-4 py-2 rounded-md transition ${
                      activeTab === 'thongTin' 
                        ? 'bg-pink-500 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('thongTin')}
                  >
                    Thông tin tài khoản
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded-md transition ${
                      activeTab === 'matKhau' 
                        ? 'bg-pink-500 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('matKhau')}
                  >
                    Đổi mật khẩu
                  </button>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 rounded-md hover:bg-gray-100 transition"
                  >
                    Đơn hàng của bạn
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 rounded-md text-red-500 hover:bg-red-50 transition"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:w-3/4">
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Notifications */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                
                {successMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                  </div>
                )}

                {/* Info Tab */}
                {activeTab === 'thongTin' && (
                  <>
                    <h2 className="text-xl font-semibold mb-6">Thông tin tài khoản</h2>
                    
                    <form onSubmit={handleUpdateProfile}>
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Họ và tên
                          </label>
                          <input
                            type="text"
                            name="TenKhachHang"
                            value={formData.TenKhachHang}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Số điện thoại
                          </label>
                          <input
                            type="tel"
                            name="SoDienThoai"
                            value={formData.SoDienThoai}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Địa chỉ
                          </label>
                          <textarea
                            name="DiaChi"
                            value={formData.DiaChi}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            rows={3}
                            required
                          ></textarea>
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`flex items-center px-6 py-2 rounded-md text-white transition ${
                          submitting 
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-pink-500 hover:bg-pink-600'
                        }`}
                      >
                        {submitting ? (
                          <>
                            <Loader className="animate-spin h-4 w-4 mr-2" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Lưu thông tin
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}

                {/* Password Tab */}
                {activeTab === 'matKhau' && (
                  <>
                    <h2 className="text-xl font-semibold mb-6">Đổi mật khẩu</h2>
                    
                    <form onSubmit={handleUpdatePassword}>
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Mật khẩu hiện tại
                          </label>
                          <input
                            type="text"
                            name="MatKhauCu"
                            value={formData.MatKhauCu}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Mật khẩu mới
                          </label>
                          <input
                            type="text"
                            name="MatKhauMoi"
                            value={formData.MatKhauMoi}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Xác nhận mật khẩu mới
                          </label>
                          <input
                            type="password"
                            name="XacNhanMatKhau"
                            value={formData.XacNhanMatKhau}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`flex items-center px-6 py-2 rounded-md text-white transition ${
                          submitting 
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-pink-500 hover:bg-pink-600'
                        }`}
                      >
                        {submitting ? (
                          <>
                            <Loader className="animate-spin h-4 w-4 mr-2" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Lưu mật khẩu
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Account; 