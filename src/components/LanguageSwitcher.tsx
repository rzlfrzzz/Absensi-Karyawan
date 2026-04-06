import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

export const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex bg-slate-200 p-1 rounded-lg scale-90">
      <button
        onClick={() => setLang('ID')}
        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          lang === 'ID' ? 'bg-white shadow-sm' : 'text-slate-500'
        }`}
      >
        ID
      </button>
      <button
        onClick={() => setLang('CN')}
        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          lang === 'CN' ? 'bg-white shadow-sm' : 'text-slate-500'
        }`}
      >
        CN
      </button>
    </div>
  );
};
