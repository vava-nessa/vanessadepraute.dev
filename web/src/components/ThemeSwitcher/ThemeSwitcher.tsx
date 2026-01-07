import { useTheme } from "../../contexts/ThemeContext";
import "./ThemeSwitcher.css";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-switcher"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === "dark" ? "Light Mode" : "Dark Mode"}
    >
      <span className={`theme-icon ${theme}`}>
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
    </button>
  );
};

export default ThemeSwitcher;
