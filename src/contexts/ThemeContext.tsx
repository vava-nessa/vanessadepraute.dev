/**
 * @file ThemeContext.tsx
 * @description 🎨 Global theme management with dark/light mode support
 * 
 * This context provides theme state and toggle functionality across the app.
 * It also exposes brand colors globally via `window.brandColors` for JS access.
 * 
 * 🔧 How it works:
 *   1. Theme state starts in "dark" mode by default
 *   2. On change, adds/removes CSS classes on <html> element
 *   3. Persists choice to localStorage for future visits
 *   4. Brand colors (primary/secondary) are exposed via window.brandColors
 * 
 * 💡 CSS Classes applied to document.documentElement:
 *   → "dark-mode" - when theme is dark
 *   → "light-mode" - when theme is light
 * 
 * 🌈 Brand Colors (accessible via window.brandColors):
 *   → primary: from CSS variable --color-primary
 *   → secondary: from CSS variable --color-secondary
 *   → getPrimary(): function to get current primary color
 *   → getSecondary(): function to get current secondary color
 * 
 * @functions
 *   → ThemeProvider → Context provider wrapping the app
 *   → useTheme → Hook to access theme state and toggleTheme function
 * 
 * @exports ThemeProvider, useTheme
 * 
 * @see ./src/index.css - CSS variables definition
 */

import React, { createContext, useContext, useEffect, useState } from "react";

// 📖 Theme type - only two modes supported
type Theme = "light" | "dark";

// 📖 Context value shape
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 📖 Theme Provider Component
 * Wraps the app and provides theme state to all children.
 * 
 * @param children - React children to wrap
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 📖 Always start in dark mode - this is the default brand aesthetic
  const [theme, setTheme] = useState<Theme>("dark");

  // 📖 Effect: Apply theme classes to document root and persist to localStorage
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

  // 📖 Effect: Expose brand colors globally for JS access
  // Useful for components that need programmatic access to brand colors
  useEffect(() => {
    const getPrimary = () => getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
    const getSecondary = () => getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim();

    window.brandColors = {
      primary: getPrimary(),
      secondary: getSecondary(),
      getPrimary,
      getSecondary
    };
  }, []);

  // 📖 Toggle between dark and light mode
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * 📖 useTheme Hook
 * Access theme state and toggle function from any component.
 * Must be used within a ThemeProvider.
 * 
 * @returns {ThemeContextType} - { theme, toggleTheme }
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
