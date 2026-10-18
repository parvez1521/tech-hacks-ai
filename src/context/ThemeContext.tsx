import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Phase 24: Strictly enforce Dark Theme across the application
  const [theme] = useState<Theme>(() => {
    try {
      localStorage.getItem('theme');
    } catch {}
    return 'dark';
  });

  const applyDarkTheme = () => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const targetTheme: Theme = 'dark';
    root.setAttribute('data-theme', targetTheme);
    root.style.colorScheme = 'dark';
    root.classList.remove('light');
    root.classList.add('dark');

    if (document.body) {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#0c0e12');
    }

    // Clean up or override any saved light-theme preference in localStorage
    try {
      localStorage.setItem('theme', 'dark');
    } catch {}
  };

  useEffect(() => {
    applyDarkTheme();
  }, []);

  const setTheme = (_newTheme: Theme) => {
    // Kept for interface compatibility; strictly remains dark
    applyDarkTheme();
  };

  const toggleTheme = () => {
    // Kept for interface compatibility; strictly remains dark
    applyDarkTheme();
  };

  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme, setTheme }}>
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
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
};
