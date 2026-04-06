# 📦 Instalasi & Setup

## Prasyarat Sistem

- Node.js 16+ ([Download](https://nodejs.org/))
- npm atau yarn
- Git
- Text Editor (VS Code recommended)

---

## Langkah Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/rzlfrzzz/Absensi-Karyawan.git
cd Absensi-Karyawan
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
# Copy file template
cp .env.example .env.local
```

Edit `.env.local` dengan nilai berikut:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Dapatkan nilai ini dari [Supabase Dashboard](https://supabase.com/)

### 4. Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

---

## Troubleshooting

### "Cannot find module"
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

### "Port 3000 already in use"
```bash
# Gunakan port lain
npm run dev -- --port 3001
```

### "Supabase connection error"
- Pastikan `.env.local` sudah diisi dengan benar
- Periksa koneksi internet
- Verifikasi API keys di Supabase Dashboard

---

## Verifikasi Instalasi

Setelah server berjalan, cek:

✅ Browser membuka `http://localhost:3000` tanpa error
✅ Tidak ada console error di DevTools
✅ Halaman login terlihat dengan benar

Jika semua ✅, instalasi berhasil!
