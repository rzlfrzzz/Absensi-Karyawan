import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { translations } from '../../constants/translations';
export const StatisticsCards = ({ attendanceRate, avgLateMinutes, totalAbsentDays, totalLateCount, lang, }) => {
    const trans = translations[lang];
    const stats = [
        {
            label: trans.attendanceRate,
            value: `${attendanceRate.toFixed(1)}%`,
            icon: '📊',
            color: 'bg-indigo-50 border-indigo-200',
            textColor: 'text-indigo-700',
        },
        {
            label: trans.avgLateMinutes,
            value: `${avgLateMinutes} min`,
            icon: '⏱️',
            color: 'bg-orange-50 border-orange-200',
            textColor: 'text-orange-700',
        },
        {
            label: trans.totalAbsent,
            value: totalAbsentDays,
            icon: '❌',
            color: 'bg-red-50 border-red-200',
            textColor: 'text-red-700',
        },
        {
            label: trans.lateArrivals,
            value: totalLateCount,
            icon: '⏰',
            color: 'bg-amber-50 border-amber-200',
            textColor: 'text-amber-700',
        },
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: stats.map((stat, index) => (_jsx("div", { className: `${stat.color} border rounded-2xl p-6 hover:shadow-lg transition-all`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-slate-500 uppercase tracking-widest mb-2", children: stat.label }), _jsx("p", { className: `text-2xl font-black ${stat.textColor}`, children: stat.value })] }), _jsx("div", { className: "text-3xl", children: stat.icon })] }) }, index))) }));
};
