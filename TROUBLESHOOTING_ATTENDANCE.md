# 🔍 Troubleshooting: "Failed to save attendance log"

## Step 1: Check Browser Console (PENTING!)

1. **Buka browser DevTools** dengan **F12**
2. **Pilih tab "Console"**
3. **Refresh page** (F5)
4. **Input PIN di form** (misal: 1234)
5. **Click "Masuk" button**
6. **Lihat error messages di console**

Akan ada output seperti:
```
❌ Supabase Error: {
  message: "...",
  code: "...",
  details: "...",
  hint: "..."
}
```

**Copy FULL error message ini dan share dengan saya!**

---

## Step 2: Common Issues & Solutions

### ❌ Error: "relation 'logs_absensi' does not exist"
**Cause:** Database table belum dibuat

**Solution:**
1. Buka https://app.supabase.com
2. Go to SQL Editor
3. Jalankan SQL untuk create tables (lihat SUPABASE_SETUP.md)

---

### ❌ Error: "permission denied for schema public"
**Cause:** Row Level Security (RLS) blocking akses

**Solution:**
1. Buka https://app.supabase.com
2. Go to Authentication → Policies
3. **Disable RLS** untuk table:
   - logs_absensi
   - karyawan
   - settings
4. Refresh browser dan coba lagi

Atau setup proper RLS policies untuk production.

---

### ❌ Error: "Invalid API Key" atau "Failed to authenticate"
**Cause:** Credentials di `.env.local` salah atau tidak ada

**Solution:**
1. Check `.env.local` exists di root folder
2. Copy correct credentials dari Supabase:
   - Go to https://app.supabase.com
   - Select your project
   - Settings → API
   - Copy `Project URL` dan `anon public` key
3. Update `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   ```
4. Restart dev server: `npm run dev`
5. Refresh browser (F5)

---

### ❌ Error: "null" atau tidak ada detail error
**Cause:** Employee (PIN) tidak terdaftar di database

**Solution:**
1. Buka Admin Panel: Click "Backoffice Access" link
2. Di form "Daftarkan PIN Baru":
   - Nama: `John Doe`
   - PIN: `1234`
   - Jabatan: `Penjahit`
   - Shift: `Siang`
3. Click "Simpan Data"
4. Now try PIN `1234` di attendance form

---

### ❌ Error: "upload failed" atau foto tidak ter-upload
**Cause:** Storage bucket belum dibuat atau permission issue

**Solution:**
1. Buka https://app.supabase.com
2. Go to Storage
3. Create new bucket:
   - Name: `absensi_photos`
   - Public: Yes (enable)
4. Refresh browser dan coba lagi

---

## Step 3: Complete Checklist

Pastikan semua ini sudah done:

### ✅ Configuration
- [ ] `.env.local` file exists di root folder
- [ ] `VITE_SUPABASE_URL` filled dengan correct URL
- [ ] `VITE_SUPABASE_ANON_KEY` filled dengan correct key
- [ ] Dev server restarted setelah update `.env.local`

### ✅ Database
- [ ] Table `karyawan` exists
- [ ] Table `logs_absensi` exists
- [ ] Table `settings` exists
- [ ] RLS disabled (atau policies configured)

### ✅ Storage
- [ ] Bucket `absensi_photos` exists
- [ ] Bucket is public

### ✅ Data
- [ ] At least 1 karyawan registered dengan PIN
- [ ] Company settings configured

---

## Step 4: How to Get Exact Error

### Cara termudah:

1. **F12** → Console tab
2. **Input PIN, click Masuk**
3. **Right-click pada error** → **Copy**
4. **Paste di sini**

Error message biasanya akan seperti:

```
❌ Supabase Error: {
  message: "relation "logs_absensi" does not exist",
  code: "PGRST301",
  details: null,
  hint: "The schema information statement failed."
}
```

**Jika copy error message ini untuk saya, saya bisa fix langsung!**

---

## Quick Diagnostic Command

Jalankan di browser console (F12):

```javascript
// Check environment
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Try to fetch settings
fetch('/api/debug', { 
  method: 'POST', 
  body: JSON.stringify({ action: 'testConnection' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

---

## My Recommendation

**Most likely issue:** Database tables belum dibuat

**Solution:**
1. Go to SUPABASE_SETUP.md
2. Follow steps untuk create tables
3. Come back dan coba lagi

Atau, **copy full error message dari console** dan share dengan saya, saya fix sekarang juga!

---

Need help? 
- Check console errors (F12)
- Copy error message
- Share dengan saya
- I'll help you fix it! 🚀
