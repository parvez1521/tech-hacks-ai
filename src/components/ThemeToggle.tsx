import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const THEME_HINT_SESSION_KEY = 'techhacks_theme_hint_dismissed_v2';

function getThemeHint(theme: 'dark' | 'light'): string {
  return theme === 'dark'
    ? 'Curious about the light side?'
    : 'Psst… try the dark side.';
}

interface ThemeToggleProps {
  compact?: boolean;
}

/**
 * A small, explicit theme control shared by desktop and mobile navigation.
 * The hint is session-scoped: it teaches the control once without becoming a
 * permanent notification or competing with the directory search experience.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false }) => {
  const { theme, toggleTheme } = useTheme();
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(THEME_HINT_SESSION_KEY) === '1';
      setShowHint(!dismissed);
    } catch {
      setShowHint(true);
    }
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    try {
      sessionStorage.setItem(THEME_HINT_SESSION_KEY, '1');
    } catch {
      // The hint still dismisses in memory when session storage is blocked.
    }
  };

  const handleToggle = () => {
    dismissHint();
    toggleTheme();
  };

  return (
    <div className={`theme-control ${compact ? 'theme-control--compact' : ''}`}>
      {showHint && (
        <div className="theme-hint pointer-events-none" role="note" aria-live="polite">
          <span>{getThemeHint(theme)}</span>
        </div>
      )}
      <div className="theme-control__button-wrap">
        <svg className="theme-control__arrow" viewBox="0 0 28 18" fill="none" aria-hidden="true">
          <path
            d="M2 2c7-1 13 1 16 7l2 5m-5-3 5 4 3-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1 1.5"
          />
        </svg>
        <button
          type="button"
          data-testid={compact ? 'mobile-theme-toggle-btn' : 'theme-toggle-btn'}
          onClick={handleToggle}
          className="theme-toggle focus-ring"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-pressed={theme === 'dark'}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="theme-toggle__icon" aria-hidden="true">
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </span>
          <span className="theme-toggle__label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </div>
  );
};
