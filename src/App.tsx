import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AttendanceForm } from './components/AttendanceForm';
import { Admin } from './components/Admin';
import { SettingsDashboard } from './components/Settings/SettingsDashboard';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';
import { LoginPage } from './pages/LoginPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { PayrollDashboard } from './pages/PayrollDashboard';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<AttendanceForm />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes - Backoffice */}
            <Route
              path="/backoffice"
              element={
                <ProtectedRoute requiredRole={['super_admin', 'hr_admin', 'manager']}>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - User Management (Super Admin Only) */}
            <Route
              path="/backoffice/users"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Payroll (HR Admin & Super Admin) */}
            <Route
              path="/backoffice/payroll"
              element={
                <ProtectedRoute requiredRole={['super_admin', 'hr_admin']}>
                  <PayrollDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Settings (Super Admin Only) */}
            <Route
              path="/backoffice/settings"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <SettingsDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Analytics (HR Admin & Super Admin) */}
            <Route
              path="/backoffice/analytics"
              element={
                <ProtectedRoute requiredRole={['super_admin', 'hr_admin']}>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
