import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`theme-control ${compact ? 'theme-control--compact' : ''}`}>
      <button
        type="button"
        data-testid={compact ? 'mobile-theme-toggle-btn' : 'theme-toggle-btn'}
        onClick={toggleTheme}
        className="theme-toggle focus-ring"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        aria-pressed={theme === 'dark'}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <span className="theme-toggle__icon" aria-hidden="true">
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </span>
        <span className="theme-toggle__label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    </div>
  );
};
