import React, { createContext, useContext, useEffect, useState } from "react";
import { captureError } from "@/utils/errorHandling";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      // Always start with dark mode, but respect if user explicitly switched to light
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      // Only use saved theme if user explicitly set it to light, otherwise force dark
      if (savedTheme === "light") {
        setTheme("light");
      } else {
        // Force dark mode by default, ignoring system preference
        setTheme("dark");
      }
      setMounted(true);
    } catch (error) {
      captureError(error, {
        component: "ThemeProvider",
        action: "initialize_theme",
      });
      // Fallback to dark mode if there's an error
      setTheme("dark");
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      // Apply theme to document
      const root = document.documentElement;
      if (theme === "light") {
        root.classList.add("light-mode");
        root.classList.remove("dark-mode");
      } else {
        root.classList.add("dark-mode");
        root.classList.remove("light-mode");
      }

      // Save to localStorage
      localStorage.setItem("theme", theme);
    } catch (error) {
      captureError(error, {
        component: "ThemeProvider",
        action: "apply_theme",
        additionalData: { theme },
      });
    }
  }, [theme, mounted]);

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
