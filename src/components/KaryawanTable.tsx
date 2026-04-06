import React, { useMemo } from 'react';
import { LanguageCode, Karyawan } from '../types';
import { translations, getDaftarJabatan, getJabatanLabel } from '../constants/translations';

interface KaryawanTableProps {
  data: Karyawan[];
  lang: LanguageCode;
  searchTerm: string;
  onDelete: (id: string, name: string) => void;
}

export const KaryawanTable: React.FC<KaryawanTableProps> = ({
  data,
  lang,
  searchTerm,
  onDelete,
}) => {
  const daftarJabatan = getDaftarJabatan(lang);

  const filteredData = useMemo(() => {
    return data.filter((k) => k.nama.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 lg:col-span-2 shadow-sm relative overflow-hidden flex flex-col h-[500px]">
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400"></div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h2 className="text-xl font-black uppercase italic text-slate-900">
            {translations[lang].listTitle}
          </h2>
          <span className="text-[10px] font-black text-indigo-400 uppercase italic">
            {data.length} {translations[lang].members}
          </span>
        </div>
      </div>
      <div className="overflow-y-auto pr-2 custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
              <th className="pb-4 pl-4">{translations[lang].colName}</th>
              <th className="pb-4 text-center">{translations[lang].colJabatan}</th>
              <th className="pb-4 text-center">PIN</th>
              <th className="pb-4 text-center">{translations[lang].colShift}</th>
              <th className="pb-4 text-right pr-4">{translations[lang].colOpt}</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((k) => (
              <tr key={k.id} className="bg-slate-50/50 hover:bg-slate-50 transition-all">
                <td className="py-4 pl-4 rounded-l-2xl font-black text-xs uppercase italic text-slate-700">
                  {k.nama}
                </td>
                <td className="py-4 text-center text-[9px] font-black text-indigo-400 uppercase italic">
                  {getJabatanLabel(lang, k.jabatan)}
                </td>
                <td className="py-4 text-center font-mono text-indigo-600 font-bold tracking-widest text-xs">
                  {k.pin}
                </td>
                <td className="py-4 text-center">
                  <span className="text-[9px] font-bold bg-white border border-slate-200 px-2 py-1 rounded-lg uppercase">
                    {k.shift === 'Siang' ? translations[lang].shiftSiang : translations[lang].shiftMalam}
                  </span>
                </td>
                <td className="py-4 text-right pr-4 rounded-r-2xl">
                  <button
                    onClick={() => onDelete(k.id, k.nama)}
                    className="text-rose-400 hover:text-rose-600 p-2 transition-all active:scale-90"
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
            ))}
          </tbody>
        </table>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }`}</style>
    </div>
  );
};
