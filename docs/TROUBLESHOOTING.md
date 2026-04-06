# ❓ Troubleshooting

## Common Issues & Solutions

---

## 🔴 Build & Runtime Errors

### ❌ "Cannot find module '@/...'"

**Cause:** TypeScript path alias tidak resolve

**Solution:**
```bash
# Pastikan tsconfig.json ada
cat tsconfig.json

# Restart dev server
npm run dev
```

### ❌ "Vite error: Failed to resolve"

**Cause:** File import path salah

**Solution:**
1. Periksa spelling file name (case-sensitive!)
2. Pastikan file exist di path yang disebutkan
3. Gunakan relative path jika path alias tidak work

### ❌ TypeScript compilation error

**Cause:** Type mismatch atau missing type

**Solution:**
```bash
# Cek error detail
npm run dev

# Check strict mode di tsconfig.json
```

---

## 🔴 Authentication Issues

### ❌ "Invalid PIN or Password"

**Check:**
- ✅ PIN format benar (sesuai database)
- ✅ Password benar
- ✅ User ada di database
- ✅ Koneksi Supabase stabil

### ❌ "Supabase connection error"

**Solution:**
```bash
# 1. Pastikan .env.local sudah di-setup
cat .env.local

# 2. Verifikasi API keys valid
# - Buka https://supabase.com/
# - Ke project settings
# - Copy URL dan ANON_KEY

# 3. Check network connection
ping supabase.co

# 4. Restart dev server
npm run dev
```

### ❌ "Session expired"

**Solution:**
1. Login ulang
2. Clear browser cookies & cache
3. Check Supabase auth settings

---

## 🔴 Database Issues

### ❌ "Table not found"

**Check:**
- ✅ Tabel sudah dibuat di Supabase
- ✅ Nama tabel sama di service (`karyawan`, bukan `Karyawan`)
- ✅ RLS policies allow read/write

### ❌ "Row too large" atau "Payload too large"

**Cause:** Data terlalu besar

**Solution:**
1. Limit data dengan `.select('col1, col2')`
2. Gunakan pagination
3. Compress data jika perlu

### ❌ "Duplicate key error"

**Check:**
- ✅ Primary key unique
- ✅ Tidak ada duplikat di database
- ✅ Check unique constraints

---

## 🔴 UI/UX Issues

### ❌ Page tidak load atau blank

**Solution:**
1. Check browser console (F12)
2. Lihat network tab untuk failed requests
3. Cek Supabase connection
4. Clear cache: `Ctrl+Shift+Delete`

### ❌ Notification tidak muncul

**Check:**
```typescript
import { showNotification } from '@/utils/helpers';

// Verify helper function exists
showNotification('success', 'Title', 'Message');
```

### ❌ Form tidak submit

**Debug:**
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();

  // Add debug logs
  console.log('Form data:', data);
  console.log('Is loading?', isLoading);

  // Try request
  try {
    // ...
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### ❌ Language switcher tidak work

**Check:**
```typescript
import { useLanguage } from '@/hooks/useLanguage';

const { language, setLanguage } = useLanguage();
// Verify language state changes
```

---

## 🔴 Performance Issues

### ❌ App lambat / lag

**Solution:**
1. **Check Network Tab:**
   - Lihat request mana yang lambat
   - Optimize query (add `.limit()`)
   - Enable pagination

2. **React DevTools:**
   - Install React DevTools extension
   - Check which components re-render
   - Memoize expensive components

3. **Bundle Analysis:**
```bash
npm run build
# Check dist/ size
```

### ❌ Memory leak

**Signs:**
- Memory terus naik saat navigate
- App jadi lambat seiring waktu

**Solution:**
```typescript
useEffect(() => {
  // Cleanup function
  return () => {
    // Cancel requests, remove listeners
  };
}, []);
```

---

## 🔴 Deployment Issues

### ❌ "Process crashed"

**Check:**
- Environment variables tersedia
- Supabase connection valid
- Database ready
- Build output valid

### ❌ "Cannot POST /api/..."

**Cause:** Backend API tidak ready

**Solution:**
- Check Supabase functions deployed
- Verify API endpoints correct

---

## 🟡 Debug Mode

### Enable Detailed Logging

```typescript
// Di console browser
localStorage.setItem('debug', 'true');

// Di code
const isDev = localStorage.getItem('debug');
if (isDev) console.log('Debug info:', data);
```

### Check Supabase Logs

1. Buka https://supabase.com/
2. Pilih project
3. Go to Logs (Query editor)
4. Lihat recent errors

---

## 📞 Getting Help

Jika sudah coba semua langkah di atas, cari info di:

1. **DevTools Console** (F12)
   - Lihat error message detail
   - Search error online

2. **Supabase Documentation**
   - https://supabase.com/docs

3. **React Documentation**
   - https://react.dev/

4. **TypeScript Documentation**
   - https://www.typescriptlang.org/docs/

5. **GitHub Issues**
   - Cek existing issues
   - Create new issue jika belum ada

---

## 🛠️ Useful Commands

```bash
# Clear everything and reinstall
rm -rf node_modules
npm install

# Clean cache
npm cache clean --force

# Check for outdated packages
npm outdated

# Update packages
npm update

# Check for vulnerabilities
npm audit

# Build production
npm run build

# Preview production build
npm run preview
```

---

## 💡 Quick Checklist Saat Error

- [ ] Baca error message fully
- [ ] Check browser console
- [ ] Check network requests
- [ ] Verify environment variables
- [ ] Restart dev server
- [ ] Clear browser cache
- [ ] Check Supabase connection
- [ ] Rebuild project
- [ ] Try different browser
- [ ] Search error online
