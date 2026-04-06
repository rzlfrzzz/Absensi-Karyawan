import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { translations } from '../../constants/translations';
export const PerformanceRanking = ({ data, lang, }) => {
    const trans = translations[lang];
    if (data.length === 0) {
        return (_jsx("div", { className: "bg-white rounded-2xl p-6 border border-slate-100 text-center", children: _jsx("p", { className: "text-slate-500 font-bold", children: trans.noData }) }));
    }
    const getMedalIcon = (rank) => {
        switch (rank) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return '📍';
        }
    };
    const getRankColor = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-yellow-50 border-yellow-200';
            case 2:
                return 'bg-slate-50 border-slate-200';
            case 3:
                return 'bg-orange-50 border-orange-200';
            default:
                return 'bg-white border-slate-100';
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-2xl p-6 border border-slate-100", children: [_jsxs("h3", { className: "text-lg font-black text-slate-900 mb-4", children: ["\uD83C\uDFC6 ", trans.topPerformers] }), _jsx("div", { className: "space-y-3", children: data.map((perf, index) => (_jsxs("div", { className: `${getRankColor(index + 1)} border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all`, children: [_jsxs("div", { className: "flex items-center gap-4 flex-1", children: [_jsx("div", { className: "text-3xl font-black w-12 text-center", children: getMedalIcon(index + 1) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-bold text-slate-900", children: perf.nama }), _jsx("p", { className: "text-xs text-slate-500", children: perf.jabatan })] })] }), _jsxs("div", { className: "text-right space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-2xl font-black text-indigo-600", children: [perf.attendanceRate.toFixed(1), "%"] }), _jsx("span", { className: "text-xs font-bold text-slate-400 uppercase", children: trans.attendancePercent })] }), _jsxs("div", { className: "text-xs font-bold text-slate-500", children: [trans.presentEmployees, ": ", perf.presentDays, "/", perf.totalDays, ' ', trans.lateArrivals, ": ", perf.lateDays] })] })] }, perf.karyawan_id))) })] }));
};
