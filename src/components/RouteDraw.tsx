import React, { useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * RouteDraw — mid-page statement of the site's core idea (owner-chosen
 * concept 2, Nov 2026): a route draws itself from a "Paid tool" pin to
 * a "Free alternative" pin, a dot travels the line, and the end pin
 * fills with the vermilion route gradient on arrival.
 *
 * Scroll-triggered via the shared useScrollReveal hook: plays once
 * when the band enters the viewport, then stays settled. Reduced
 * motion visitors get the finished state (drawn route, dot parked at
 * the free pin) with no travel at all.
 */
const ROUTE_PATH = 'M 70 132 C 400 132, 800 48, 1130 48';

export const RouteDraw: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.35 });
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    setMotionOk(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-labelledby="route-draw-heading">
      <div
        ref={ref}
        className={`route-draw${isVisible ? ' is-played' : ''}`}
        role="img"
        aria-label="Animation: a route line draws itself from a pin labelled Paid tool to a pin labelled Free alternative, and a dot travels along it."
      >
        <p className="eyebrow text-center">The idea</p>
        <h2 id="route-draw-heading" className="mx-auto mt-3 max-w-xl text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Pick the paid tool. We map the route to its free alternative.
        </h2>

        <div className="route-draw__stage" aria-hidden="true">
          <svg className="route-draw__svg" viewBox="0 0 1200 170" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="route-draw-gradient" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF6A00" />
                <stop offset="52%" stopColor="#F93A12" />
                <stop offset="100%" stopColor="#FFB800" />
              </linearGradient>
            </defs>
            <path d={ROUTE_PATH} stroke="rgb(var(--color-border))" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 8" />
            <path className="route-draw__line" d={ROUTE_PATH} stroke="url(#route-draw-gradient)" strokeWidth="2.5" strokeLinecap="round" pathLength={100} />
            <circle cx="70" cy="132" r="9" fill="rgb(var(--color-card))" stroke="rgb(var(--color-border))" strokeWidth="2" />
            <circle cx="70" cy="132" r="3.5" fill="rgb(var(--color-muted))" />
            <circle className="route-draw__pin-end-base" cx="1130" cy="48" r="10" fill="rgb(var(--color-card))" stroke="rgb(var(--color-border))" strokeWidth="2" />
            <circle className="route-draw__pin-end" cx="1130" cy="48" r="10" fill="url(#route-draw-gradient)" />
            {isVisible && motionOk ? (
              <circle r="6" fill="#F93A12" stroke="rgb(var(--color-card))" strokeWidth="2">
                <animateMotion dur="1.5s" begin="0.15s" fill="freeze" path={ROUTE_PATH} />
              </circle>
            ) : (
              <circle cx="1130" cy="48" r="6" fill="#F93A12" stroke="rgb(var(--color-card))" strokeWidth="2" />
            )}
          </svg>
          <div className="route-draw__labels">
            <span className="route-draw__label">
              <span className="route-draw__label-title">Paid tool</span>
              <span className="route-draw__label-sub">Monthly subscription</span>
            </span>
            <span className="route-draw__label route-draw__label--end">
              <span className="route-draw__label-title">
                Free alternative <span className="intro-free-badge">FREE</span>
              </span>
              <span className="route-draw__label-sub">No subscription</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
