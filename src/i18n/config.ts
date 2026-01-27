/**
 * @file config.ts
 * @description 🌐 Internationalization (i18n) configuration using i18next
 * 
 * This file sets up the translation system for the multilingual site.
 * It supports English (default) and French translations.
 * 
 * 🔧 Configuration:
 *   → fallbackLng: "en" - Falls back to English if translation missing
 *   → lng: "en" - Default language is English
 *   → escapeValue: false - React already escapes output, no need for double-escaping
 * 
 * 🌍 Language Detection:
 * Language is NOT auto-detected here. Instead, pages detect language from URL:
 *   - /fr/* → French
 *   - /* → English (default)
 * 
 * This is done in page components using i18n.changeLanguage().
 * 
 * @exports default - Configured i18n instance
 * 
 * @see ./locales/en.json - English translations
 * @see ./locales/fr.json - French translations
 * @see ../pages/HomePage.tsx - Example of language detection from URL
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";

// 📖 Translation resources - each language has its own JSON file
const resources = {
  en: {
    translation: enTranslations,
  },
  fr: {
    translation: frTranslations,
  },
};

// 📖 Initialize i18next with React integration
i18n
  .use(initReactI18next) // 📖 Binds i18next to React
  .init({
    resources,
    fallbackLng: "en",  // 📖 Use English if translation is missing
    lng: "en",          // 📖 Start with English (URL-based detection happens in pages)
    interpolation: {
      escapeValue: false, // 📖 React already escapes, no need for double-escaping
    },
  });

export default i18n;
