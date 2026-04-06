# 📊 Project Overview - Visual Guide

## 🎯 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Components  │  │  Components  │  │  Components  │       │
│  │   (UI Only)  │  │   (UI Only)  │  │   (UI Only)  │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │                │
│         └─────────────────┼─────────────────┘                │
│                           │                                  │
│         ┌─────────────────▼─────────────────┐               │
│         │   Services (Business Logic)       │               │
│         │  ┌──────────┐  ┌──────────┐      │               │
│         │  │Attendance│  │  Admin   │      │               │
│         │  │ Service  │  │ Service  │      │               │
│         │  └──────────┘  └──────────┘      │               │
│         └──────────────┬──────────────────┘                │
│                        │                                    │
│         ┌──────────────▼──────────────┐                    │
│         │   Supabase Client           │                    │
│         │  (src/lib/supabaseClient.ts)│                    │
│         └──────────────┬──────────────┘                    │
│                        │                                    │
│  ┌─────────────────────▼─────────────────────┐            │
│  │         Supabase Backend                  │            │
│  │  ┌─────────┐  ┌────────┐  ┌──────────┐  │            │
│  │  │Karyawan │  │  Logs  │  │ Settings │  │            │
│  │  │ Table   │  │ Table  │  │  Table   │  │            │
│  │  └─────────┘  └────────┘  └──────────┘  │            │
│  └─────────────────────────────────────────┘            │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
src/
│
├── 🎨 components/              (User Interface)
│   ├── AttendanceForm.tsx       Main attendance page
│   ├── Admin.tsx                Admin dashboard
│   ├── CameraPreview.tsx        Camera component
│   ├── PinInput.tsx             PIN input field
│   ├── AttendanceButtons.tsx    Check-in/out buttons
│   ├── KaryawanForm.tsx         Add employee form
│   ├── KaryawanTable.tsx        Employee list table
│   └── AttendanceTable.tsx      Attendance logs table
│
├── 🔧 services/                (Business Logic)
│   ├── attendanceService.ts     Attendance operations
│   ├── adminService.ts          Admin operations
│   └── mediaService.ts          Camera/Media operations
│
├── 📝 types/                   (Type Definitions)
│   └── index.ts                All TypeScript interfaces
│
├── 🛠️ utils/                   (Helper Functions)
│   ├── helpers.ts              General utilities
│   └── attendanceHelper.ts     Attendance helpers
│
├── ⚙️ constants/               (Constants)
│   └── translations.ts         i18n & jabatan list
│
├── 📚 lib/                     (External Setup)
│   └── supabaseClient.ts       Supabase client
│
├── App.tsx                     Main router
├── main.tsx                    Entry point
└── index.css                   Global styles
```

---

## 🔄 Data Flow

### Attendance Flow
```
User Input (PIN)
    ↓
AttendanceForm Component
    ↓
attendanceService.getKaryawanByPin()
    ↓
Verify employee in database
    ↓
Capture Photo from camera
    ↓
attendanceService.uploadPhoto()
    ↓
Upload to Supabase Storage
    ↓
Get public URL
    ↓
attendanceHelper.determineStatus()
    ↓
Calculate On Time / Late / Early Checkout
    ↓
attendanceService.saveAttendanceLog()
    ↓
Save to database
    ↓
showNotification() → User sees result
```

### Admin Flow
```
Admin opens dashboard
    ↓
Admin Component mounts
    ↓
adminService.getAllKaryawan()  +  adminService.getAllLogs()
    ↓
Fetch from Supabase
    ↓
Display in KaryawanTable & AttendanceTable
    ↓
User filters/searches
    ↓
Tables re-render with filtered data
    ↓
User can add/delete employee or log
    ↓
Service operations complete
    ↓
Data refreshes
```

---

## 🧩 Component Composition

### AttendanceForm Page
```
<AttendanceForm>
  ├── <CameraPreview>
  │   ├── video element
  │   ├── canvas element
  │   └── Loading state
  ├── <PinInput>
  │   └── password input
  ├── <AttendanceButtons>
  │   ├── Check-in button
  │   └── Check-out button
  └── Language toggle
