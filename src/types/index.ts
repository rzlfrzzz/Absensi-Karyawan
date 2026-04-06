export interface Karyawan {
  id: string;
  nama: string;
  pin: string;
  shift: string; // Flexible shift name
  jabatan: string;
  gaji_override?: number; // Optional per-karyawan gaji
  created_at?: string;
}

export interface AttendanceLog {
  id: string;
  karyawan_id: string;
  nama: string;
  tipe: 'MASUK' | 'PULANG';
  jam: string;
  status: string;
  foto_url: string;
  jabatan: string;
  created_at: string;
}

export interface Settings {
  id: string;
  jam_masuk_siang: string;
  jam_pulang_siang: string;
  jam_masuk_malam: string;
  jam_pulang_malam: string;
}

export type LanguageCode = 'ID' | 'CN';

export interface AttendanceFormData {
  pin: string;
  settings: Settings | null;
  loading: boolean;
  videoStream: MediaStream | null;
}

// Auth Types
export type UserRole = 'super_admin' | 'hr_admin' | 'manager' | 'employee';

export interface AdminUser {
  id?: string;
  email: string;
  password?: string;
  nama_lengkap: string;
  role: UserRole;
  karyawan_id?: string;
  manager_id?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

export interface AuthSession {
  user: AdminUser;
  token: string;
  login_time: number;
  expire_time: number;
}

export interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  getSessionInfo: () => { user: AdminUser; remaining_minutes: number } | null;
}

// ============================================
// SETTINGS TYPES (FASE 2)
// ============================================

export interface ShiftSettings {
  id: string;
  nama_shift: string; // "Siang", "Malam", "Custom Shift", dll
  jam_masuk: string; // "08:00"
  jam_pulang: string; // "17:00"
  tolerance_menit: number; // 15 menit
  is_active: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string; // Admin yang update
}

export interface GajiSettingPerJabatan {
  id: string;
  jabatan: string;
  gaji_pokok: number;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface BonusDeductionRules {
  id: string;
  // Bonus On-time
  bonus_ontime_tipe: 'per_hari' | 'per_bulan';
  bonus_ontime_jumlah: number;
  // Potongan Terlambat
  potongan_terlambat_tipe: 'per_menit' | 'per_15menit' | 'per_jam' | 'flat';
  potongan_terlambat_jumlah: number;
  // Potongan Absent
  potongan_absent_tipe: 'per_hari' | 'flat';
  potongan_absent_jumlah: number;
  // Early Checkout
  early_checkout_allowed: boolean;
  bonus_early_checkout?: number;
  // Meta
  updated_at: string;
  updated_by?: string;
}

export interface Holiday {
  id: string;
  tanggal: string; // "2024-12-25"
  nama: string; // "Natal"
  jenis: 'nasional' | 'perusahaan' | 'custom';
  is_paid_leave: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface CompanySettings {
  id: string;
  nama_perusahaan: string;
  alamat: string;
  phone: string;
  email: string;
  // Finance
  currency: string; // "IDR"
  fiscal_year_start: number; // 1-12
  // Work Rules
  max_terlambat_per_bulan?: number;
  max_absent_per_bulan?: number;
  // Meta
  updated_at: string;
  updated_by?: string;
}
