import React, { useState, useEffect, useRef } from 'react';
import { Link } from '../router/Router';
import { Cookie, X, Check, ShieldCheck, Settings2, Info } from 'lucide-react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
  updatedAt: string;
}

const STORAGE_KEY = 'cookie_consent_preferences';

export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookiePreferences;
  } catch {
    return null;
  }
}

export function saveCookiePreferences(prefs: CookiePreferences) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent('cookie_consent_updated', { detail: prefs }));
  } catch {
    // Ignore storage errors
  }
}

export function openCookiePreferencesModal() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('open_cookie_preferences_modal'));
}

export const CookieConsentBanner: React.FC = () => {
  // Keep the first server/client render identical; persisted choices are applied in useEffect.
  const [isOpen, setIsOpen] = useState(() => getCookiePreferences() === null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const focusReturnRef = useRef<HTMLElement | null>(null);
  const restoreFocusAfterCloseRef = useRef(false);

  const openModal = (trigger: HTMLElement | null = null) => {
    focusReturnRef.current = trigger || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setIsModalOpen(true);
    window.requestAnimationFrame(() => modalCloseRef.current?.focus());
  };

  const closeModal = () => {
    restoreFocusAfterCloseRef.current = true;
    setIsModalOpen(false);
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== 'Tab' || !modalRef.current) return;

    const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )).filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  useEffect(() => {
    // Read saved choices after mount to keep server/client rendering consistent.
    const existing = getCookiePreferences();
    if (existing) {
      setIsOpen(false);
      setAnalytics(existing.analytics);
      setAdvertising(existing.advertising);
    } else {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen || !restoreFocusAfterCloseRef.current) return;
    restoreFocusAfterCloseRef.current = false;
    const returnTarget = focusReturnRef.current?.isConnected
      ? focusReturnRef.current
      : document.querySelector<HTMLElement>('[data-cookie-consent-customize]');
    returnTarget?.focus();
  }, [isModalOpen, isOpen]);

  useEffect(() => {
    const handleOpenModal = () => {
      const existing = getCookiePreferences();
      if (existing) {
        setAnalytics(existing.analytics);
        setAdvertising(existing.advertising);
      }
      openModal();
    };

    window.addEventListener('open_cookie_preferences_modal', handleOpenModal);
    return () => window.removeEventListener('open_cookie_preferences_modal', handleOpenModal);
  }, []);

  const handleAcceptAll = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: true,
      advertising: true,
      updatedAt: new Date().toISOString(),
    };
    saveCookiePreferences(prefs);
    setAnalytics(true);
    setAdvertising(true);
    setIsOpen(false);
    closeModal();
  };

  const handleRejectNonEssential = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: false,
      advertising: false,
      updatedAt: new Date().toISOString(),
    };
    saveCookiePreferences(prefs);
    setAnalytics(false);
    setAdvertising(false);
    setIsOpen(false);
    closeModal();
  };

  const handleSaveCustom = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics,
      advertising,
      updatedAt: new Date().toISOString(),
    };
    saveCookiePreferences(prefs);
    setIsOpen(false);
    closeModal();
  };

  return (
    <>
      {/* Floating Bottom Banner (Initial prompt for new visitors) */}
      {isOpen && !isModalOpen && (
        <div
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-20 left-3 right-3 box-border max-h-[min(35vh,18rem)] overflow-y-auto overscroll-contain sm:bottom-6 sm:left-6 sm:right-auto sm:w-[26rem] sm:max-w-[calc(100vw-3rem)] sm:max-h-[min(70vh,32rem)] z-40 p-3 sm:p-4 rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl shadow-black/40 animate-slide-up text-xs space-y-2 sm:space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm">
              <Cookie className="w-4 h-4" />
              <span>Cookie &amp; Privacy Notice</span>
            </div>
            <button
              type="button"
              onClick={handleRejectNonEssential}
              className="min-h-11 min-w-11 inline-flex shrink-0 items-center justify-center text-muted-foreground hover:text-foreground rounded hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              aria-label="Close and reject non-essential cookies"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-secondary-foreground text-[11px] leading-[1.4]">
            This site uses local storage for theme, bookmarks, and your saved preferences. Analytics loads only if you allow it. Advertising is not currently active. See our{' '}
            <Link to="/privacy" className="text-primary hover:underline font-medium">
              Privacy Policy
            </Link>.
          </p>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="min-h-11 px-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary-hover shadow-sm transition-colors text-[11px] sm:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={handleRejectNonEssential}
              className="min-h-11 px-3 rounded-lg bg-muted border border-border text-foreground font-medium hover:bg-muted/80 transition-colors text-[11px] sm:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={(event) => openModal(event.currentTarget)}
              data-cookie-consent-customize
              className="min-h-11 px-2.5 text-muted-foreground hover:text-foreground underline text-[11px] ml-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-md"
            >
              Customize
            </button>
          </div>
        </div>
      )}

      {/* Detailed Cookie Preferences Modal (Accessible anytime from footer) */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-title"
          onKeyDown={handleDialogKeyDown}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div ref={modalRef} className="max-w-lg w-full rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" />
                <h2 id="cookie-preferences-title" className="text-base font-bold text-foreground">
                  Cookie &amp; Consent Preferences
                </h2>
              </div>
              <button
                ref={modalCloseRef}
                type="button"
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-secondary-foreground leading-relaxed">
              These controls save your preferences in this browser. This panel is not a Google-certified consent management platform (CMP) and does not send IAB TCF consent signals. SwitchRoute is not currently loading AdSense or analytics scripts. A certified CMP must be in place before ads are enabled for regions where Google requires one.
            </p>

            <div className="space-y-3">
              {/* Essential */}
              <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-foreground text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Essential Website Cookies</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Necessary for site navigation, light/dark theme persistence, and local software bookmarks. Cannot be disabled.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20 shrink-0">
                  Always Active
                </span>
              </div>

              {/* Analytics */}
              <div className="p-3.5 rounded-xl border border-border bg-card flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="font-bold text-foreground text-xs block">
                    Analytics &amp; Site Diagnostics
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    If analytics is enabled in the future, it may collect usage and performance information to help improve catalog discovery.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    aria-label="Allow analytics and site diagnostics"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Advertising */}
              <div className="p-3.5 rounded-xl border border-border bg-card flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="font-bold text-foreground text-xs block">
                    Advertising &amp; Google AdSense Personalization
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    If ads are enabled after approval, this choice will be used as a browser-level preference. Regional consent requirements and any certified CMP must also be in place before ad requests are made.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    aria-label="Allow advertising and personalization"
                    checked={advertising}
                    onChange={(e) => setAdvertising(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/60 border border-border/80 flex items-start gap-2 text-[11px] text-muted-foreground">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                You can revisit and update these choices at any time by selecting <strong>Cookie Preferences</strong> in our site footer. For full details on third-party ad vendors and opt-out links, visit our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-3.5 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium text-xs transition-colors"
              >
                Reject All
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold text-xs hover:bg-secondary/80 border border-border transition-colors"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary-hover shadow-sm transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
