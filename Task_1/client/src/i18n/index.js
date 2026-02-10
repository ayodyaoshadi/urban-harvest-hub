import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import si from './si.json';

const resources = {
  en: { translation: en },
  si: { translation: si },
};

const savedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang || (navigator.language && navigator.language.startsWith('si') ? 'si' : 'en'),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lng;
  }
  if (typeof localStorage !== 'undefined') localStorage.setItem('lang', lng);
});

if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.lang = i18n.language;
}

export default i18n;
