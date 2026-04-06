# 🏗️ Arsitektur Sistem

## Ringkasan

AbsensiKaryawan dibangun dengan arsitektur **layered** yang memisahkan concerns:

```
┌─────────────────────────────────────┐
│     React UI Components             │
├─────────────────────────────────────┤
│     Custom Hooks & Contexts         │
├─────────────────────────────────────┤
│     Business Logic Services         │
├─────────────────────────────────────┤
│     Supabase Client                 │
├─────────────────────────────────────┤
│     Supabase Backend                │
└─────────────────────────────────────┘
```

---

## Stack Teknologi

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript |
| **Styling** | Tailwind CSS |
| **State Management** | React Context API |
| **Database** | Supabase (PostgreSQL) |
| **Build Tool** | Vite |

---

## Folder Structure

```
src/
├── components/          # React components
│   ├── Attendance/      # Attendance form & tracking
│   ├── Payroll/         # Payroll related
│   ├── Settings/        # Admin settings
│   └── User/            # User management
├── pages/               # Page components
├── services/            # Business logic
│   ├── attendanceService.ts
│   ├── payrollService.ts
│   ├── authServiceV2.ts
│   └── ...
├── hooks/               # Custom React hooks
├── contexts/            # React Context
├── types/               # TypeScript interfaces
├── constants/           # Constants & translations
├── utils/               # Helper functions
└── lib/                 # Library setup (Supabase)
```

---

## Alur Data

### 1. User Interaction Flow

```
User Input
    ↓
Component Handler
    ↓
Service Function
    ↓
Supabase Query
    ↓
Response Processing
    ↓
UI Update
```

### 2. Authentication Flow

```
Login Page
    ↓
authServiceV2.login()
    ↓
Supabase Auth
    ↓
Verify PIN + Check Company
    ↓
Load User Data
    ↓
Set AuthContext
    ↓
Redirect to Dashboard
```

### 3. Attendance Tracking Flow

```
Employee PIN Input
    ↓
attendanceService.getKaryawanByPin()
    ↓
Check-in/Check-out Logic
    ↓
Save to Attendance Table
    ↓
Show Confirmation
```

---

## Key Services

### 📋 Attendance Service
Mengelola check-in/check-out karyawan

```typescript
// Usage
const karyawan = await attendanceService.getKaryawanByPin(pin);
await attendanceService.recordAttendance(karyawanId, 'check-in');
```

### 💰 Payroll Service
Menghitung dan mengelola payroll

```typescript
const payroll = await payrollService.calculatePayroll(karyawanId, month);
```

### 👤 Auth Service
Mengelola autentikasi pengguna

```typescript
const user = await authServiceV2.login(pin, password);
```

### ⚙️ Settings Service
Mengelola pengaturan perusahaan

```typescript
const settings = await supabaseSettingsService.getSettings();
```

---

## Database Schema

### Main Tables

#### `karyawan` (Employees)
- `id` - UUID
- `pin` - Unique PIN
- `nama` - Employee name
- `email` - Email address
- `department` - Department
- `gaji_pokok` - Base salary

#### `attendance` (Attendance Records)
- `id` - UUID
- `karyawan_id` - FK to karyawan
- `check_in` - Check-in time
- `check_out` - Check-out time
- `date` - Attendance date

#### `payroll` (Payroll Records)
- `id` - UUID
- `karyawan_id` - FK to karyawan
- `bulan` - Month
- `tahun` - Year
- `total_gaji` - Total salary

---

## State Management

Menggunakan **React Context API** untuk global state:

```typescript
// AuthContext - Handle authentication state
const { user, isAuthenticated, logout } = useAuth();

// LanguageContext - Handle language preference
const { language, setLanguage } = useLanguage();
```

---

## Kode Pattern

### Component Pattern
```typescript
interface MyComponentProps {
  data: string;
  onAction: (value: string) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ data, onAction }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      // Do something
    } finally {
      setLoading(false);
    }
  };

  return <div>{data}</div>;
};
```

### Service Pattern
```typescript
export const myService = {
  async fetchData() {
    try {
      const { data, error } = await supabase
        .from('table')
        .select('*');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};
```

---

## Error Handling

Semua service mengikuti error handling pattern:

```typescript
try {
  // Business logic
} catch (error) {
  console.error('Specific Error:', error);
  throw error; // Propagate to component
}
```

Components menangkap error dan tampilkan notifikasi:

```typescript
try {
  await service.doSomething();
  showNotification('success', 'Done!');
} catch (error) {
  showNotification('error', 'Failed', error.message);
}
```

---

## Security

✅ **API Keys** - Menggunakan environment variables
✅ **Authentication** - Supabase Auth + PIN verification
✅ **Authorization** - Role-based access (admin/user)
✅ **Data Validation** - Input validation sebelum save
