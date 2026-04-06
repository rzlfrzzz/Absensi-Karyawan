import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useEffect } from 'react';
export const LanguageContext = createContext(undefined);
export const LanguageProvider = ({ children, }) => {
    const [lang, setLangState] = useState(() => {
        // Get language from localStorage atau default to ID
        const saved = localStorage.getItem('app_language');
        return saved || 'ID';
    });
    // Save to localStorage whenever language changes
    useEffect(() => {
        localStorage.setItem('app_language', lang);
    }, [lang]);
    const setLang = (newLang) => {
        setLangState(newLang);
    };
    const toggleLanguage = () => {
        setLangState((current) => (current === 'ID' ? 'CN' : 'ID'));
    };
    const value = {
        lang,
        setLang,
        toggleLanguage,
    };
    return (_jsx(LanguageContext.Provider, { value: value, children: children }));
};
