import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { translations } from '../../constants/translations';
import { chartService } from '../../services/chartService';
export const LateReasonsChart = ({ data, lang, }) => {
    const trans = translations[lang];
    const colors = chartService.getChartColors();
    if (data.length === 0) {
        return (_jsx("div", { className: "bg-white rounded-2xl p-6 border border-slate-100 text-center", children: _jsx("p", { className: "text-slate-500 font-bold", children: trans.noData }) }));
    }
    const COLORS = [
        colors.present,
        colors.late,
        colors.absent,
        colors.primary,
        colors.secondary,
    ];
    return (_jsxs("div", { className: "bg-white rounded-2xl p-6 border border-slate-100", children: [_jsxs("h3", { className: "text-lg font-black text-slate-900 mb-4", children: ["\uD83D\uDCCA ", trans.lateReasons] }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: data, cx: "50%", cy: "50%", labelLine: false, label: ({ name }) => `${name}`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: data.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: {
                                backgroundColor: '#1e293b',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                            } })] }) })] }));
};
