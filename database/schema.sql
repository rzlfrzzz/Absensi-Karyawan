-- PHASE 4: Database Schema untuk Digital Absensi System
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. TABLE: users (Authentication + Admin)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nama_lengkap VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'backoffice')),
  shift VARCHAR(50),
  jabatan VARCHAR(100),
  active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. TABLE: karyawan (Employee Master Data)
-- ============================================
CREATE TABLE IF NOT EXISTS karyawan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) NOT NULL,
  pin VARCHAR(4) NOT NULL UNIQUE,
  jabatan VARCHAR(100) NOT NULL,
  shift VARCHAR(50) NOT NULL,
  gaji_override INTEGER,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. TABLE: logs_absensi (Attendance Logs)
-- ============================================
CREATE TABLE IF NOT EXISTS logs_absensi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  karyawan_id UUID NOT NULL REFERENCES karyawan(id) ON DELETE CASCADE,
  tipe VARCHAR(50) NOT NULL CHECK (tipe IN ('MASUK', 'PULANG')),
  jam TIME NOT NULL,
  status VARCHAR(100),
  foto_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add computed columns for convenience
ALTER TABLE logs_absensi ADD COLUMN IF NOT EXISTS
  nama VARCHAR(255) GENERATED ALWAYS AS (
    SELECT nama FROM karyawan WHERE karyawan.id = logs_absensi.karyawan_id
  ) STORED;

ALTER TABLE logs_absensi ADD COLUMN IF NOT EXISTS
  jabatan VARCHAR(100) GENERATED ALWAYS AS (
    SELECT jabatan FROM karyawan WHERE karyawan.id = logs_absensi.karyawan_id
  ) STORED;

-- ============================================
-- 4. TABLE: shift_settings
-- ============================================
CREATE TABLE IF NOT EXISTS shift_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(100) NOT NULL UNIQUE,
  jam_masuk TIME NOT NULL,
  jam_pulang TIME NOT NULL,
  tolerance INTEGER NOT NULL DEFAULT 5,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. TABLE: gaji_settings
-- ============================================
CREATE TABLE IF NOT EXISTS gaji_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jabatan VARCHAR(100) NOT NULL UNIQUE,
  gaji_pokok INTEGER NOT NULL,
  keterangan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. TABLE: bonus_rules
-- ============================================
CREATE TABLE IF NOT EXISTS bonus_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipe VARCHAR(100) NOT NULL UNIQUE,
  jumlah INTEGER NOT NULL,
  frequency VARCHAR(50) NOT NULL CHECK (frequency IN ('per_hari', 'per_bulan')),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. TABLE: deduction_rules
-- ============================================
CREATE TABLE IF NOT EXISTS deduction_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipe VARCHAR(100) NOT NULL UNIQUE,
  jumlah INTEGER NOT NULL,
  tipe_perhitungan VARCHAR(50) NOT NULL CHECK (
    tipe_perhitungan IN ('per_menit', 'per_15min', 'per_jam', 'flat')
  ),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. TABLE: holiday_calendar
