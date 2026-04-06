import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
export const LogoutButton = () => {
    const { logout, getSessionInfo } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const sessionInfo = getSessionInfo();
    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await logout();
            navigate('/login', { replace: true });
        }
        catch (error) {
            console.error('Logout error:', error);
        }
        finally {
            setIsLoading(false);
            setShowConfirm(false);
        }
    };
    return (_jsxs("div", { className: "relative group", children: [_jsxs("button", { onClick: () => setShowConfirm(true), className: "flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase transition-all", title: `${sessionInfo?.remaining_minutes || 0}m tersisa`, children: [_jsx("span", { className: "text-lg", children: "\uD83D\uDEAA" }), _jsx("span", { children: "Logout" }), sessionInfo && (_jsxs("span", { className: "text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-lg", children: [sessionInfo.remaining_minutes, "m"] }))] }), showConfirm && (_jsx("div", { className: "fixed inset-0 bg-black/20 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-2xl max-w-sm mx-4", children: [_jsx("h3", { className: "text-xl font-black text-slate-900 mb-2", children: "Logout Confirm" }), _jsx("p", { className: "text-slate-600 text-sm mb-6", children: "Apakah Anda yakin ingin logout? Session Anda akan berakhir." }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setShowConfirm(false), disabled: isLoading, className: "flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm uppercase transition-all disabled:opacity-50", children: "Batal" }), _jsx("button", { onClick: handleLogout, disabled: isLoading, className: "flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm uppercase transition-all disabled:bg-red-400", children: isLoading ? 'Logging out...' : 'Ya, Logout' })] })] }) }))] }));
};
