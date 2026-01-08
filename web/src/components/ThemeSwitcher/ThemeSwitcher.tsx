import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import "./ThemeSwitcher.css";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      className="theme-switcher"
      onClick={toggleTheme}
      aria-label={t("theme.toggleTheme")}
      title={theme === "dark" ? t("theme.lightMode") : t("theme.darkMode")}
    >
      <span className={`theme-icon ${theme}`}>
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
    </button>
  );
};

export default ThemeSwitcher;
