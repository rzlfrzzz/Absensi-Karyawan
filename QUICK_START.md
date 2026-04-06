# ⚡ Quick Start Guide

## 🚀 5 Menit untuk Setup

### Step 1: Environment Variables (1 menit)
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_SUPABASE_URL=https://atenydidkknrojmmksdo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...
```

### Step 2: Install Dependencies (2 menit)
```bash
npm install
```

### Step 3: Run Development (1 menit)
```bash
npm run dev
```

Browser akan otomatis membuka `http://localhost:3000`

### Step 4: Start Coding (1 menit)
- Attendance form → `src/components/AttendanceForm.tsx`
- Admin dashboard → `src/components/Admin.tsx`
- Business logic → `src/services/`

---

## 🎯 Common Tasks

### Add New Component
```bash
# Create file di src/components/MyComponent.tsx
touch src/components/MyComponent.tsx
```

```typescript
import React from 'react';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};
```

### Add New Service
```bash
# Create file di src/services/myService.ts
touch src/services/myService.ts
```

```typescript
import { supabase } from '@/lib/supabaseClient';

export const myService = {
  async getData() {
    try {
      const { data, error } = await supabase
        .from('table_name')
        .select('*');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      return null;
    }
  },
};
```

### Add New Type
```typescript
// Di src/types/index.ts

export interface MyType {
  id: string;
  name: string;
  // ...
}
```

### Add Translation
```typescript
// Di src/constants/translations.ts

export const translations = {
  ID: {
    // ... existing
    myNewKey: 'Indonesian text',
  },
  CN: {
    // ... existing
    myNewKey: '中文文字',
  },
};
```

### Show Notification
```typescript
import { showNotification } from '@/utils/helpers';

// Success
showNotification('success', 'Success!', 'Operation completed');

// Error
showNotification('error', 'Error', 'Something went wrong');

// Warning
showNotification('warning', 'Warning', 'Please be careful');
```

### Handle Async Operations
```typescript
import { attendanceService } from '@/services/attendanceService';
import { showNotification } from '@/utils/helpers';

const handleAction = async () => {
  setLoading(true);
  try {
    const result = await attendanceService.getKaryawanByPin(pin);
    if (result) {
      showNotification('success', 'Found!', 'Employee found');
    } else {
      showNotification('error', 'Not Found', 'Employee not found');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('error', 'Error', 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

---

## 📂 File Locations Quick Reference

| What | Where |
|------|-------|
| UI Components | `src/components/` |
| Business Logic | `src/services/` |
| Type Definitions | `src/types/index.ts` |
| Translations | `src/constants/translations.ts` |
| Helper Functions | `src/utils/` |
| Supabase Setup | `src/lib/supabaseClient.ts` |
| Environment Vars | `.env.local` |

---

## 🧪 Quick Tests

### Test 1: Component Works
```bash
npm run dev
# Open http://localhost:3000
# Should see attendance form
```

### Test 2: Services Work
```typescript
// In browser console:
import { attendanceService } from '@/services/attendanceService';
const settings = await attendanceService.getSettings();
console.log(settings);
```

### Test 3: No Type Errors
```bash
node_modules\.bin\tsc --noEmit
# Should complete without errors
```

---

## 🐛 Troubleshooting

### Problem: `.env.local` not working
**Solution:**
```bash
# Restart dev server
npm run dev
```

### Problem: Cannot find module '@/...'
**Solution:** 
- Check file exists in `src/`
- Check path is correct (case-sensitive)
- Restart dev server

### Problem: Supabase connection error
**Solution:**
- Check `.env.local` credentials are correct
- Check credentials are not quoted
- Check network connection

### Problem: Camera permission denied
**Solution:**
- Check browser camera permissions
- Allow camera access in browser settings
- Try incognito/private mode

---

## 📚 Important Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app router |
| `src/main.tsx` | Entry point |
| `.env.local` | Your credentials (KEEP SECRET!) |
| `.env.example` | Credential template |
| `PROJECT_STRUCTURE.md` | Project overview |
| `MIGRATION.md` | Before/after guide |
| `README_REFACTORING.md` | Detailed explanation |

---

## 💡 Best Practices

✅ **Always use try-catch** for async operations
```typescript
try {
  await someService.operation();
} catch (error) {
  console.error('Failed:', error);
}
```

✅ **Always add types**
```typescript
const [data, setData] = useState<MyType | null>(null); // ✅ Good
const [data, setData] = useState<any>(null);          // ❌ Bad
```

✅ **Use services for business logic**
```typescript
// ✅ Good - business logic in service
const result = await attendanceService.getKaryawanByPin(pin);

// ❌ Bad - business logic in component
const { data } = await supabase.from('karyawan')...
```

✅ **Show user feedback**
```typescript
// ✅ Good
showNotification('success', 'Success!', 'Operation completed');

// ❌ Bad
console.log('Done'); // User doesn't see this
```

---

## 📞 Need Help?

1. **Type errors?** → Check `src/types/index.ts`
2. **Logic error?** → Check `src/services/`
3. **UI issue?** → Check `src/components/`
4. **Styling?** → Edit component className
5. **Translation?** → Check `src/constants/translations.ts`
6. **Setup issue?** → Check `.env.local` and `node_modules/`

---

## 🎉 You're Ready!

Everything is set up and ready to go. Start building! 🚀

```bash
npm run dev
```

Happy coding! 💻✨
