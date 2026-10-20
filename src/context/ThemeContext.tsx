import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {}

    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const applyTheme = (targetTheme: Theme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme', targetTheme);

    if (targetTheme === 'dark') {
      root.style.colorScheme = 'dark';
      root.classList.remove('light');
      root.classList.add('dark');
      if (document.body) {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
      }
      try {
        localStorage.setItem('theme', 'dark');
      } catch {}
    } else {
      root.style.colorScheme = 'light';
      root.classList.remove('dark');
      root.classList.add('light');
      if (document.body) {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
      }
      try {
        localStorage.setItem('theme', 'light');
      } catch {}
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', targetTheme === 'dark' ? '#0B1220' : '#F5F8FF');
    }
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen to OS theme changes if user hasn't explicitly set a preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        const stored = localStorage.getItem('theme');
        if (!stored) {
          const newTheme: Theme = e.matches ? 'dark' : 'light';
          setThemeState(newTheme);
        }
      } catch {}
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);
    applyTheme(nextTheme);
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
    // Safe fallback if used outside provider (compatibility default: theme: 'dark')
    return {
      theme: 'dark',
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
};
