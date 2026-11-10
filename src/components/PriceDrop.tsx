import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '../router/Router';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * PriceDrop — the homepage's closing statement (owner-chosen concept
 * 3, Nov 2026): a big "$29/mo" tumbles down to "$0", the "/mo" is
 * struck through and replaced with "forever", and the orange
 * "No subscription" pill lands.
 *
 * Scroll-triggered once via useScrollReveal; the count itself runs on
 * requestAnimationFrame (the AnimatedCount pattern). Reduced motion
 * shows the settled "$0 forever" state immediately.
 */
const START_PRICE = 29;
const COUNT_MS = 1150;

export const PriceDrop: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.35 });
  const [display, setDisplay] = useState(START_PRICE);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isVisible || startedRef.current) return;
    startedRef.current = true;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(0);
      setDone(true);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / COUNT_MS);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(START_PRICE * (1 - eased)));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isVisible]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-labelledby="price-drop-heading">
      <div ref={ref} className={`price-drop${done ? ' is-done' : ''} rounded-2xl border border-border bg-card px-6 py-12 text-center sm:py-16`}>
        <p className="eyebrow">The maths</p>
        <h2 id="price-drop-heading" className="sr-only">From a monthly subscription to free, forever</h2>
        <p className="sr-only">From $29 a month to $0 — free forever, no subscription.</p>
        <div className="price-drop__figure" aria-hidden="true">
          <span className="price-drop__amount">${display}</span>
          <span className="price-drop__per">
            <span className="price-drop__mo">/mo</span>
            <span className="price-drop__forever">forever</span>
          </span>
        </div>
        <div className="mt-5 flex justify-center" aria-hidden="true">
          <span className="price-drop__pill">No subscription</span>
        </div>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground">
          Before the next renewal, check whether the tool you pay for has a free route. That check is what this directory is for.
        </p>
        <div className="mt-7">
          <Link to="/alternatives" className="btn-primary inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Browse free alternatives <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
