-- 🚀 ULTIMATE FIX - Complete Database Setup
-- Jalankan ini kalau semua table belum ada atau error
-- Copy-paste seluruh script ini ke Supabase SQL Editor

-- ============================================
-- STEP 1: Drop existing tables (JIKA ADA)
-- ============================================
DROP TABLE IF EXISTS logs_absensi CASCADE;
DROP TABLE IF EXISTS karyawan CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- ============================================
-- STEP 2: Create karyawan table
-- ============================================
CREATE TABLE karyawan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  pin TEXT NOT NULL UNIQUE,
  shift TEXT DEFAULT 'Siang' CHECK (shift IN ('Siang', 'Malam')),
  jabatan TEXT DEFAULT 'Penjahit',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 3: Create settings table
-- ============================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jam_masuk_siang TEXT DEFAULT '08:00',
  jam_pulang_siang TEXT DEFAULT '17:00',
  jam_masuk_malam TEXT DEFAULT '17:15',
  jam_pulang_malam TEXT DEFAULT '02:15',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 4: Create logs_absensi table (PENTING!)
-- ============================================
CREATE TABLE logs_absensi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  karyawan_id UUID NOT NULL REFERENCES karyawan(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  tipe TEXT NOT NULL CHECK (tipe IN ('MASUK', 'PULANG')),
  jam TEXT NOT NULL,
  status TEXT DEFAULT 'On Time',
  foto_url TEXT,
  jabatan TEXT NOT NULL,
  shift TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 5: Create Indexes
-- ============================================
CREATE INDEX idx_logs_absensi_karyawan_id ON logs_absensi(karyawan_id);
CREATE INDEX idx_logs_absensi_created_at ON logs_absensi(created_at);
CREATE INDEX idx_karyawan_pin ON karyawan(pin);

-- ============================================
-- STEP 6: Disable RLS (untuk development)
-- ============================================
ALTER TABLE karyawan DISABLE ROW LEVEL SECURITY;
ALTER TABLE logs_absensi DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 7: Insert sample data
-- ============================================
-- Insert default settings
INSERT INTO settings (jam_masuk_siang, jam_pulang_siang, jam_masuk_malam, jam_pulang_malam)
VALUES ('08:00', '17:00', '17:15', '02:15');

-- Insert sample employee (untuk test)
INSERT INTO karyawan (nama, pin, shift, jabatan)
VALUES ('Admin Test', '1234', 'Siang', 'Admin');

-- ============================================
-- SELESAI! Database sudah siap
-- ============================================

-- Verify: Jalankan query ini untuk check
SELECT 'karyawan table' as table_name, COUNT(*) as row_count FROM karyawan
UNION ALL
SELECT 'logs_absensi table', COUNT(*) FROM logs_absensi
UNION ALL
SELECT 'settings table', COUNT(*) FROM settings;
