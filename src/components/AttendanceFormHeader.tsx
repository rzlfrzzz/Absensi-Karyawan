import React from 'react';
import { Link } from 'react-router-dom';
import { LanguageCode, Settings } from '../types';
import { translations } from '../constants/translations';

interface AttendanceFormHeaderProps {
  lang: LanguageCode;
  settings: Settings | null;
}

export const AttendanceFormHeader: React.FC<AttendanceFormHeaderProps> = ({
  lang,
  settings,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50 p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white rounded-[3.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center relative overflow-hidden">
        <h1 className="text-3xl font-black mb-1 text-slate-900 italic uppercase">
          Digital<span className="text-indigo-600">Absensi</span>
        </h1>
        <p className="text-[9px] text-slate-400 font-bold tracking-[0.3em] mb-6 uppercase tracking-widest">
          {translations[lang].tagline}
        </p>
      </div>
    </div>
  );
};
