import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { translations } from '../constants/translations';
export const AttendanceButtons = ({ onCheckIn, onCheckOut, loading, lang, }) => {
    return (_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("button", { onClick: onCheckIn, disabled: loading, className: "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-5 rounded-[1.5rem] font-black text-xs tracking-widest transition-all shadow-xl shadow-indigo-100 uppercase", children: loading ? '...' : translations[lang].attendanceIn }), _jsx("button", { onClick: onCheckOut, disabled: loading, className: "bg-slate-900 hover:bg-black disabled:bg-slate-700 text-white py-5 rounded-[1.5rem] font-black text-xs tracking-widest transition-all uppercase", children: loading ? '...' : translations[lang].attendanceOut })] }));
};
