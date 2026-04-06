# ✅ Database Fix Checklist

## 📋 Sebelum Mulai

- [ ] Buka file `FIX_DATABASE_GUIDE.md` dan baca
- [ ] Punya akses ke https://app.supabase.com
- [ ] Sudah login ke Supabase

---

## 🔧 Langkah 1: Akses Supabase SQL Editor

1. Open: https://app.supabase.com
2. Login
3. Select project: `atenydidkknrojmmksdo`
4. Sidebar → Click "SQL Editor"
5. Click "+ New query"

---

## 📝 Langkah 2: Copy-Paste Query

**Option A: Drop & Recreate (Recommended - untuk fresh start)**
- Open: `FIX_DATABASE.sql`
- Copy ALL content
- Paste di SQL Editor

**OR**

**Option B: Add Missing Columns (Jika ada data yang ingin keep)**
- Open: `FIX_DATABASE_ALTERNATIVE.sql`
- Copy ALL content
- Paste di SQL Editor

---

## ▶️ Langkah 3: Run Query

1. Click "▶ Run" button (atau Ctrl+Enter)
2. Tunggu hingga selesai
3. Lihat output:
   - ✅ "Query executed successfully" → NEXT STEP
   - ❌ Error → Screenshot & share dengan saya

---

## ✔️ Langkah 4: Verify

Buat query baru dan jalankan:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'logs_absensi'
ORDER BY ordinal_position;
```

Hasil harus ada column `jabatan` ✅

---

## 🔄 Langkah 5: Restart & Test

1. Go back to VS Code
2. Stop dev server: **Ctrl+C**
3. Run again: **npm run dev**
4. Refresh browser: **F5**
5. Try PIN form:
   - Input PIN: `1234` (atau PIN yang sudah ada)
   - Click "Masuk"
   - Should work now! ✅

---

## 🎯 Expected Result

Setelah semua steps:
- ✅ Pin form berfungsi
- ✅ Attendance log tersimpan
- ✅ No error "Could not find the 'jabatan' column"
- ✅ Web app working normally

---

## 🚨 If Still Error

1. Open browser console: **F12**
2. Try PIN form again
3. Copy error message
4. Share screenshot + error dengan saya
5. Saya debug lebih lanjut

---

## 📞 Need Help?

1. Read `FIX_DATABASE_GUIDE.md` step by step
2. Follow all steps carefully
3. If stuck, take screenshot
4. Share screenshot with error message

**Saya siap membantu!** 🚀

---

**Ready? Let's fix this!** 💪
