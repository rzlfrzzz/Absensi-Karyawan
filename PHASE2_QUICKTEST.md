# 🧪 QUICK TEST - FASE 2

## 🚀 5-Minute Test

### Step 1: Start Browser
Go to `http://localhost:3000`

### Step 2: Login as Admin
- Username: `admin`
- Password: `admin123`
- Click Login

### Step 3: See Settings Button
- Di admin dashboard header
- Should see orange "⚙️ Settings" button
- **Only for admin, not for manager!**

### Step 4: Open Settings
- Click "⚙️ Settings" button
- Should open Settings Dashboard

### Step 5: Test Each Tab

#### **Shift Settings**
- See 2 default shifts (Siang, Malam)
- Click "+ Tambah Shift"
- Add: "Sore" 14:00-17:30, tolerance 10 menit
- Click Simpan
- See new shift in table ✅

#### **Gaji Settings**
- See 4 default jabatan
- Try edit one jabatan's gaji
- Change gaji amount
- Click Simpan
- See formatted currency ✅

#### **Bonus & Rules**
- See all rules with dropdowns
- Change "Bonus On-time" dari per_hari → per_bulan
- Change potongan terlambat amount
- Click "Simpan Perubahan"
- See success notification ✅

#### **Holiday**
- Click year selector
- Add holiday: "Tahun Baru 2024" 2024-01-01
- Click Simpan
- See in table ✅
- Change year → See different holidays

#### **Company**
- See current company info
- Click "Edit Settings"
- Change nama perusahaan
- Click Simpan
- See changes persisted ✅

### Step 6: Logout & Login as Manager
- Click Logout
- Login: `manager` / `manager123`
- Go to admin dashboard
- **Should NOT see "⚙️ Settings" button** ✅
- Try visit `/backoffice/settings` directly
- Should see "Access Denied" page ✅

---

## ✅ All Tests Passing?

If YES → **Phase 2 Complete!** 🎉

If NO → Share error message and we fix! 💪

---

## 📊 Expected Results

| Test | Expected | Result |
|------|----------|--------|
| Admin sees settings | ✅ Yes | ? |
| Manager doesn't see | ✅ No button | ? |
| Add shift works | ✅ Success | ? |
| Edit gaji works | ✅ Changes saved | ? |
| Bonus rules editable | ✅ All fields work | ? |
| Holiday add/edit | ✅ Persisted | ? |
| Company settings save | ✅ Changes persist | ? |
| Refresh persists data | ✅ Still there | ? |

---

**Ready to test? Go to http://localhost:3000** 🚀
