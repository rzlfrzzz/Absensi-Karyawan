# 🖼️ Visual Guide dengan Screenshots

## Step 1: Buka Supabase

**Buka di browser:**
```
https://app.supabase.com
```

Expected: Login page atau project dashboard

---

## Step 2: Select Project

Lihat di sidebar, ada daftar projects. Select:
```
atenydidkknrojmmksdo
```

---

## Step 3: Buka SQL Editor

Di sidebar kiri, cari dan click:
```
📝 SQL Editor
```

atau bisa langsung ke:
```
https://app.supabase.com/project/atenydidkknrojmmksdo/sql/new
```

---

## Step 4: New Query

Lihat button:
```
+ New query
```

Click it

---

## Step 5: Paste SQL

Di text area yang kosong, copy-paste query ini:

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

## Step 6: Run Query

Click:
```
▶ RUN
```

atau press:
```
Ctrl + Enter
```

---

## Step 7: Check Result

Expected output:
```
✅ Query executed successfully
```

Atau lihat di bawah ada output yang menunjukkan query berhasil.

---

## Step 8: Verify Columns

Buat query baru:

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'logs_absensi'
ORDER BY ordinal_position;
```

Run query, harus show:
- id
- karyawan_id
- nama
- tipe
- jam
- status
- foto_url
- **jabatan** ← PENTING!
- shift
- created_at

---

## Step 9: Go Back to VS Code

1. Close Supabase tab
2. Go to VS Code
3. Stop dev server: **Ctrl+C**
4. Restart: **npm run dev**

---

## Step 10: Test

1. Refresh browser: **F5**
2. Try PIN form:
   - PIN: `1234`
   - Click "Masuk"
3. Should work now! ✅

---

## 🎉 Success!

If you see:
- ✅ Notification: "BERHASIL!"
- ✅ No error in console
- ✅ Form cleared after submit

**THEN YOU'RE DONE!** 🎊

---

## 🚨 If Still Error

1. Open console: **F12**
2. Screenshot error
3. Share screenshot with me
4. I'll help debug

---

That's it! Pretty simple, right? 💪
