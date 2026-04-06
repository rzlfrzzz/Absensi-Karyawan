# 🚀 PANDUAN DEPLOYMENT - AbsensiKaryawan v1.0.0

## 📋 Pre-Deployment Checklist

- [x] Build Sukses
- [x] Semua Test Berhasil
- [x] Environment Variables Dikonfigurasi
- [x] Database Migrations Selesai
- [x] Seed Data Dimuat

---

## 🔧 OPSI DEPLOYMENT

### **Opsi A: Deploy ke Vercel (Recommended - Tercepat)**

1. **Push ke GitHub**
```bash
git add .
git commit -m "Production v1.0.0 - Ready for Deploy"
git push origin main
```

2. **Hubungkan ke Vercel**
```
1. Kunjungi: https://vercel.com
2. Klik "New Project"
3. Pilih repository ini
4. Tambahkan Environment Variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
5. Klik "Deploy"
```

3. **Setelah Deployment**
- Verifikasi URL berfungsi
- Test login dengan kredensial seed
- Cek semua halaman load dengan benar

---

### **Opsi B: Deploy ke Netlify**

1. **Build Production**
```bash
npm run build
```

2. **Upload ke Netlify**
```
1. Kunjungi: https://app.netlify.com
2. Drag & drop folder 'dist'
3. Tambahkan environment variables di:
   Netlify → Site Settings → Build & Deploy → Environment
4. Tunggu deployment selesai
```

---

### **Opsi C: Deploy ke Server Sendiri (Advanced)**

**Persyaratan:**
- Node.js 18+
- npm atau yarn
- Nginx atau Apache

**Langkah-langkah:**

1. **SSH ke Server**
```bash
ssh user@your-server.com
```

2. **Clone Repository**
```bash
cd /var/www
git clone https://github.com/your-repo/absensi.git
cd absensi
```

3. **Install Dependencies**
```bash
npm install
```

4. **Setup Environment**
```bash
cp .env.production .env.local
# Edit .env.local dengan production values
nano .env.local
```

5. **Build**
```bash
npm run build
```

6. **Setup Web Server (Nginx)**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/absensi/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

7. **Enable HTTPS (Let's Encrypt)**
```bash
sudo certbot certonly --standalone -d your-domain.com
```

8. **Restart Nginx**
```bash
sudo systemctl restart nginx
```

---

## 🔐 SECURITY CHECKLIST

- [x] Hapus hardcoded credentials
- [x] Gunakan environment variables
- [x] Enable HTTPS/SSL
- [x] Setup CORS dengan benar
- [x] Enable rate limiting
- [x] Setup firewall rules
- [x] Backup database secara berkala

---

## 📊 FITUR SISTEM (Production Ready)

✅ **User Management**
- 4 Tipe Role (Super Admin, HR Admin, Manager, Employee)
- Secure password hashing (bcryptjs)
- Session management

✅ **Payroll Management**
- Automatic salary calculation
- Tax calculation (PPh21)
- Bonus/Deduction tracking
- Payment workflow (Draft → Pending → Approved → Paid)

✅ **Attendance Tracking**
- Real-time check-in/out
- Late tracking
- Attendance analytics
- Export capabilities

✅ **Analytics & Reports**
- Daily/Monthly statistics
- Performance ranking
- Export to Excel
- Multi-language support (ID/CN)

✅ **Settings & Configuration**
- Shift management
- Salary configuration
- Bonus rules
- Holiday calendar
- Company settings

---

## 🧪 TESTING SEBELUM DEPLOY

### **Test Login**
1. Kunjungi: `https://your-domain.com/login`
2. Gunakan kredensial: 
   - Email: `admin@absensi.com`
   - Password: `Admin@123456`
3. Seharusnya redirect ke `/backoffice`

### **Test Navigasi**
1. Dari Backoffice → Klik Menu dropdown
2. Navigasi ke: Payroll, Users, Analytics, Settings
3. Semua halaman harus load dengan benar

### **Test Fungsionalitas**
1. **Attendance Form**: Submit check-in dengan camera
2. **User Management**: Buat user baru
3. **Payroll**: Create payroll untuk employee
4. **Analytics**: View monthly stats

---

## 📞 SUPPORT & MAINTENANCE

### **Tugas Harian**
- Monitor error logs
- Check system performance
- Verifikasi data backups

### **Tugas Mingguan**
- Review user activity
- Check payroll processing
- Verifikasi semua fitur berfungsi

### **Tugas Bulanan**
- Security audit
- Database optimization
- Review user feedback

---

## 🆘 TROUBLESHOOTING

**Masalah: Login tidak berfungsi**
- Cek Supabase connection
- Verifikasi environment variables
- Cek browser console untuk errors

**Masalah: Payroll tidak calculate**
- Verifikasi employee data
- Cek salary settings
- Review attendance logs

**Masalah: Performance lambat**
- Cek server resources
- Optimize database queries
- Enable caching

---

## 📝 DEPLOYMENT INFO

- **Project Name**: AbsensiKaryawan
- **Version**: 1.0.0
- **Last Updated**: 2026-04-06
- **Built with**: React, TypeScript, Tailwind, Supabase
- **Node Version**: 18+
- **Package Manager**: npm
- **Build Tool**: Vite

---

**Selamat dengan deployment! 🚀**

Untuk pertanyaan, lihat dokumentasi atau hubungi tim development.

