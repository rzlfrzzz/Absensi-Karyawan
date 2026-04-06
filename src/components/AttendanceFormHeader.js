import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { translations } from '../constants/translations';
export const AttendanceFormHeader = ({ lang, settings, }) => {
    return (_jsx("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50 p-6", children: _jsxs("div", { className: "w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white rounded-[3.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center relative overflow-hidden", children: [_jsxs("h1", { className: "text-3xl font-black mb-1 text-slate-900 italic uppercase", children: ["Digital", _jsx("span", { className: "text-indigo-600", children: "Absensi" })] }), _jsx("p", { className: "text-[9px] text-slate-400 font-bold tracking-[0.3em] mb-6 uppercase tracking-widest", children: translations[lang].tagline })] }) }));
};
