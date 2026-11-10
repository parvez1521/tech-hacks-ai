import React, { useEffect, useRef, useState } from 'react';
import { TechHacksLogo } from './TechHacksLogo';

/**
 * IntroSplash — the homepage brand intro, "The Switch" (owner-chosen
 * concept, Nov 2026): a paid subscription card slides in, the switch
 * flips orange, the card turns over into its free alternative, a route
 * line draws underneath, and the SwitchRoute wordmark lands.
 *
 * Discipline (mirrors the sister product's intro rules):
 * - Plays ONCE per session: the sessionStorage flag is set before the
 *   first frame, so a refresh mid-intro never replays it.
 * - Click / tap anywhere skips it immediately.
 * - prefers-reduced-motion and coarse-pointer (touch) visitors never
 *   see it at all — the component renders nothing for them.
 * - Fail-safe: the whole sequence is CSS-timed to ~2.15s and a JS
 *   timer unmounts the overlay on schedule even if something stalls;
 *   the page underneath renders and paints normally (the splash is a
 *   fixed overlay, never a render gate), so it cannot trap the page
 *   or block the hero.
 */
const INTRO_SEEN_KEY = 'switchroute-intro-seen';
const INTRO_DISMISS_MS = 2150;

export const IntroSplash: React.FC = () => {
  const [phase, setPhase] = useState<'hidden' | 'playing' | 'leaving'>('hidden');
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
    } catch {
      seen = false;
    }
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    if (seen || reduced || coarse) return;
    try {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, '1');
    } catch {
      /* storage unavailable — the intro simply plays this once */
    }
    setPhase('playing');
    timers.current.push(window.setTimeout(() => setPhase('leaving'), INTRO_DISMISS_MS));
    timers.current.push(window.setTimeout(() => setPhase('hidden'), INTRO_DISMISS_MS + 220));
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, []);

  if (phase === 'hidden') return null;

  const dismiss = () => {
    if (phase !== 'playing') return;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [window.setTimeout(() => setPhase('hidden'), 200)];
    setPhase('leaving');
  };

  return (
    <div
      className={`intro-splash${phase === 'leaving' ? ' intro-splash--leaving' : ''}`}
      data-testid="intro-splash"
    >
      <div className="intro-splash__stage" aria-hidden="true">
        <div className="intro-card-scene">
          <div className="intro-card">
            <div className="intro-card__face intro-card__face--front">
              <div className="flex items-center gap-3">
                <span className="intro-card__tile intro-card__tile--paid">AI</span>
                <span className="min-w-0">
                  <span className="block truncate text-base font-semibold tracking-tight text-foreground">AI Tool Pro</span>
                  <span className="block text-xs text-muted-foreground">Paid plan</span>
                </span>
                <span className="ml-auto shrink-0 text-lg font-bold tabular-nums text-foreground">
                  $20<span className="text-sm font-medium text-muted-foreground">/mo</span>
                </span>
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">Subscription renews every month, whether you use it or not.</p>
            </div>
            <div className="intro-card__face intro-card__face--back">
              <div className="flex items-center gap-3">
                <span className="intro-card__tile intro-card__tile--free">S</span>
                <span className="min-w-0">
                  <span className="block truncate text-base font-semibold tracking-tight text-foreground">Free alternative</span>
                  <span className="block text-xs text-muted-foreground">Open source · self-hosted</span>
                </span>
                <span className="ml-auto flex shrink-0 items-center gap-2">
                  <span className="text-lg font-bold tabular-nums text-foreground">$0</span>
                  <span className="intro-free-badge">FREE</span>
                </span>
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">Same job, no subscription. That is the route SwitchRoute maps.</p>
            </div>
          </div>
        </div>

        <div className="intro-lever">
          <span className="intro-lever__label">Paid</span>
          <span className="intro-lever__track">
            <span className="intro-lever__fill" />
            <span className="intro-lever__knob" />
          </span>
          <span className="intro-lever__label">Free</span>
        </div>

        <svg className="intro-route" viewBox="0 0 340 24" fill="none" aria-hidden="true">
          <path d="M10 12 H330" stroke="rgb(var(--color-border))" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 7" />
          <path className="intro-route__draw" d="M10 12 H330" stroke="#F93A12" strokeWidth="2.5" strokeLinecap="round" pathLength={100} />
          <circle cx="10" cy="12" r="4.5" fill="rgb(var(--color-muted))" />
          <circle className="intro-route__dot" cx="330" cy="12" r="5.5" fill="#FF6A00" />
        </svg>

        <div className="intro-splash__wordmark">
          <TechHacksLogo size="lg" />
        </div>
      </div>
      <button type="button" className="intro-splash__skip" onClick={dismiss} aria-label="Skip intro" />
    </div>
  );
};