```

### Admin Page
```
<Admin>
  ├── Header
  ├── <KaryawanForm>          (Left column)
  ├── <KaryawanTable>         (Right column - 2 columns wide)
  └── Attendance Log Section
      ├── Filters
      │   ├── Date range
      │   ├── Position filter
      │   └── Type filter
      └── <AttendanceTable>
          ├── Photo column
          ├── Employee info column
          ├── Time & type column
          └── Status column
```

---

## 🔐 Security Architecture

```
┌──────────────────────────────────┐
│   Browser Environment            │
│  .env.local (runtime loaded)     │
│  VITE_SUPABASE_URL               │
│  VITE_SUPABASE_ANON_KEY          │
└──────────────┬───────────────────┘
               │
        ┌──────▼────────┐
        │  Build Time   │
        │  .env.example │
        │  (template)   │
        └───────────────┘

User's credentials NEVER in source code ✅
Credentials loaded at runtime ✅
.gitignore protects .env.local ✅
.env.example safe to commit ✅
```

---

## 🎯 Service Layer Pattern

```typescript
// Each service follows this pattern:

export const myService = {
  // 1. Try operation
  async getData() {
    try {
      // 2. Call API/Database
      const { data, error } = await supabase.from('table')...

      // 3. Handle error
      if (error) throw error;

      // 4. Return result
      return data;
    } catch (error) {
      // 5. Log error
      console.error('Failed:', error);

      // 6. Return safe default
      return null;
    }
  }
}
```

---

## 🎨 Component Pattern

```typescript
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      // Call service
      await someService.operation();
      // Show success
      showNotification('success', 'Success', 'Operation completed');
      onAction?.();
    } catch (error) {
      // Show error
      showNotification('error', 'Error', 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleAction} disabled={loading}>
        {loading ? 'Loading...' : 'Action'}
      </button>
    </div>
  );
};
```

---

## 📊 Type System

```
Karyawan
├── id: string
├── nama: string
├── pin: string
├── shift: 'Siang' | 'Malam'
├── jabatan: string
└── created_at?: string

AttendanceLog
├── id: string
├── karyawan_id: string
├── nama: string
├── tipe: 'MASUK' | 'PULANG'
├── jam: string (HH:MM)
├── status: string
├── foto_url: string
├── jabatan: string
├── shift: string
└── created_at: string

Settings
├── jam_masuk_siang: string (HH:MM)
├── jam_pulang_siang: string (HH:MM)
├── jam_masuk_malam: string (HH:MM)
└── jam_pulang_malam: string (HH:MM)
```

---

## 🔄 State Management

```
Each component manages its own state:

<AttendanceForm>
  - pin: string
  - settings: Settings | null
  - loading: boolean
  - lang: LanguageCode

<Admin>
  - karyawan: Karyawan[]
  - logs: AttendanceLog[]
  - loading: boolean
  - filters: {...}
  - lang: LanguageCode
```

Props flow down, events bubble up ↑

---

## 🚀 Performance Optimizations

```
✅ React.memo on tables
   → Prevents unnecessary re-renders

✅ useMemo for filtered data
   → Recalculate only when filters change

✅ useCallback for event handlers
   → Prevents function recreation

✅ Lazy loading ready
   → Components can be code-split

✅ Proper cleanup in useEffect
   → No memory leaks
```

---

## 📱 Responsive Breakpoints

```
Mobile (< 768px)
  └─ Stack layout vertically

Tablet (768px - 1024px)
  └─ 2-column layout

Desktop (> 1024px)
  └─ 3-column layout
```

---

## 🎓 Key Takeaways

```
1. Separation of Concerns
   Components → UI only
   Services → Logic only
   Utils → Helpers only

2. Type Safety
   No 'any' types
   Interfaces for all data
   Props validation

3. Error Handling
   Try-catch everywhere
   User feedback
   Console logging

4. Security
   Credentials in .env
   No hardcoding
   Environment variables

5. Maintainability
   Modular structure
   Self-documenting code
   Easy to extend
```

---

## 🎉 Result

Clean, maintainable, production-ready codebase! ✨

```
       ┌─────────────────┐
       │  Professional  │
       │   Codebase     │
       └─────┬───────────┘
             │
      ┌──────┴──────┐
      │             │
   Secure      Scalable
      │             │
      └──────┬──────┘
             │
        Type-Safe
```

---

This is your new project structure! 🚀
