# Digital Absensi - Refactored

Sistem absensi digital dengan teknologi bio-verification dan managemen karyawan.

## 🎯 Struktur Project

```
src/
├── components/           # React Components
│   ├── AttendanceForm.tsx       # Main attendance page
│   ├── Admin.tsx                 # Admin dashboard
│   ├── CameraPreview.tsx         # Camera video preview
│   ├── PinInput.tsx              # PIN input component
│   ├── AttendanceButtons.tsx     # Check-in/out buttons
│   ├── KaryawanForm.tsx          # Add employee form
│   ├── KaryawanTable.tsx         # Employee list table
│   └── AttendanceTable.tsx       # Attendance logs table
│
├── services/            # Business Logic Layer
│   ├── attendanceService.ts  # Attendance operations
│   ├── adminService.ts       # Admin operations
│   └── mediaService.ts       # Camera/Media operations
│
├── lib/                 # External Libraries Setup
│   └── supabaseClient.ts     # Supabase initialization
│
├── types/              # TypeScript Interfaces
│   └── index.ts        # Type definitions
│
├── utils/              # Helper Functions
│   ├── helpers.ts           # General utilities (notifications, export, etc)
│   └── attendanceHelper.ts  # Attendance logic helpers
│
├── constants/          # Constants
│   └── translations.ts # i18n translations (ID & CN)
│
├── App.tsx            # Main app router
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## 🔐 Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update `.env.local` dengan credentials Supabase Anda:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**JANGAN commit `.env.local`!**

## 📦 Key Features

### 1. Attendance Management
- Photo capture dengan camera device
- PIN verification
- Time-based status determination (On Time, Late, Early Checkout)
- Bilingual support (Indonesian & Chinese)

### 2. Employee Management
- Add/Delete employees
- PIN registration
- Position & shift assignment

### 3. Admin Dashboard
- View all attendance logs
- Filter by date, position, type
- Export to CSV
- Real-time data sync

## 🛠️ Services

### attendanceService
```typescript
- getSettings()           // Get company settings
- getKaryawanByPin()      // Verify employee
- uploadPhoto()           // Upload to Supabase Storage
- saveAttendanceLog()     // Save attendance record
- capturePhoto()          // Capture from canvas
```

### adminService
```typescript
- getAllKaryawan()        // Fetch all employees
- getAllLogs()            // Fetch all logs
- addKaryawan()           // Add new employee
- deleteKaryawan()        // Delete employee
- deleteLog()             // Delete log entry
```

### mediaService
```typescript
- startVideoStream()      // Request camera & start stream
- stopVideoStream()       // Stop & cleanup stream
- requestCameraPermission() // Check camera permission
```

## 📝 Error Handling

Semua async operations memiliki proper error handling:
- Try-catch blocks untuk error catching
- Console logging untuk debugging
- User-friendly notifications via Swal

Contoh:
```typescript
try {
  const data = await someService.fetchData();
  // handle success
} catch (error) {
  console.error('Operation failed:', error);
  showNotification('error', 'Error', 'Failed message');
}
```

## 🎨 UI/UX Components

- **CameraPreview**: Live camera preview dengan loading state
- **PinInput**: Masked PIN input dengan length validation
- **AttendanceButtons**: Check-in/out buttons dengan loading state
- **KaryawanForm**: Form untuk tambah karyawan baru
- **KaryawanTable**: Searchable table karyawan
- **AttendanceTable**: Filterable attendance logs dengan image

## 🌐 Translations

Dua bahasa didukung: Indonesian (ID) & Chinese (CN)

Location: `src/constants/translations.ts`

Untuk menambah translation baru:
1. Add key di `translations.ID` dan `translations.CN`
2. Import `translations[lang]` di component
3. Akses: `translations[lang].keyName`

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `md` (768px), `lg` (1024px), `xl` (1280px)
- Tailwind CSS untuk styling

## 🧪 Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## 📚 Type Safety

Gunakan TypeScript interfaces dari `src/types/index.ts`:

```typescript
import { Karyawan, AttendanceLog, Settings, LanguageCode } from '@/types';
```

Jangan gunakan `any` type!

## 🔍 Key Improvements

✅ **Security**: Environment variables untuk credentials  
✅ **Type Safety**: Proper TypeScript interfaces  
✅ **Error Handling**: Try-catch & user notifications  
✅ **Code Organization**: Modular services & components  
✅ **Memory Management**: Proper cleanup untuk video streams  
✅ **i18n Support**: Built-in multilingual support  
✅ **Performance**: Code splitting & lazy loading ready  
✅ **Maintainability**: Separated concerns & reusable components  

## 📄 License

Buymoreworkers System 2024
