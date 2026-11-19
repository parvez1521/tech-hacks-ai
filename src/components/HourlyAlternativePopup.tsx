import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, X } from 'lucide-react';
import { Link } from '../router/Router';
import { BrandLogo } from './BrandLogo.tsx';
import {
  getDismissedEpochHour,
  getEpochHour,
  getHourlyAlternativePairForNow,
  saveDismissedEpochHour,
  shouldShowHourlyAlternative,
  type HourlyAlternativePair,
} from '../lib/utilities/hourlyAlternative.ts';

/** Delay after mount before the popup appears (never blocks first paint). */
const SHOW_DELAY_MS = 1000;
/** Re-check interval while closed, so an hour rollover shows the new pair. */
const VISIBILITY_CHECK_MS = 60_000;
/** Staged reveal timings after the dialog appears (total ~1.6s). */
const STAGE_STRIKE_MS = 500;
const STAGE_FREE_MS = 600;
const STAGE_LABEL_MS = 500;

/** 0 = paid only, 1 = + strikethrough, 2 = + free row, 3 = + label (final). */
type RevealStage = 0 | 1 | 2 | 3;

/**
 * Hourly "Free Alternative" popup.
 *
 * Site-wide bottom-right dialog (mounted next to <FloatingChatbot /> in
 * AppRoutes). Shows one deterministic paid -> free pair per hour — the same
 * pair for every visitor in the same hour — then stays dismissed until the
 * next hour once closed. Positioned above the chat launcher (z-49) but below
 * the open chat overlay (z-60); on mobile it clears the launcher via bottom-20.
 */
export const HourlyAlternativePopup: React.FC = () => {
  // Keep hidden during SSR/hydration (cookie-banner pattern): nothing renders
  // until after mount, so returning visitors never see a one-frame flash.
  const [mounted, setMounted] = useState(false);
  const [pair, setPair] = useState<HourlyAlternativePair | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stage, setStage] = useState<RevealStage>(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const focusReturnRef = useRef<HTMLElement | null>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let checkTimer: ReturnType<typeof setInterval> | undefined;

    const maybeShow = () => {
      const epochHour = getEpochHour();
      if (!shouldShowHourlyAlternative(epochHour, getDismissedEpochHour(window.localStorage))) {
        return;
      }
      const currentPair = getHourlyAlternativePairForNow();
      if (!currentPair) return;
      focusReturnRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setPair(currentPair);
      setStage(0);
      setIsVisible(true);
    };

    // Appear ~1s after page open; never blocks first paint.
    showTimer = setTimeout(maybeShow, SHOW_DELAY_MS);
    // If the page stays open across an hour boundary, show the new hour's pair.
    checkTimer = setInterval(() => {
      if (!isVisibleRef.current) maybeShow();
    }, VISIBILITY_CHECK_MS);

    return () => {
      if (showTimer) clearTimeout(showTimer);
      if (checkTimer) clearInterval(checkTimer);
    };
  }, [mounted]);

  // Staged reveal: paid -> strikethrough -> free -> label. Reduced motion
  // jumps straight to the final state (no animation).
  useEffect(() => {
    if (!isVisible) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStage(3);
      return;
    }
    const timers = [
      setTimeout(() => setStage(1), STAGE_STRIKE_MS),
      setTimeout(() => setStage(2), STAGE_STRIKE_MS + STAGE_FREE_MS),
      setTimeout(() => setStage(3), STAGE_STRIKE_MS + STAGE_FREE_MS + STAGE_LABEL_MS),
    ];
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [isVisible]);

  // Focus the close button on open; return focus on close.
  useEffect(() => {
    if (isVisible) {
      window.requestAnimationFrame(() => closeRef.current?.focus());
      return;
    }
    const returnTarget = focusReturnRef.current;
    if (returnTarget?.isConnected) returnTarget.focus();
    focusReturnRef.current = null;
  }, [isVisible]);

  const handleClose = () => {
    saveDismissedEpochHour(window.localStorage, getEpochHour());
    setIsVisible(false);
    setPair(null);
  };

  // Escape closes; Tab cycles inside the dialog while it is open.
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  if (!mounted || !isVisible || !pair) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-label={`Free alternative to ${pair.targetName}: ${pair.altName}`}
      data-testid="hourly-alt-popup"
      className="fixed bottom-20 left-3 right-3 z-50 box-border sm:bottom-20 sm:left-auto sm:right-6 sm:w-[26rem] sm:max-w-[calc(100vw-3rem)] p-4 glass-strong rounded-2xl animate-fade-in"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground pt-2.5">
          Switch it for free
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={handleClose}
          data-testid="hourly-alt-close"
          aria-label="Dismiss free alternative suggestion"
          className="min-h-11 min-w-11 inline-flex shrink-0 items-center justify-center text-muted-foreground hover:text-foreground rounded-full hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Paid tool — shown first, then struck through. */}
      <Link
        to={pair.targetUrl}
        data-testid="hourly-alt-paid"
        aria-label={`${pair.targetName} (paid) — view its alternatives`}
        className="relative mt-2 flex items-center gap-3 rounded-xl px-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <BrandLogo slug={pair.targetSlug} name={pair.targetName} size="md" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-foreground">{pair.targetName}</span>
          <span className="block text-xs text-muted-foreground">Paid software</span>
        </span>
        <span className="shrink-0 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
          Paid
        </span>
        {stage >= 1 && (
          <span
            aria-hidden="true"
            className="animate-alt-popup-strike pointer-events-none absolute left-2 right-2 top-1/2 h-[2px] origin-left rounded-full bg-primary"
          />
        )}
      </Link>

      {/* Free alternative — appears once the paid row is struck through. */}
      {stage >= 2 && (
        <div className="animate-fade-in-up">
          <div className="flex justify-center py-1" aria-hidden="true">
            <ArrowDown className="h-4 w-4 text-primary" />
          </div>
          <Link
            to={pair.altUrl}
            data-testid="hourly-alt-free"
            aria-label={`${pair.altName} (free) — view its details`}
            className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/30 px-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <BrandLogo slug={pair.altSlug} name={pair.altName} size="md" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-foreground">{pair.altName}</span>
              <span className="block text-xs text-muted-foreground">
                {pair.altType === 'open-source' ? 'Open-source replacement' : 'Free plan available'}
              </span>
            </span>
            <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
              FREE
            </span>
          </Link>
        </div>
      )}

      {stage >= 3 && (
        <p
          data-testid="hourly-alt-label"
          className="animate-fade-in mt-3 text-center text-xs font-medium text-muted-foreground"
        >
          Free Alternative of the Day
        </p>
      )}
    </div>
  );
};
