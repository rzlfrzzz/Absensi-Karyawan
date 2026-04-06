# Migration Guide - Old to New Structure

## Apa yang Berubah?

### 1. File Organization
**Sebelum:**
```
App.tsx
Admin.tsx
AttendanceForm.tsx
main.tsx
supabaseClient.ts
vite.config.ts
```

**Sesudah:**
```
src/
├── components/        # All UI components
├── services/          # Business logic
├── lib/              # External setup
├── types/            # TypeScript interfaces
├── utils/            # Helper functions
├── constants/        # Constants & translations
├── App.tsx
├── main.tsx
└── index.css
```

### 2. Environment Variables
**Sebelum:** Hardcoded credentials di `supabaseClient.ts`
```typescript
const supabaseUrl = 'https://...';
const supabaseKey = 'eyJ...';
```

**Sesudah:** Environment variables di `.env.local`
```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3. Supabase Client Import
**Sebelum:**
```typescript
import { supabase } from './supabaseClient';
```

**Sesudah:**
```typescript
import { supabase } from '@/lib/supabaseClient';
```

### 4. Service Layer
**Sebelum:** Logic campur di components
```typescript
// Di AttendanceForm.tsx
const { data: karyawan } = await supabase.from('karyawan')...
```

**Sesudah:** Dedicated services
```typescript
// Import
import { attendanceService } from '@/services/attendanceService';

// Usage
const karyawan = await attendanceService.getKaryawanByPin(pin);
```

### 5. Types
**Sebelum:** `any` di mana-mana
```typescript
const [karyawan, setKaryawan] = useState<any>(null);
```

**Sesudah:** Proper types
```typescript
import { Karyawan, AttendanceLog } from '@/types';

const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
```

### 6. Translations
**Sebelum:** Object literal di component
```typescript
const t = {
  ID: { ... },
  CN: { ... }
};
```

**Sesudah:** Centralized constants
```typescript
import { translations } from '@/constants/translations';
translations[lang].keyName;
```

### 7. Camera Management
**Sebelum:** Manual stream handling + memory leak
```typescript
const startVideo = () => {
  navigator.mediaDevices.getUserMedia(...)
    .then(stream => videoRef.current.srcObject = stream);
};
```

**Sesudah:** Service dengan cleanup
```typescript
import { mediaService } from '@/services/mediaService';

useEffect(() => {
  mediaService.startVideoStream(videoRef.current);
  return () => mediaService.stopVideoStream(stream);
}, []);
```

### 8. Error Handling
**Sebelum:** Minimal error handling
```typescript
const { error } = await supabase.from('...').select();
if (error || !data) { /* ...  */ }
```

**Sesudah:** Comprehensive error handling
```typescript
try {
  const data = await service.operation();
  if (success) { /* ... */ }
} catch (error) {
  console.error('Operation failed:', error);
  showNotification('error', 'Error', 'Message');
}
```

## Migration Checklist

- [x] Files moved to `src/` directory
- [x] Components created in `src/components/`
- [x] Services created in `src/services/`
- [x] Types created in `src/types/`
- [x] Constants created in `src/constants/`
- [x] Environment variables configured
- [x] TypeScript compilation verified
- [x] Error handling improved
- [x] Memory leaks fixed
- [x] Security issues resolved

## Testing

Semua fitur harus ditest:

1. **Attendance Form**
   - ✅ Camera preview loads
   - ✅ PIN input works
   - ✅ Check-in saves correctly
   - ✅ Check-out saves correctly
   - ✅ Photo upload works

2. **Admin Dashboard**
   - ✅ Employees load
   - ✅ Can add employee
   - ✅ Can delete employee
   - ✅ Logs filter correctly
   - ✅ CSV export works
   - ✅ Language switch works

3. **Error Cases**
   - ✅ Invalid PIN shows error
   - ✅ Camera permission denied handled
   - ✅ Network error caught
   - ✅ Database error caught

## Performance Notes

- ✅ Code splitting enabled via Vite
- ✅ Lazy component loading ready
- ✅ Memory leaks fixed (video streams cleanup)
- ✅ Proper memoization in tables

## What's NOT Changed

- ✅ UI/UX remains same
- ✅ Database schema unchanged
- ✅ Functionality unchanged
- ✅ Tailwind CSS styling same

## Questions?

Refer to:
- `PROJECT_STRUCTURE.md` - Project organization
- `src/types/index.ts` - Type definitions
- `src/services/` - Service examples
- `src/components/` - Component examples
