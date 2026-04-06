import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { translations } from '../../constants/translations';
import { analyticsService } from '../../services/analyticsService';
export const DateRangeFilter = ({ onApply, lang, }) => {
    const trans = translations[lang];
    const dateOptions = analyticsService.getDateRangeOptions();
    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(dateOptions.thisMonth.start);
    const [endDate, setEndDate] = useState(dateOptions.thisMonth.end);
    const handleQuickSelect = (key) => {
        const option = dateOptions[key];
        setStartDate(option.start);
        setEndDate(option.end);
    };
    const handleApply = () => {
        onApply(startDate, endDate);
    };
    const handleReset = () => {
        setStartDate(dateOptions.thisMonth.start);
        setEndDate(dateOptions.thisMonth.end);
        onApply(dateOptions.thisMonth.start, dateOptions.thisMonth.end);
    };
    return (_jsxs("div", { className: "bg-white rounded-2xl p-6 border border-slate-100 mb-8", children: [_jsxs("h3", { className: "text-lg font-black text-slate-900 mb-4", children: ["\uD83D\uDCC5 ", trans.dateRange] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [_jsx("button", { onClick: () => handleQuickSelect('thisMonth'), className: `px-4 py-2 rounded-lg font-bold text-sm transition-all ${startDate === dateOptions.thisMonth.start &&
                                    endDate === dateOptions.thisMonth.end
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`, children: trans.monthlyStats }), _jsx("button", { onClick: () => handleQuickSelect('lastMonth'), className: `px-4 py-2 rounded-lg font-bold text-sm transition-all ${startDate === dateOptions.lastMonth.start &&
                                    endDate === dateOptions.lastMonth.end
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`, children: "Last Month" }), _jsx("button", { onClick: () => handleQuickSelect('thisYear'), className: `px-4 py-2 rounded-lg font-bold text-sm transition-all ${startDate === dateOptions.thisYear.start &&
                                    endDate === dateOptions.thisYear.end
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`, children: trans.allTime })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-600 uppercase mb-2", children: trans.fromDate }), _jsx("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), max: endDate, className: "w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-600 uppercase mb-2", children: trans.toDate }), _jsx("input", { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), min: startDate, max: today, className: "w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100" })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: handleApply, className: "px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm uppercase transition-all", children: ["\u2705 ", trans.applyFilter] }), _jsxs("button", { onClick: handleReset, className: "px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold text-sm uppercase transition-all", children: ["\uD83D\uDD04 ", trans.resetFilter] })] })] })] }));
};
