import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
import { translations } from '../../constants/translations';
import { chartService } from '../../services/chartService';
export const AttendanceChart = ({ data, lang, }) => {
    const trans = translations[lang];
    const colors = chartService.getChartColors();
    if (data.length === 0) {
        return (_jsx("div", { className: "bg-white rounded-2xl p-6 border border-slate-100 text-center", children: _jsx("p", { className: "text-slate-500 font-bold", children: trans.noData }) }));
    }
    return (_jsxs("div", { className: "bg-white rounded-2xl p-6 border border-slate-100", children: [_jsxs("h3", { className: "text-lg font-black text-slate-900 mb-4", children: ["\uD83D\uDCC8 ", trans.attendanceTrend] }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0" }), _jsx(XAxis, { dataKey: "date", stroke: "#94a3b8", style: { fontSize: '12px' } }), _jsx(YAxis, { stroke: "#94a3b8", style: { fontSize: '12px' } }), _jsx(Tooltip, { contentStyle: {
                                backgroundColor: '#1e293b',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                            } }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "present", stroke: colors.present, strokeWidth: 2, dot: { fill: colors.present, r: 4 }, activeDot: { r: 6 }, name: trans.presentEmployees }), _jsx(Line, { type: "monotone", dataKey: "late", stroke: colors.late, strokeWidth: 2, dot: { fill: colors.late, r: 4 }, activeDot: { r: 6 }, name: trans.lateArrivals }), _jsx(Line, { type: "monotone", dataKey: "onTime", stroke: colors.onTime, strokeWidth: 2, dot: { fill: colors.onTime, r: 4 }, activeDot: { r: 6 }, name: trans.onTimeCount })] }) })] }));
};
