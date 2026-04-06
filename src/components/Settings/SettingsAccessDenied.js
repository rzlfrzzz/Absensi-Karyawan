import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
export const SettingsAccessDenied = () => {
    return (_jsx("div", { className: "min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6", children: _jsxs("div", { className: "text-center max-w-md", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDD12" }), _jsx("h1", { className: "text-4xl font-black text-slate-900 mb-2", children: "Access Denied" }), _jsx("p", { className: "text-slate-600 text-sm mb-6", children: "Hanya admin yang dapat mengakses halaman settings management." }), _jsx("div", { className: "space-y-3", children: _jsx(Link, { to: "/backoffice", className: "inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm uppercase transition-all", children: "Kembali ke Dashboard" }) })] }) }));
};
