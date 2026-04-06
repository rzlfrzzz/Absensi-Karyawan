-- ============================================
-- ALTERNATIVE: Add Missing Columns (Jika ingin keep data)
-- ============================================
-- Gunakan ini HANYA JIKA Anda tidak mau drop table

-- Check if column exists, add if not
ALTER TABLE logs_absensi 
ADD COLUMN IF NOT EXISTS jabatan TEXT DEFAULT 'Unknown';

ALTER TABLE logs_absensi 
ADD COLUMN IF NOT EXISTS shift TEXT;

-- Update column jabatan yang kosong dengan value dari karyawan
UPDATE logs_absensi 
SET jabatan = 'Penjahit' 
WHERE jabatan IS NULL OR jabatan = '';

-- Add NOT NULL constraint jika tidak ada data null
ALTER TABLE logs_absensi 
ALTER COLUMN jabatan SET NOT NULL;

-- Disable RLS untuk development
ALTER TABLE logs_absensi DISABLE ROW LEVEL SECURITY;

-- ============================================
-- SELESAI!
-- ============================================
