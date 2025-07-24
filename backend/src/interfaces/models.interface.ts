// Interface cho VaiTro
export interface IVaiTro {
  MaVaiTro: number;
  TenVaiTro: string;
}

// Interface cho NhanVien
export interface INhanVien {
  MaNhanVien?: number;
  MaVaiTro: number;
  TenNhanVien: string;
  SoDienThoai: string;
  MatKhau: string;
  DiaChi?: string;
}

// Interface cho KhachHang
export interface IKhachHang {
  MaKhachHang?: number;
  MaVaiTro: number;
  TenKhachHang: string;
  SoDienThoai: string;
  MatKhau: string;
  DiaChi?: string;
}

// Interface cho DanhMuc
export interface IDanhMuc {
  MaDanhMuc?: number;
  TenDanhMuc: string;
  HinhAnh?: string;
}

// Interface cho SanPham
export interface ISanPham {
  MaSanPham?: number;
  TenSanPham: string;
  MaDanhMuc: number;
  MoTa?: string;
  SoLuong: number;
  GiaSanPham: number;
  Ngaytao?: Date;
  NgayCapNhat?: Date;
  HinhAnh?: string;
}

// Interface cho HoaDon
export interface IHoaDon {
  MaHoaDon?: number;
  MaKhachHang: number;
  MaNhanVien?: number | null;
  NgayLap?: Date;
  TongTien: number;
  PhuongThucTT: string;
  DiaChi: string;
  TrangThai?: string;
}

// Interface cho ChiTietHoaDon
export interface IChiTietHoaDon {
  MaChiTiet?: number;
  MaHoaDon: number;
  MaSanPham: number;
  SoLuong: number;
  DonGia: number;
  ThanhTien: number;
} 