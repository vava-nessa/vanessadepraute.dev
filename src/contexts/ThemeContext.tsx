import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Always start in dark mode
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark-mode");
      root.classList.remove("light-mode");
    } else {
      root.classList.add("light-mode");
      root.classList.remove("dark-mode");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Expose brand colors globally
  useEffect(() => {
    const getPrimary = () => getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
    const getSecondary = () => getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim();

    window.brandColors = {
      primary: getPrimary(),
      secondary: getSecondary(),
      getPrimary,
      getSecondary
    };

    // Optional: Log to console to confirm availability
    // console.log("Brand colors accessible via window.brandColors:", window.brandColors);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
