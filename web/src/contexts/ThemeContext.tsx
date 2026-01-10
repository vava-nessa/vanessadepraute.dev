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
  // Always force dark mode
  const [theme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force dark mode class immediately
    const root = document.documentElement;
    root.classList.add("dark-mode");
    root.classList.remove("light-mode");
    localStorage.setItem("theme", "dark");
  }, []);

  // No-op toggle since we enforce dark mode
  const toggleTheme = () => { };

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
