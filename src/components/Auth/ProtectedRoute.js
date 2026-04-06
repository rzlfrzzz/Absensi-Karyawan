import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
export const ProtectedRoute = ({ children, requiredRole = 'employee', }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin", children: _jsx("div", { className: "w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full" }) }), _jsx("p", { className: "mt-4 text-slate-600", children: "Loading..." })] }) }));
    }
    if (!isAuthenticated || !user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // Check role permission
    const hasRole = Array.isArray(requiredRole)
        ? requiredRole.includes(user.role)
        : user.role === requiredRole;
    if (!hasRole) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-50", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-4xl font-black text-slate-900 mb-4", children: "403" }), _jsx("p", { className: "text-slate-600 mb-6", children: "Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini." }), _jsx("a", { href: "/backoffice", className: "text-indigo-600 hover:text-indigo-800 font-bold", children: "Kembali ke Dashboard" })] }) }));
    }
    return _jsx(_Fragment, { children: children });
};
