# 🚀 QUICK FIX - 5 Menit

## Problem
```
Error: Could not find the 'jabatan' column of 'logs_absensi'
```

## Cause
Table `logs_absensi` tidak punya column `jabatan`

## Solution
Recreate table dengan column yang benar

---

## ⚡ 5-Step Quick Fix

### 1️⃣ Open Supabase
```
https://app.supabase.com → Login → Select project
```

### 2️⃣ Go to SQL Editor
```
Sidebar → SQL Editor → + New query
```

### 3️⃣ Copy This SQL
```sql
DROP TABLE IF EXISTS logs_absensi CASCADE;

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

### 4️⃣ Click Run
```
▶ Run button (atau Ctrl+Enter)
```

### 5️⃣ Restart & Test
```
VS Code → Ctrl+C → npm run dev → F5 (refresh) → Try PIN form
```

---

## ✅ Done!
Web should work now! 🎉

---

## 📖 Need More Details?
Read `FIX_DATABASE_GUIDE.md`
