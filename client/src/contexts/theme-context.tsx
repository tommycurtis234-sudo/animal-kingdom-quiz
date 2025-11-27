import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type ThemeColor = "green" | "purple" | "red" | "blue" | "orange";

interface ThemeContextType {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "animal-quiz-theme-color";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && ["green", "purple", "red", "blue", "orange"].includes(saved)) {
        return saved as ThemeColor;
      }
    }
    return "green";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-green", "theme-purple", "theme-red", "theme-blue", "theme-orange");
    root.classList.add(`theme-${themeColor}`);
    localStorage.setItem(THEME_STORAGE_KEY, themeColor);
  }, [themeColor]);

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
  };

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
