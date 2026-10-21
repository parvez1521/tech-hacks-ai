import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const THEME_HINT_SESSION_KEY = 'techhacks_theme_hint_dismissed_v2';
const THEME_HINT_QUOTE_SESSION_KEY = 'techhacks_theme_hint_quote';
const THEME_HINT_QUOTES = [
  'Need a darker vibe?',
  'Team midnight? 🌙',
  'Light or dark — your call.',
  'Psst… try the dark side.',
  'Your theme, your rules.',
];

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
  const [hintQuote, setHintQuote] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return sessionStorage.getItem(THEME_HINT_QUOTE_SESSION_KEY) || THEME_HINT_QUOTES[Math.floor(Math.random() * THEME_HINT_QUOTES.length)];
      }
    } catch {
      // Fall through to a deterministic first-render quote for SSR.
    }
    return THEME_HINT_QUOTES[0];
  });

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(THEME_HINT_SESSION_KEY) === '1';
      setShowHint(!dismissed);
      const savedQuote = sessionStorage.getItem(THEME_HINT_QUOTE_SESSION_KEY);
      const quote = savedQuote || THEME_HINT_QUOTES[Math.floor(Math.random() * THEME_HINT_QUOTES.length)];
      setHintQuote(quote);
      if (!savedQuote) sessionStorage.setItem(THEME_HINT_QUOTE_SESSION_KEY, quote);
    } catch {
      setShowHint(true);
      setHintQuote(THEME_HINT_QUOTES[Math.floor(Math.random() * THEME_HINT_QUOTES.length)]);
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
          <span>{hintQuote}</span>
          <svg width="38" height="22" viewBox="0 0 38 22" fill="none" aria-hidden="true">
            <path
              d="M2 5c9-3 17-1 23 5 3 3 5 5 9 6M26 14l8 2-4-7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 1.5"
            />
          </svg>
        </div>
      )}
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
          {theme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </span>
        <span className="theme-toggle__label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
      </button>
    </div>
  );
};
