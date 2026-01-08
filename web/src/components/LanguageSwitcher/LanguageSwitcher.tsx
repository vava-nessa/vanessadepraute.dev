import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import "./LanguageSwitcher.css";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();

  const toggleLanguage = () => {
    const newLang = (lang || i18n.language) === "en" ? "fr" : "en";
    navigate(`/${newLang}`, { replace: true });
  };

  const currentLang = lang || i18n.language;

  return (
    <button
      className="language-switcher"
      onClick={toggleLanguage}
      aria-label="Toggle language"
      title={currentLang === "en" ? "Switch to French" : "Passer en anglais"}
    >
      {currentLang === "en" ? "FR" : "EN"}
    </button>
  );
};

export default LanguageSwitcher;
