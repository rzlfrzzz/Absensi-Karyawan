import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { LanguageCode } from '../types';
import { translations } from '../constants/translations';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      'useLanguage harus digunakan di dalam LanguageProvider'
    );
  }

  const { lang, setLang, toggleLanguage } = context;
  const trans = translations[lang];

  return {
    lang,
    setLang,
    toggleLanguage,
    trans,
    t: (key: keyof typeof trans) => trans[key] || key,
  };
};
