-- ============================================
-- FIX: Create logs_absensi Table dengan Schema Lengkap
-- ============================================
-- Copy-paste query ini ke Supabase SQL Editor

-- 1. Drop table lama (kalau ada)
DROP TABLE IF EXISTS logs_absensi CASCADE;

-- 2. Buat table baru dengan schema lengkap
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

-- 3. Create indexes untuk performance
CREATE INDEX idx_logs_absensi_karyawan_id ON logs_absensi(karyawan_id);
CREATE INDEX idx_logs_absensi_created_at ON logs_absensi(created_at);

-- 4. Disable RLS (untuk development) - biar mudah test
ALTER TABLE logs_absensi DISABLE ROW LEVEL SECURITY;

-- ============================================
-- SELESAI! Sekarang table sudah benar
-- ============================================
