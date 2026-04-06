# 📚 Dokumentasi AbsensiKaryawan

Selamat datang! Dokumentasi ini terorganisir untuk memudahkan Anda menemukan apa yang Anda cari.

---

## 🚀 Mulai Di Sini

| Kebutuhan | Dokumen | Waktu |
|-----------|---------|-------|
| **Baru di project?** | [QUICK_START.md](./QUICK_START.md) | 5 min |
| **Setup di komputer?** | [docs/INSTALLATION.md](./docs/INSTALLATION.md) | 10 min |
| **Ingin belajar arsitektur?** | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | 15 min |
| **Butuh referensi folder?** | [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) | 10 min |
| **Ada error?** | [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | As needed |

---

## 📖 Dokumentasi Lengkap

### ⚡ Quick Start
**File:** `QUICK_START.md`
- 5 menit setup
- Common tasks
- Quick reference

### 📦 Installation Guide  
**File:** `docs/INSTALLATION.md`
- Step-by-step setup
- Prasyarat sistem
- Troubleshooting awal

### 🏗️ Architecture
**File:** `docs/ARCHITECTURE.md`
- System architecture
- Technology stack
- Data flow
- Service pattern

### 📁 Project Structure
**File:** `docs/PROJECT_STRUCTURE.md`
- Folder organization
- File structure
- Naming conventions
- How to add features

### ❓ Troubleshooting
**File:** `docs/TROUBLESHOOTING.md`
- Common errors
- Solutions
- Debug tips
- Useful commands

---

## 🎯 Panduan Berdasarkan Role

### 👨‍💻 Developer (Coding)

**Langkah:**
1. Baca: [QUICK_START.md](./QUICK_START.md) - Overview (5 min)
2. Baca: [docs/INSTALLATION.md](./docs/INSTALLATION.md) - Setup (10 min)
3. Baca: [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) - Reference (10 min)
4. Baca: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Deep dive (15 min)
5. Mulai coding! 🎉

**When you need help:**
- Struktur folder? → [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)
- Cara membuat component? → [docs/PROJECT_STRUCTURE.md#adding-new-features](./docs/PROJECT_STRUCTURE.md#adding-new-features)
- Ada error? → [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

### 🔍 Code Reviewer

**Langkah:**
1. Baca: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Understand design
2. Baca: [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) - Check conventions
3. Review code sesuai guidelines

### 🎓 Learner (Belajar)

**Langkah:**
1. Baca: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System design
2. Baca: [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) - How it's organized
3. Explore: Source code di `src/`
4. Reference: [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) saat coding

---

## 🛠️ Fitur Utama

Sistem ini menyediakan:

✅ **Attendance Management** - Check-in/check-out karyawan
✅ **Payroll System** - Perhitungan gaji dan pembayaran
✅ **User Management** - Kelola pengguna dan akses
✅ **Admin Dashboard** - Monitoring dan analitik
✅ **Multi-language** - Support Indonesian & Chinese
✅ **Reports** - Export data dan laporan

---

## 💻 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **State Management:** React Context API
- **Authentication:** Supabase Auth + PIN

---

## 📁 File Organization

```
AbsensiKaryawan/
├── src/                      # Source code
│   ├── components/           # React components
│   ├── services/             # Business logic
│   ├── hooks/                # Custom hooks
│   ├── contexts/             # Global state
│   └── ...
├── docs/                     # Documentation folder
│   ├── INSTALLATION.md
│   ├── ARCHITECTURE.md
│   ├── PROJECT_STRUCTURE.md
│   └── TROUBLESHOOTING.md
├── QUICK_START.md            # Start here!
├── README.md                 # Project overview
└── package.json
```

---

## 🚀 Perintah Penting

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build production
npm run preview      # Preview build

# Type checking
npm run type-check   # Check TypeScript errors

# Utilities
npm install          # Install dependencies
npm audit            # Check vulnerabilities
npm update           # Update packages
```

---

## ❓ FAQ

**Q: Bagaimana cara setup project?**
A: Lihat [docs/INSTALLATION.md](./docs/INSTALLATION.md)

**Q: Dimana folder components?**
A: Di `src/components/` - lihat [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)

**Q: Bagaimana menambah component baru?**
A: Lihat [docs/PROJECT_STRUCTURE.md#adding-new-features](./docs/PROJECT_STRUCTURE.md#adding-new-features)

**Q: Ada error "Cannot find module"?**
A: Lihat [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

**Q: Bagaimana deploy ke production?**
A: Ada di [QUICK_START.md](./QUICK_START.md) atau tanya maintainer

---

## 📞 Need Help?

1. **Check Docs** - Cari di dokumentasi ini
2. **Search Issues** - Lihat GitHub issues
3. **Check Logs** - DevTools console (F12)
4. **Read Code** - Lihat source di `src/`
5. **Ask Team** - [Hubungi team development](https://github.com/rzlfrzzz/Absensi-Karyawan/blob/main/README.md#butuh-bantuan)

---

## ✅ Checklist Awal

Saat pertama kali setup:

- [ ] Read [QUICK_START.md](./QUICK_START.md)
- [ ] Run [docs/INSTALLATION.md](./docs/INSTALLATION.md)
- [ ] Verify setup works (`npm run dev`)
- [ ] Read [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)
- [ ] Ready to code! 🎉

---

## 📝 Notes

- Dokumentasi di-update seiring development
- Jika ada bagian yang kurang jelas, buka issue atau PR
- Kontribusi dokumentasi sangat dihargai!

---

**Last Updated:** 2024
**Maintained by:** Development Team

