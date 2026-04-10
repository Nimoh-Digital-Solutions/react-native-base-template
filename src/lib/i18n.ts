import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@shared/i18n/en.json';
import fr from '@shared/i18n/fr.json';
import nl from '@shared/i18n/nl.json';

const LANGUAGE_KEY = 'language';

function getSavedLanguage(): string {
  if (Platform.OS === 'web') {
    return localStorage.getItem(LANGUAGE_KEY) || 'en';
  }
  return SecureStore.getItem(LANGUAGE_KEY) || 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    nl: { translation: nl },
  },
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export function setLanguage(lng: string) {
  i18n.changeLanguage(lng);
  if (Platform.OS === 'web') {
    localStorage.setItem(LANGUAGE_KEY, lng);
  } else {
    SecureStore.setItem(LANGUAGE_KEY, lng);
  }
}

export default i18n;
