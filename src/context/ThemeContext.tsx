import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_STORAGE_KEY = 'theme';

function getInitialTheme(): Theme {
  // Server and first client render must agree; the saved preference is applied after hydration.
  return 'dark';
}

function applyThemeToDocument(theme: Theme) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const isDark = theme === 'dark';

  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
  root.classList.toggle('dark', isDark);
  root.classList.toggle('light', !isDark);
  document.body?.classList.toggle('dark', isDark);
  document.body?.classList.toggle('light', !isDark);

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  metaThemeColor?.setAttribute('content', isDark ? '#080D18' : '#F8FAFC');
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      if ((savedTheme === 'light' || savedTheme === 'dark') && savedTheme !== theme) {
        setThemeState(savedTheme);
        return;
      }
    } catch {
      // Keep the first-render default if storage is unavailable.
    }
    applyThemeToDocument(theme);
  }, [theme]);

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    try {
      // Only an explicit choice is persisted. With no key, the synchronous
      // bootstrap in index.html intentionally falls back to dark.
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Keep the in-memory theme working when storage is unavailable.
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Safe fallback if used outside provider
    return {
      theme: 'dark',
      toggleTheme: () => undefined,
      setTheme: () => undefined,
    };
  }
  return context;
};
