import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import en from '../i18n/en';
import fr from '../i18n/fr';
import ar from '../i18n/ar';

const translations = { en, fr, ar };

const LANGUAGES = ['en', 'fr', 'ar'];

export const LANGUAGE_FLAGS = {
  en: '🇬🇧',
  fr: '🇫🇷',
  ar: '🇸🇦',
};

export const LANGUAGE_NAMES = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const cycleLanguage = useCallback(() => {
    setLanguage(prev => {
      const idx = LANGUAGES.indexOf(prev);
      return LANGUAGES[(idx + 1) % LANGUAGES.length];
    });
  }, []);

  const t = useMemo(() => translations[language], [language]);

  const nextLanguage = useMemo(() => {
    const idx = LANGUAGES.indexOf(language);
    return LANGUAGES[(idx + 1) % LANGUAGES.length];
  }, [language]);

  const value = useMemo(() => ({
    language,
    cycleLanguage,
    t,
    nextLanguage,
  }), [language, cycleLanguage, t, nextLanguage]);

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
