import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import translations from '../i18n/translations';

const LanguageContext = createContext(null);

const LANGUAGE_KEY = 'language';

/*
|--------------------------------------------------------------------------
| SUPPORTED LANGUAGES
|--------------------------------------------------------------------------
*/

export const SUPPORTED_LANGUAGES = ['en', 'hi'];

function getInitialLanguage() {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const saved = localStorage.getItem(LANGUAGE_KEY);

  if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
    return saved;
  }

  return 'en';
}

/*
|--------------------------------------------------------------------------
| DOT-PATH LOOKUP
|--------------------------------------------------------------------------
|
| t('nav.home') -> translations[lang].nav.home
| Falls back to English if a key is missing in the active language,
| and finally to the key itself so missing translations never crash
| the UI or render blank text.
|
|--------------------------------------------------------------------------
*/

function resolve(dictionary, path) {
  return path
    .split('.')
    .reduce(
      (accumulator, key) =>
        accumulator && accumulator[key] !== undefined
          ? accumulator[key]
          : undefined,
      dictionary
    );
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((previous) => (previous === 'en' ? 'hi' : 'en'));
  };

  const t = useMemo(() => {
    return (path) => {
      const value =
        resolve(translations[language], path) ??
        resolve(translations.en, path) ??
        path;

      return value;
    };
  }, [language]);

  const value = {
    language,
    isHindi: language === 'hi',
    setLanguage,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used inside a LanguageProvider'
    );
  }

  return context;
}