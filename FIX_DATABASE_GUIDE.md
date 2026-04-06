# 🔧 FIX DATABASE - Step by Step

## 📖 Follow Steps Di Bawah:

### Step 1: Buka Supabase Project
1. **Go to:** https://app.supabase.com
2. **Login** dengan akun Anda
3. **Pilih project:** `atenydidkknrojmmksdo` (sesuai URL di `.env.local`)

### Step 2: Buka SQL Editor
1. **Di sidebar kiri, cari:** `SQL Editor` (icon {} )
2. **Click SQL Editor**

### Step 3: Create New Query
1. **Click `+ New query` button** (atau `New SQL query`)
2. **Kosongkan text area**

### Step 4: Copy Query
1. **Buka file:** `FIX_DATABASE.sql` di root folder
2. **Copy SEMUA isi file** (Ctrl+A, Ctrl+C)
3. **Paste di SQL Editor** (Ctrl+V)

### Step 5: Run Query
1. **Click `▶ Run` button** (atau Ctrl+Enter)
2. **Tunggu sampai selesai**
3. **Lihat output:**
   - ✅ Jika ada "Query executed successfully" → OK!
   - ❌ Jika ada error → Screenshot dan share

### Step 6: Verify
Buka query baru dan jalankan:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'logs_absensi'
ORDER BY ordinal_position;
```

Harus show columns:
- ✅ id
- ✅ karyawan_id
- ✅ nama
- ✅ tipe
- ✅ jam
- ✅ status
- ✅ foto_url
- ✅ **jabatan** ← INI PENTING!
- ✅ shift
- ✅ created_at

---

## 🎯 Visual Guide (Klik Step by Step)

```
1. Go to https://app.supabase.com
                    ↓
2. Login your account
                    ↓
3. Select project "atenydidkknrojmmksdo"
                    ↓
4. Click "SQL Editor" di sidebar
                    ↓
5. Click "+ New query"
                    ↓
6. Copy-paste SQL dari FIX_DATABASE.sql
                    ↓
7. Click "▶ Run" atau Ctrl+Enter
                    ↓
8. Tunggu... Seharusnya "Query executed successfully"
                    ↓
9. Kembali ke VS Code, restart dev server
                    ↓
10. Refresh browser, try PIN form lagi ✅
```

---

## 📋 Query untuk Copy-Paste

Ini adalah SQL yang harus dijalankan:

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

---

## 🎯 Setelah Selesai:

1. **Go back to VS Code**
2. **Stop dev server:** Ctrl+C
3. **Restart:** `npm run dev`
4. **Refresh browser:** F5
5. **Try PIN form lagi** - seharusnya OK! ✅

---

## 🚨 Jika Ada Error:

1. **Screenshot error message**
2. **Copy error text**
3. **Share dengan saya**
4. **Saya bantu debug**

---

## ✅ Checklist Sebelum Lanjut:

- [ ] Sudah buka https://app.supabase.com
- [ ] Sudah login
- [ ] Sudah select project
- [ ] Sudah buka SQL Editor
- [ ] Sudah copy-paste SQL
- [ ] Sudah click Run
- [ ] Sudah lihat "Query executed successfully"

**Setelah semua done, lanjut ke Step berikutnya!**
