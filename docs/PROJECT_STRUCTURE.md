# 📁 Project Structure

## Overview

```
AbsensiKaryawan/
├── src/
│   ├── components/          # React UI Components
│   ├── pages/               # Page Components
│   ├── services/            # Business Logic
│   ├── hooks/               # Custom Hooks
│   ├── contexts/            # React Context
│   ├── types/               # TypeScript Types
│   ├── constants/           # Constants
│   ├── utils/               # Utilities
│   ├── lib/                 # Library Setup
│   ├── index.css            # Global Styles
│   └── main.tsx             # Entry Point
├── dist/                    # Build Output
├── docs/                    # Documentation
├── public/                  # Static Assets
├── .github/                 # GitHub Config
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript Config
├── vite.config.ts           # Vite Config
└── .gitignore               # Git Ignore
```

---

## Detailed Structure

### `/src/components`

Berisi semua React Components yang diorganisir per fitur:

```
components/
├── Attendance/
│   ├── AttendanceForm.tsx       # Check-in/check-out form
│   ├── AttendanceTracking.tsx   # Tracking dashboard
│   └── AttendanceHistory.tsx    # History viewer
├── Payroll/
│   ├── CreatePayrollForm.tsx    # Create payroll
│   ├── PaymentTrackingForm.tsx  # Payment tracking
│   └── PayrollTable.tsx         # Display payroll
├── Settings/
│   ├── SettingsDashboard.tsx    # Settings main
│   ├── CompanySettingsForm.tsx  # Company info
│   ├── ShiftSettingsForm.tsx    # Shift settings
│   ├── BonusRulesEditor.tsx     # Bonus rules
│   └── HolidayCalendar.tsx      # Holiday calendar
├── User/
│   ├── CreateEditUserForm.tsx   # User CRUD
│   └── UserTable.tsx            # User listing
├── Admin.tsx                    # Admin dashboard
├── Dashboard.tsx                # Main dashboard
├── LanguageSwitcher.tsx         # Language selector
└── PinInput.tsx                 # PIN input component
```

**Naming Convention:**
- PascalCase untuk component names
- File = Component name
- Tambahkan `.tsx` extension

---

### `/src/pages`

Page-level components:

```
pages/
├── LoginPage.tsx            # Login page
├── PayrollDashboard.tsx     # Payroll page
└── UserManagementPage.tsx   # User management page
```

---

### `/src/services`

Business logic layer:

```
services/
├── attendanceService.ts         # Attendance operations
├── payrollService.ts            # Payroll calculations
├── authServiceV2.ts             # Authentication
├── userManagementService.ts     # User management
├── supabaseSettingsService.ts   # Settings
├── adminService.ts              # Admin operations
├── analyticsService.ts          # Analytics
├── exportService.ts             # Export functionality
├── mediaService.ts              # Media uploads
├── chartService.ts              # Chart data
└── [more services...]
```

**Service Pattern:**

```typescript
export const attendanceService = {
  async getKaryawanByPin(pin: string) { /* ... */ },
  async recordAttendance(karyawanId: string, type: 'check-in' | 'check-out') { /* ... */ },
  async getAttendanceHistory(karyawanId: string, month: number) { /* ... */ },
};
```

---

### `/src/hooks`

Custom React Hooks:

```
hooks/
├── useAuth.ts               # Auth context hook
└── useLanguage.ts           # Language context hook
```

**Usage:**

```typescript
const { user, isAuthenticated } = useAuth();
const { language, setLanguage } = useLanguage();
```

---

### `/src/contexts`

Global state management:

```
contexts/
├── AuthContext.tsx          # Authentication state
└── LanguageContext.tsx      # Language preference
```

---

### `/src/types`

TypeScript type definitions:

```
types/
└── index.ts                 # All type definitions
```

**Example Types:**

```typescript
export interface Karyawan {
  id: string;
  pin: string;
  nama: string;
  email: string;
  department: string;
  gaji_pokok: number;
}

export interface Attendance {
  id: string;
  karyawan_id: string;
  check_in: Date;
  check_out?: Date;
  date: string;
}
```

---

### `/src/constants`

Constants dan static data:

```
constants/
├── translations.ts          # Multi-language strings
└── settingsDefaults.ts      # Default settings
```

**Translations Pattern:**

```typescript
export const translations = {
  ID: {
    login: 'Masuk',
    logout: 'Keluar',
    welcome: 'Selamat datang',
    // ...
  },
  CN: {
    login: '登录',
    logout: '登出',
    welcome: '欢迎',
    // ...
  },
};
```

---

### `/src/utils`

Helper functions:

```
utils/
├── helpers.ts               # General utilities
├── attendanceHelper.ts      # Attendance utilities
└── [more helpers...]
```

**Common Utilities:**

```typescript
// Notifications
showNotification(type, title, message);

// Date formatting
formatDate(date);
formatTime(time);

// Calculations
calculateTotalHours(checkIn, checkOut);
```

---

### `/src/lib`

Library setup:

```
lib/
└── supabaseClient.ts        # Supabase client initialization
```

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);
```

---

### `/docs`

Documentation files:

```
docs/
├── INSTALLATION.md          # Setup instructions
├── ARCHITECTURE.md          # System architecture
├── PROJECT_STRUCTURE.md     # This file
├── API.md                   # API documentation
├── DATABASE.md              # Database schema
├── DEPLOYMENT.md            # Deployment guide
├── TROUBLESHOOTING.md       # Troubleshooting
└── DEVELOPMENT.md           # Development guide
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `AttendanceForm.tsx` |
| Services | camelCase | `attendanceService.ts` |
| Hooks | camelCase with use prefix | `useAuth.ts` |
| Types | PascalCase | `Karyawan` |
| Constants | UPPER_SNAKE_CASE | `MAX_ATTEMPTS` |
| Utilities | camelCase | `formatDate.ts` |

---

## Import Paths

Gunakan path alias untuk imports yang lebih clean:

```typescript
// ❌ Bad
import { MyComponent } from '../../../components/MyComponent';

// ✅ Good
import { MyComponent } from '@/components/MyComponent';
```

Path aliases defined di `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## Adding New Features

### 1. Create Component
```bash
# /src/components/MyFeature/MyComponent.tsx
```

### 2. Create Service
```bash
# /src/services/myFeatureService.ts
```

### 3. Add Types (if needed)
```bash
# Update /src/types/index.ts
```

### 4. Use in Page
```typescript
import { MyComponent } from '@/components/MyFeature/MyComponent';
import { myFeatureService } from '@/services/myFeatureService';
```

---

## Best Practices

✅ Keep components small and focused
✅ Move business logic to services
✅ Use TypeScript for type safety
✅ Follow naming conventions
✅ Keep imports organized with aliases
✅ Use composition over inheritance
✅ Handle errors gracefully
✅ Write meaningful comments only when needed
