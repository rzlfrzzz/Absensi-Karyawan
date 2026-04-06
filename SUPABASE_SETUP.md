# 📋 Supabase Database Setup

Jika database belum ada, ikuti steps ini:

## 1. Buka Supabase Console

- Go to https://app.supabase.com
- Select your project
- Go to SQL Editor

## 2. Create Tables

Jalankan SQL queries ini satu per satu:

### Table: karyawan
```sql
CREATE TABLE karyawan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  pin TEXT NOT NULL UNIQUE,
  shift TEXT DEFAULT 'Siang',
  jabatan TEXT DEFAULT 'Penjahit',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: logs_absensi
```sql
CREATE TABLE logs_absensi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  karyawan_id UUID NOT NULL REFERENCES karyawan(id),
  nama TEXT NOT NULL,
  tipe TEXT NOT NULL,
  jam TEXT NOT NULL,
  status TEXT DEFAULT 'On Time',
  foto_url TEXT,
  jabatan TEXT,
  shift TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: settings
```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jam_masuk_siang TEXT DEFAULT '08:00',
  jam_pulang_siang TEXT DEFAULT '17:00',
  jam_masuk_malam TEXT DEFAULT '17:15',
  jam_pulang_malam TEXT DEFAULT '02:15',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 3. Create Storage Bucket

Go to Storage → Create new bucket:
- Name: `absensi_photos`
- Public: Yes
- File size: 10MB max

## 4. Setup Row Level Security (RLS)

For each table, go to RLS and:
- Disable RLS (for development, easier)
- Or setup policies (for production, more secure)

## 5. Test Connection

After setup, go back to VS Code and:
```bash
# Stop dev server (Ctrl+C)
npm run dev
```

Then refresh browser and try again.

---

## ✅ Checklist

- [ ] `.env.local` created with correct credentials
- [ ] Supabase tables created
- [ ] Storage bucket created
- [ ] RLS configured
- [ ] Dev server restarted
- [ ] Browser refreshed
- [ ] Try attendance form again
