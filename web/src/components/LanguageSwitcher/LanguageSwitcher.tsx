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

  return (
    <button
      className="language-switcher"
      onClick={toggleLanguage}
      aria-label="Toggle language"
      title={(lang || i18n.language) === "en" ? "Français" : "English"}
    >
      <span className={`flag ${lang || i18n.language}`}>
        {(lang || i18n.language) === "en" ? "🇬🇧" : "🇫🇷"}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
