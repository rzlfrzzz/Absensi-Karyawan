import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { translations } from '../../constants/translations';
export const KPICards = ({ present, late, absent, onTime, lang, }) => {
    const trans = translations[lang];
    const cards = [
        {
            label: trans.presentEmployees,
            value: present,
            icon: '✅',
            color: 'bg-green-50 border-green-200',
            textColor: 'text-green-700',
            badgeColor: 'bg-green-100',
        },
        {
            label: trans.lateArrivals,
            value: late,
            icon: '⏰',
            color: 'bg-amber-50 border-amber-200',
            textColor: 'text-amber-700',
            badgeColor: 'bg-amber-100',
        },
        {
            label: trans.absentEmployees,
            value: absent,
            icon: '❌',
            color: 'bg-red-50 border-red-200',
            textColor: 'text-red-700',
            badgeColor: 'bg-red-100',
        },
        {
            label: trans.onTimeCount,
            value: onTime,
            icon: '🎯',
            color: 'bg-blue-50 border-blue-200',
            textColor: 'text-blue-700',
            badgeColor: 'bg-blue-100',
        },
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: cards.map((card, index) => (_jsx("div", { className: `${card.color} border rounded-2xl p-6 hover:shadow-lg transition-all`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-slate-500 uppercase tracking-widest mb-2", children: card.label }), _jsx("p", { className: `text-3xl font-black ${card.textColor}`, children: card.value })] }), _jsx("div", { className: `${card.badgeColor} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl`, children: card.icon })] }) }, index))) }));
};
