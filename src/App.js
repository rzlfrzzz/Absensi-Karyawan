import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(LanguageProvider, { children: _jsx(AuthProvider, { children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(AttendanceForm, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/backoffice", element: _jsx(ProtectedRoute, { requiredRole: ['super_admin', 'hr_admin', 'manager'], children: _jsx(Admin, {}) }) }), _jsx(Route, { path: "/backoffice/users", element: _jsx(ProtectedRoute, { requiredRole: "super_admin", children: _jsx(UserManagementPage, {}) }) }), _jsx(Route, { path: "/backoffice/payroll", element: _jsx(ProtectedRoute, { requiredRole: ['super_admin', 'hr_admin'], children: _jsx(PayrollDashboard, {}) }) }), _jsx(Route, { path: "/backoffice/settings", element: _jsx(ProtectedRoute, { requiredRole: "super_admin", children: _jsx(SettingsDashboard, {}) }) }), _jsx(Route, { path: "/backoffice/analytics", element: _jsx(ProtectedRoute, { requiredRole: ['super_admin', 'hr_admin'], children: _jsx(AnalyticsDashboard, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }) }));
}
export default App;
