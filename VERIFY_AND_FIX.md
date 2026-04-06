# 🔍 VERIFY & FIX - Database Column Issue

## Problem
```
Error: Could not find the 'jabatan' column of 'logs_absensi'
```

## Cause
Column `jabatan` masih tidak ada di table `logs_absensi`

---

## 🎯 Step-by-Step Fix

### Step 1: Verify Table Columns

Buka Supabase SQL Editor dan jalankan:

```sql
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'logs_absensi'
ORDER BY ordinal_position;
```

**Expected result:** 
Harus ada column `jabatan` di list

**Actual result:**
Jika `jabatan` tidak ada, lanjut ke Step 2

---

### Step 2: Drop & Recreate Table

Jalankan SQL ini:

```sql
-- Drop old table
DROP TABLE IF EXISTS logs_absensi CASCADE;

-- Create new table dengan schema lengkap
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

CREATE INDEX idx_logs_absensi_karyawan_id ON logs_absensi(karyawan_id);
CREATE INDEX idx_logs_absensi_created_at ON logs_absensi(created_at);

ALTER TABLE logs_absensi DISABLE ROW LEVEL SECURITY;
```

**Expected:** 
```
Query executed successfully
```

---

### Step 3: Verify Again

Jalankan query verification lagi:

```sql
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'logs_absensi'
ORDER BY ordinal_position;
```

Sekarang harus ada column `jabatan`

---

### Step 4: Force Refresh Supabase Cache

Supabase sometimes cache schema. Untuk refresh:

1. Go to your Supabase project settings
2. Or just wait 2-3 minutes
3. Or try this SQL:

```sql
-- Notify Supabase to refresh schema
NOTIFY pgrst, 'reload schema';
```

---

### Step 5: Restart Dev Server

Go back to VS Code:

```sh
Ctrl+C  (stop)
npm run dev (start)
```

---

### Step 6: Refresh Browser

```
F5 (refresh page)
```

---

### Step 7: Test PIN Form

1. Input PIN: `1234` (atau yang sudah ada)
2. Click "Masuk"
3. Check console (F12)
4. Should see: `✅ Attendance log saved successfully`

---

## ✅ Checklist

- [ ] Step 1: Verify - column `jabatan` ada?
- [ ] If NO → Step 2: Drop & Recreate table
- [ ] Step 3: Verify - column `jabatan` ada sekarang?
- [ ] Step 4: Force refresh cache
- [ ] Step 5: Restart dev server
- [ ] Step 6: Refresh browser
- [ ] Step 7: Test - form should work now!

---

## 🚨 If Still Error After All Steps

1. Screenshot console error
2. Screenshot Supabase table columns
3. Share both with me
4. I'll debug further

---

## 💡 Alternative: Check if Karyawan Table Exists

Error juga bisa karena `karyawan` table tidak ada. Check:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Harus ada tables:
- ✅ karyawan
- ✅ logs_absensi
- ✅ settings

---

**Now follow the steps above!** 🚀
