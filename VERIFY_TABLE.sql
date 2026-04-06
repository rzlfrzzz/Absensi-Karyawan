-- Query 1: Check semua columns
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'logs_absensi'
ORDER BY ordinal_position;

-- Query 2: Check table struktur lengkap
DESC logs_absensi;

-- Query 3: Test insert (jika column ada, ini akan berhasil)
-- JANGAN JALANKAN INI DULU, hanya untuk test nanti!
/*
INSERT INTO logs_absensi (karyawan_id, nama, tipe, jam, status, foto_url, jabatan)
VALUES (gen_random_uuid(), 'Test', 'MASUK', '08:00', 'On Time', '', 'Penjahit');
*/