-- ============================================
CREATE TABLE IF NOT EXISTS holiday_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal DATE NOT NULL UNIQUE,
  nama VARCHAR(255) NOT NULL,
  tipe VARCHAR(50) NOT NULL CHECK (tipe IN ('national', 'company', 'custom')),
  paid_leave BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CREATE INDEXES (Performance)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_logs_karyawan_id ON logs_absensi(karyawan_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs_absensi(created_at);
CREATE INDEX IF NOT EXISTS idx_logs_tipe ON logs_absensi(tipe);
CREATE INDEX IF NOT EXISTS idx_karyawan_jabatan ON karyawan(jabatan);
CREATE INDEX IF NOT EXISTS idx_karyawan_shift ON karyawan(shift);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_holiday_tanggal ON holiday_calendar(tanggal);

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default shifts
INSERT INTO shift_settings (nama, jam_masuk, jam_pulang, tolerance) VALUES
  ('Shift Siang', '08:00', '17:00', 5),
  ('Shift Malam', '17:00', '02:00', 5)
ON CONFLICT DO NOTHING;

-- Insert default positions with salaries
INSERT INTO gaji_settings (jabatan, gaji_pokok) VALUES
  ('HRD', 8000000),
  ('Supervisor', 6500000),
  ('Admin', 5500000),
  ('Penjahit', 4500000),
  ('Helper', 3500000),
  ('Picker', 3500000),
  ('Packing', 3500000)
ON CONFLICT DO NOTHING;

-- Insert bonus rules
INSERT INTO bonus_rules (tipe, jumlah, frequency) VALUES
  ('on_time', 50000, 'per_hari'),
  ('early_checkout', 25000, 'per_hari')
ON CONFLICT DO NOTHING;

-- Insert deduction rules
INSERT INTO deduction_rules (tipe, jumlah, tipe_perhitungan) VALUES
  ('late', 10000, 'per_15min'),
  ('absent', 100000, 'flat'),
  ('early_pulang', 25000, 'flat')
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA (Test Employees)
-- ============================================
INSERT INTO karyawan (nama, pin, jabatan, shift) VALUES
  ('Ahmad Budi', '1111', 'HRD', 'Shift Siang'),
  ('Siti Nurhaliza', '2222', 'Supervisor', 'Shift Siang'),
  ('Budi Santoso', '3333', 'Penjahit', 'Shift Siang'),
  ('Dina Putri', '4444', 'Helper', 'Shift Malam'),
  ('Rudi Haryanto', '5555', 'Picker', 'Shift Siang'),
  ('Ani Wijaya', '6666', 'Packing', 'Shift Malam'),
  ('Bambang Setiawan', '7777', 'Admin', 'Shift Siang'),
  ('Citra Dewi', '8888', 'Penjahit', 'Shift Malam'),
  ('Eka Prasetya', '9999', 'Helper', 'Shift Siang'),
  ('Fiona Permata', '1010', 'Picker', 'Shift Malam')
ON CONFLICT DO NOTHING;

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE karyawan ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_absensi ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaji_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE deduction_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE holiday_calendar ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - Public Access (untuk development)
-- Catatan: Di production, tighten ini!
-- ============================================

-- Users: Admin only
CREATE POLICY "Users - Admin only read" ON users
  FOR SELECT USING (TRUE);

CREATE POLICY "Users - Admin only insert" ON users
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users - Admin only update" ON users
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- Karyawan: Everyone can read
CREATE POLICY "Karyawan - Public read" ON karyawan
  FOR SELECT USING (TRUE);

CREATE POLICY "Karyawan - Admin insert/update" ON karyawan
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Karyawan - Admin update" ON karyawan
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- Logs: Everyone can read/insert
CREATE POLICY "Logs - Public read" ON logs_absensi
  FOR SELECT USING (TRUE);

CREATE POLICY "Logs - Public insert" ON logs_absensi
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Logs - Admin delete" ON logs_absensi
  FOR DELETE USING (TRUE);

-- Settings: Everyone can read
CREATE POLICY "Shift settings - Public read" ON shift_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "Shift settings - Admin modify" ON shift_settings
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Shift settings - Admin update" ON shift_settings
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- Gaji: Everyone can read
CREATE POLICY "Gaji settings - Public read" ON gaji_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "Gaji settings - Admin modify" ON gaji_settings
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Gaji settings - Admin update" ON gaji_settings
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- Bonus: Everyone can read
CREATE POLICY "Bonus rules - Public read" ON bonus_rules
  FOR SELECT USING (TRUE);

CREATE POLICY "Bonus rules - Admin modify" ON bonus_rules
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Bonus rules - Admin update" ON bonus_rules
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- Deduction: Everyone can read
CREATE POLICY "Deduction rules - Public read" ON deduction_rules
  FOR SELECT USING (TRUE);

CREATE POLICY "Deduction rules - Admin modify" ON deduction_rules
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Deduction rules - Admin update" ON deduction_rules
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- Holiday: Everyone can read
CREATE POLICY "Holiday - Public read" ON holiday_calendar
  FOR SELECT USING (TRUE);

CREATE POLICY "Holiday - Admin modify" ON holiday_calendar
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Holiday - Admin update" ON holiday_calendar
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);
