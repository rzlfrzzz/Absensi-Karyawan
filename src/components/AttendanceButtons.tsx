import React from 'react';
import { LanguageCode } from '../types';
import { translations } from '../constants/translations';

interface AttendanceButtonsProps {
  onCheckIn: () => void;
  onCheckOut: () => void;
  loading: boolean;
  lang: LanguageCode;
}

export const AttendanceButtons: React.FC<AttendanceButtonsProps> = ({
  onCheckIn,
  onCheckOut,
  loading,
  lang,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={onCheckIn}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-5 rounded-[1.5rem] font-black text-xs tracking-widest transition-all shadow-xl shadow-indigo-100 uppercase"
      >
        {loading ? '...' : translations[lang].attendanceIn}
      </button>
      <button
        onClick={onCheckOut}
        disabled={loading}
        className="bg-slate-900 hover:bg-black disabled:bg-slate-700 text-white py-5 rounded-[1.5rem] font-black text-xs tracking-widest transition-all uppercase"
      >
        {loading ? '...' : translations[lang].attendanceOut}
      </button>
    </div>
  );
};
