import React, { createContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<LanguageCode>(() => {
    // Get language from localStorage atau default to ID
    const saved = localStorage.getItem('app_language');
    return (saved as LanguageCode) || 'ID';
  });

  // Save to localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem('app_language', lang);
  }, [lang]);

  const setLang = (newLang: LanguageCode) => {
    setLangState(newLang);
  };

  const toggleLanguage = () => {
    setLangState((current) => (current === 'ID' ? 'CN' : 'ID'));
  };

  const value: LanguageContextType = {
    lang,
    setLang,
    toggleLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
