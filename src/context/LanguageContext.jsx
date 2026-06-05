import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import en from '../i18n/en';
import fr from '../i18n/fr';

const translations = { en, fr };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'en' ? 'fr' : 'en'));
  }, []);

  const t = useMemo(() => translations[language], [language]);

  const value = useMemo(() => ({
    language,
    toggleLanguage,
    t,
  }), [language, toggleLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
