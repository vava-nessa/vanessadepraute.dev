import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import "./LanguageSwitcher.css";

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect current language from URL path
  const isFrench = location.pathname.startsWith("/fr");
  const currentLang = isFrench ? "fr" : "en";

  const toggleLanguage = () => {
    // Determine the new path based on current location
    if (isFrench) {
      // Switch from French to English
      // Remove /fr prefix: /fr -> /, /fr/blog -> /blog
      const newPath = location.pathname.replace(/^\/fr/, "") || "/";
      navigate(newPath, { replace: true });
    } else {
      // Switch from English to French
      // Add /fr prefix: / -> /fr, /blog -> /fr/blog
      const newPath = location.pathname === "/" ? "/fr" : `/fr${location.pathname}`;
      navigate(newPath, { replace: true });
    }
  };

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
