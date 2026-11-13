import { useEffect } from 'react';

/**
 * ScrollMorph — site-wide scroll "morph" reveals.
 *
 * Tags content blocks inside <main> (cards, list items, articles and
 * section headings) and, as each one enters the viewport, morphs it into
 * place: a rise + settle-scale + unblur, with cards also settling their
 * corner radius from a softer blob to their natural radius. Sibling
 * groups stagger by up to ~0.36s.
 *
 * Safety rails:
 * - The hidden state only exists under `html.js` (set by the pre-paint
 *   script), so no-JS rendering and prerendered snapshots always show
 *   the content.
 * - `prefers-reduced-motion` disables the system entirely.
 * - The hero (`.hero-aurora`, which has its own entrance) and anything
 *   marked `data-no-reveal` (e.g. the SwitchFlow animation stage) are
 *   never touched, and only the outermost block of a nested group is
 *   tagged so nothing double-animates.
 * - Blocks taller than MAX_REVEAL_HEIGHT_PX are never tagged either:
 *   the 3D flip goes singular past that height (see the constant), so
 *   they stay fully visible with no reveal animation.
 * - After a block's reveal finishes, its transition is removed so hover
 *   transforms on cards stay instant.
 */

const TARGET_SELECTOR = 'article, li, h2, .glass-card, .card-glow, [class*="-card"]';
const CARDISH = /card/i;

// Tall elements are never tagged: the hidden state tilts a block back
// -38deg around its bottom edge under a 900px perspective, and the
// perspective projection goes singular at z = 900px — i.e. ~1,461px
// (900 / sin 38°) above the block's bottom edge. Any block taller than
// that crosses the singularity plane, so during the 0.7s flip its top
// sweeps toward the viewer and is magnified into giant blurred glyphs,
// while its projected bounding box lands thousands of pixels down the
// page and the IntersectionObserver never fires. 1400px stays just
// under the ~1,461px line. Such blocks are left fully visible with no
// reveal animation at all.
const MAX_REVEAL_HEIGHT_PX = 1400;

export const ScrollMorph: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const main = document.querySelector('main');
    if (!main) return;

    const tagged = new Set<Element>();
    const groupCounts = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          el.classList.add('is-revealed');
          const delay = Number(el.dataset.revealDelay || 0);
          window.setTimeout(() => el.classList.add('is-settled'), 1300 + delay);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    );

    const tag = (root: ParentNode) => {
      const candidates = root.querySelectorAll(TARGET_SELECTOR);
      candidates.forEach((el) => {
        if (tagged.has(el)) return;
        if (el.closest('.hero-aurora, [data-no-reveal]')) return;
        // Outermost only: skip anything inside an already-tagged block.
        let ancestor = el.parentElement;
        let nested = false;
        while (ancestor && ancestor !== main) {
          if (tagged.has(ancestor)) {
            nested = true;
            break;
          }
          ancestor = ancestor.parentElement;
        }
        if (nested) return;

        const htmlEl = el as HTMLElement;
        if (htmlEl.offsetHeight === 0) return;
        // Tall blocks cross the perspective singularity plane (see
        // MAX_REVEAL_HEIGHT_PX): skip them entirely so they stay fully
        // visible with no reveal animation.
        if (htmlEl.offsetHeight > MAX_REVEAL_HEIGHT_PX) return;

        const parent = el.parentElement;
        const index = parent ? groupCounts.get(parent) || 0 : 0;
        if (parent) groupCounts.set(parent, index + 1);
        const delay = Math.min(index, 6) * 60;
        htmlEl.dataset.revealDelay = String(delay);
        htmlEl.style.setProperty('--reveal-delay', `${delay}ms`);

        if (CARDISH.test(el.className) || el.tagName === 'ARTICLE') {
          const radius = getComputedStyle(htmlEl).borderRadius;
          htmlEl.style.setProperty('--reveal-radius', radius);
          htmlEl.classList.add('morph-reveal--card');
        }
        htmlEl.classList.add('morph-reveal');
        tagged.add(el);
        observer.observe(el);
      });
    };

    tag(main);

    // The router swaps page content inside <main> without a reload;
    // watch for that and tag whatever arrives.
    let debounce = 0;
    const mutation = new MutationObserver(() => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => tag(main), 120);
    });
    mutation.observe(main, { childList: true, subtree: true });

    return () => {
      mutation.disconnect();
      observer.disconnect();
      window.clearTimeout(debounce);
    };
  }, []);

  return null;
};

export default ScrollMorph;
