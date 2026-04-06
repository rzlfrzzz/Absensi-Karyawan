import React, { useState, useMemo } from 'react';
import { LanguageCode, AttendanceLog, Karyawan } from '../types';
import { translations, getJabatanLabel } from '../constants/translations';
import { attendanceHelper } from '../utils/attendanceHelper';
import { formatDateLocal, exportToCSV } from '../utils/helpers';

interface AttendanceTableProps {
  logs: AttendanceLog[];
  karyawan: Karyawan[];
  lang: LanguageCode;
  onDelete: (id: string) => void;
  filters: {
    dateStart: string;
    dateEnd: string;
    searchTerm: string;
    type: string;
    jabatan: string;
  };
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  logs,
  karyawan,
  lang,
  onDelete,
  filters,
}) => {
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

    exportToCSV(
      [headers, ...rows, ...extraRows],
      `Absensi_${filters.dateStart || 'All'}_${new Date().getTime()}.csv`
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-400 uppercase text-[9px] tracking-[0.3em] font-black sticky top-0">
          <tr>
            <th className="p-8 w-16">{translations[lang].colNo}</th>
            <th className="p-8">{translations[lang].colVisual}</th>
            <th className="p-8">{translations[lang].colInfo}</th>
            <th className="p-8">{translations[lang].colTime}</th>
            <th className="p-8 text-center">{translations[lang].colStatus}</th>
            <th className="p-8 text-right">{translations[lang].colAction}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 italic">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => {
              const statusLabel = attendanceHelper.getStatusLabel(log);
              return (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="p-8 font-black text-slate-300 text-xs">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden transition-transform group-hover:scale-105 flex items-center justify-center">
                      {log.foto_url ? (
                        <img
                          src={`${log.foto_url}?t=${new Date(log.created_at).getTime()}`}
                          className="w-full h-full object-cover"
                          alt="Attendance"
                        />
                      ) : (
                        <svg
                          className="w-4 h-4 text-slate-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="p-8">
                    <p className="text-slate-900 font-black uppercase text-xs tracking-tight">
                      {log.nama}
                    </p>
                    <p className="text-[8px] text-indigo-500 font-black uppercase tracking-widest">
                      {getJabatanLabel(lang, log.jabatan)}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter italic">
                      {formatDateLocal(log.created_at, lang === 'ID' ? 'id-ID' : 'zh-CN')}
                    </p>
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="text-indigo-600 font-black text-lg font-mono tracking-tighter">
                        {log.jam}
                      </span>
                      <span
                        className={`text-[8px] uppercase font-black tracking-widest ${
                          log.tipe.toUpperCase() === 'MASUK' ? 'text-emerald-500' : 'text-orange-500'
                        }`}
                      >
                        {log.tipe}
                      </span>
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    {statusLabel && (
                      <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] inline-block shadow-sm bg-rose-50 text-rose-600 border border-rose-100">
                        {statusLabel}
                      </span>
                    )}
                  </td>
                  <td className="p-8 text-right">
                    <button
                      onClick={() => onDelete(log.id)}
                      className="bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white p-2 rounded-xl transition-all"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={6}
                className="p-20 text-center text-slate-300 uppercase font-black tracking-widest text-xs italic"
              >
                {translations[lang].noData}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
