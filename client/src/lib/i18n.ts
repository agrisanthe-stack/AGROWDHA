import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from '../locales/en.json';
import knTranslations from '../locales/kn.json';
import hiTranslations from '../locales/hi.json';
import taTranslations from '../locales/ta.json';
import teTranslations from '../locales/te.json';

const resources = {
  en: {
    translation: enTranslations
  },
  kn: {
    translation: knTranslations
  },
  hi: {
    translation: hiTranslations
  },
  ta: {
    translation: taTranslations
  },
  te: {
    translation: teTranslations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en', // Default to English
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    }
  });

// Save language preference to localStorage when it changes
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lng);
  }
});

export default i18n;