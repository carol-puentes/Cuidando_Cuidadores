import i18n from 'i18next';
import i18next from 'i18next';

import { initReactI18next } from 'react-i18next';

// Importar archivos de traducción
import en from './locales/en.json';
import es from './locales/es.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: 'es', // Idioma por defecto
  fallbackLng: 'en', // Idioma de respaldo
  interpolation: { escapeValue: false },
});

export default i18n;
