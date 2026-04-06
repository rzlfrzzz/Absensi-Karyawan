import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Email dan password harus diisi');
            return;
        }
        try {
            await login(email, password);
            navigate('/backoffice', { replace: true });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Login gagal');
            setPassword('');
        }
    };
    return (_jsx("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50 p-6", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsxs("h1", { className: "text-4xl font-black text-slate-900 italic uppercase mb-2", children: ["Digital", _jsx("span", { className: "text-indigo-600", children: "Absensi" })] }), _jsx("p", { className: "text-slate-500 text-sm font-bold tracking-widest uppercase", children: "Backoffice Admin Access" })] }), _jsxs("div", { className: "bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]", children: [_jsx("h2", { className: "text-2xl font-black text-slate-900 mb-1", children: "Login" }), _jsx("p", { className: "text-slate-400 text-sm font-bold mb-6", children: "Masukkan kredensial untuk akses backoffice" }), error && (_jsx("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl", children: _jsxs("p", { className: "text-red-600 font-bold text-sm", children: ["\u274C ", error] }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Masukkan email", disabled: isLoading, className: "w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed", autoFocus: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Masukkan password", disabled: isLoading, className: "w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed", onKeyPress: (e) => e.key === 'Enter' && handleSubmit(e) }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all", children: showPassword ? '👁️‍🗨️' : '👁️' })] })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 mt-6 transition-all active:scale-95 disabled:cursor-not-allowed", children: isLoading ? '🔄 Memproses...' : '🔐 Login' })] }), _jsxs("div", { className: "mt-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl", children: [_jsx("p", { className: "text-xs font-black text-blue-600 uppercase mb-3", children: "\uD83D\uDCDD Demo Credentials:" }), _jsxs("div", { className: "space-y-2 text-xs", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-600", children: "Admin:" }), _jsx("span", { className: "text-slate-900 font-mono font-bold", children: "admin / admin123" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-600", children: "Manager:" }), _jsx("span", { className: "text-slate-900 font-mono font-bold", children: "manager / manager123" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-600", children: "Staff:" }), _jsx("span", { className: "text-slate-900 font-mono font-bold", children: "staff / staff123" })] })] })] })] }), _jsx("div", { className: "text-center mt-6", children: _jsx("p", { className: "text-xs text-slate-400 font-bold", children: "Session timeout: 1 jam \u2022 Plain password (demo only)" }) })] }) }));
};
