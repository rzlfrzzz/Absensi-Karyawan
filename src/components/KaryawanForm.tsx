import React, { useState } from 'react';
import { LanguageCode, Karyawan } from '../types';
import { translations, getDaftarJabatan } from '../constants/translations';

interface KaryawanFormProps {
  lang: LanguageCode;
  onSubmit: (data: { nama: string; pin: string; jabatan: string; shift: string }) => void;
  isSubmitting: boolean;
}

export const KaryawanForm: React.FC<KaryawanFormProps> = ({
  lang,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({
    nama: '',
    pin: '',
    jabatan: '',
    shift: 'Siang',
  });

  const daftarJabatan = getDaftarJabatan(lang);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ nama: '', pin: '', jabatan: '', shift: 'Siang' });
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden h-fit">
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
      <h2 className="text-xl font-black mb-6 uppercase italic text-slate-900">
        {translations[lang].regTitle}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder={translations[lang].namePlace}
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          required
        />
        <input
          type="text"
          placeholder={translations[lang].pinPlace}
          value={formData.pin}
          onChange={(e) => setFormData({ ...formData, pin: e.target.value.slice(0, 4) })}
          maxLength={4}
          className="w-full bg-white border border-slate-100 p-4 rounded-2xl text-sm font-mono tracking-widest outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          required
        />

        <select
          value={formData.jabatan}
          onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
          className="w-full bg-white border border-slate-100 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 italic font-bold text-slate-600"
          required
        >
          <option value="">{translations[lang].colJabatan}</option>
          {daftarJabatan.map((j) => (
            <option key={j.id} value={j.id}>
              {j.label}
            </option>
          ))}
        </select>

        <select
          value={formData.shift}
          onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
          className="w-full bg-white border border-slate-100 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="Siang">{translations[lang].shiftSiang}</option>
          <option value="Malam">{translations[lang].shiftMalam}</option>
        </select>
        <button
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg shadow-indigo-100 mt-4 transition-all active:scale-95"
        >
          {isSubmitting ? translations[lang].btnProcess : translations[lang].btnSave}
        </button>
      </form>
    </div>
  );
};
