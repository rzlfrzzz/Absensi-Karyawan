import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { translations, getJabatanLabel } from '../constants/translations';
import { attendanceHelper } from '../utils/attendanceHelper';
import { formatDateLocal, exportToCSV } from '../utils/helpers';
export const AttendanceTable = ({ logs, karyawan, lang, onDelete, filters, }) => {
    const filteredLogs = useMemo(() => {
        console.log('🔍 Filtering logs:', { total: logs.length, filters });
        const result = logs.filter((log) => {
            const logDate = log.created_at.split('T')[0];
            const matchesDate = filters.dateStart
                ? filters.dateEnd
                    ? logDate >= filters.dateStart && logDate <= filters.dateEnd
                    : logDate === filters.dateStart
                : true;
            const matchesSearch = log.nama.toLowerCase().includes(filters.searchTerm.toLowerCase());
            const matchesType = filters.type === 'ALL' ? true : log.tipe.toUpperCase() === filters.type;
            const matchesJabatan = filters.jabatan === 'ALL' ? true : log.jabatan === filters.jabatan;
            return matchesDate && matchesSearch && matchesType && matchesJabatan;
        });
        console.log('✅ Filtered result:', result.length, 'logs');
        return result;
    }, [logs, filters]);
    const handleExport = () => {
        const headers = [
            translations[lang].colNo,
            translations[lang].colName,
            translations[lang].colJabatan,
            'Shift',
            'Type',
            'Time',
            'Date',
            translations[lang].colStatus,
        ];
        const rows = filteredLogs.map((log, i) => [
            String(i + 1),
            log.nama,
            getJabatanLabel(lang, log.jabatan),
            '-',
            log.tipe,
            log.jam,
            log.created_at.split('T')[0],
            attendanceHelper.getStatusLabel(log),
        ]);
        const extraRows = [
            [],
            [
                `${translations[lang].totalExport}: ${new Set(filteredLogs.map((l) => l.nama)).size}`,
            ],
        ];
        exportToCSV([headers, ...rows, ...extraRows], `Absensi_${filters.dateStart || 'All'}_${new Date().getTime()}.csv`);
    };
    return (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-slate-50 text-slate-400 uppercase text-[9px] tracking-[0.3em] font-black sticky top-0", children: _jsxs("tr", { children: [_jsx("th", { className: "p-8 w-16", children: translations[lang].colNo }), _jsx("th", { className: "p-8", children: translations[lang].colVisual }), _jsx("th", { className: "p-8", children: translations[lang].colInfo }), _jsx("th", { className: "p-8", children: translations[lang].colTime }), _jsx("th", { className: "p-8 text-center", children: translations[lang].colStatus }), _jsx("th", { className: "p-8 text-right", children: translations[lang].colAction })] }) }), _jsx("tbody", { className: "divide-y divide-slate-50 italic", children: filteredLogs.length > 0 ? (filteredLogs.map((log, index) => {
                        const statusLabel = attendanceHelper.getStatusLabel(log);
                        return (_jsxs("tr", { className: "hover:bg-slate-50/80 transition-all group", children: [_jsx("td", { className: "p-8 font-black text-slate-300 text-xs", children: String(index + 1).padStart(2, '0') }), _jsx("td", { className: "p-6", children: _jsx("div", { className: "w-14 h-14 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden transition-transform group-hover:scale-105 flex items-center justify-center", children: log.foto_url ? (_jsx("img", { src: `${log.foto_url}?t=${new Date(log.created_at).getTime()}`, className: "w-full h-full object-cover", alt: "Attendance" })) : (_jsx("svg", { className: "w-4 h-4 text-slate-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) })) }) }), _jsxs("td", { className: "p-8", children: [_jsx("p", { className: "text-slate-900 font-black uppercase text-xs tracking-tight", children: log.nama }), _jsx("p", { className: "text-[8px] text-indigo-500 font-black uppercase tracking-widest", children: getJabatanLabel(lang, log.jabatan) }), _jsx("p", { className: "text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter italic", children: formatDateLocal(log.created_at, lang === 'ID' ? 'id-ID' : 'zh-CN') })] }), _jsx("td", { className: "p-8", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-indigo-600 font-black text-lg font-mono tracking-tighter", children: log.jam }), _jsx("span", { className: `text-[8px] uppercase font-black tracking-widest ${log.tipe.toUpperCase() === 'MASUK' ? 'text-emerald-500' : 'text-orange-500'}`, children: log.tipe })] }) }), _jsx("td", { className: "p-8 text-center", children: statusLabel && (_jsx("span", { className: "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] inline-block shadow-sm bg-rose-50 text-rose-600 border border-rose-100", children: statusLabel })) }), _jsx("td", { className: "p-8 text-right", children: _jsx("button", { onClick: () => onDelete(log.id), className: "bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white p-2 rounded-xl transition-all", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) }) })] }, log.id));
                    })) : (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "p-20 text-center text-slate-300 uppercase font-black tracking-widest text-xs italic", children: translations[lang].noData }) })) })] }) }));
};
