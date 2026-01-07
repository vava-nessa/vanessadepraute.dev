import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      className="language-switcher"
      onClick={toggleLanguage}
      aria-label="Toggle language"
      title={i18n.language === "en" ? "Français" : "English"}
    >
      <span className={`flag ${i18n.language}`}>
        {i18n.language === "en" ? "🇬🇧" : "🇫🇷"}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
