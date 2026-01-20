import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import "./LanguageSwitcher.css";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
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
      aria-label={t("language.toggleLanguage")}
      title={currentLang === "en" ? t("language.switchToFrench") : t("language.switchToEnglish")}
    >
      {currentLang === "en" ? "FR" : "EN"}
    </button>
  );
};

export default LanguageSwitcher;
