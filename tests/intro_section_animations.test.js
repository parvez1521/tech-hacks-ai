import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const read = (file) => fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');

const home = read('src/pages/HomePage.tsx');
const css = read('src/index.css');
const intro = read('src/components/IntroSplash.tsx');
const routeDraw = read('src/components/RouteDraw.tsx');
const priceDrop = read('src/components/PriceDrop.tsx');
const flowMini = read('src/components/SwitchFlowMini.tsx');
const switchFlow = read('src/components/SwitchFlow.tsx');

describe('Owner-chosen intro + section animations (Nov 2026)', () => {
  it('mounts all four pieces on the homepage in the intended order', () => {
    for (const name of ['IntroSplash', 'RouteDraw', 'PriceDrop', 'SwitchFlowMini']) {
      assert.match(home, new RegExp(`import \\{ ${name} \\} from '../components/${name}';`));
      assert.ok(home.includes(`<${name} />`), `HomePage renders <${name} />`);
    }
    const idx = (needle) => home.indexOf(needle);
    // Intro is the first thing in <main>, before the hero.
    assert.ok(idx('<IntroSplash />') < idx('home-hero-heading'));
    // RouteDraw sits between the collections section and the frontier band.
    assert.ok(idx('collections-heading') < idx('<RouteDraw />'));
    assert.ok(idx('<RouteDraw />') < idx('frontier-access-heading'));
    // SwitchFlowMini sits between the categories grid and the task grid.
    assert.ok(idx('categories-heading') < idx('<SwitchFlowMini />'));
    assert.ok(idx('<SwitchFlowMini />') < idx('task-categories-heading'));
    // PriceDrop closes the page, after the resources section.
    assert.ok(idx('resources-heading') < idx('<PriceDrop />'));
    assert.ok(idx('<PriceDrop />') < idx('</main>'));
  });

  it('keeps the exact homepage headline untouched', () => {
    const h1 = home.match(/<h1 id="home-hero-heading"[\s\S]*?<\/h1>/)?.[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    assert.equal(h1, 'Another AI tool? Sure. Another Subscription? Nope.');
  });

  it('intro splash is session-gated, skippable and fail-safe', () => {
    // Once per session: flag is written before the first frame plays.
    assert.match(intro, /switchroute-intro-seen/);
    assert.ok(intro.indexOf('sessionStorage.setItem') < intro.indexOf("setPhase('playing')"));
    // Reduced-motion and coarse-pointer visitors never see it.
    assert.match(intro, /prefers-reduced-motion: reduce/);
    assert.match(intro, /pointer: coarse/);
    // Click anywhere skips (a real button, not a clickable div);
    // a JS timer unmounts it on schedule.
    assert.match(intro, /<button type="button" className="intro-splash__skip" onClick=\{dismiss\}/);
    assert.match(intro, /INTRO_DISMISS_MS = 2150/);
    // The splash is an overlay, never a render gate for the page.
    assert.match(css, /\.intro-splash \{\s*position: fixed;/);
    assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.intro-splash \{ display: none !important; \}/);
  });

  it('intro card flips from the paid card to the free card over a drawn route', () => {
    assert.match(intro, /AI Tool Pro/);
    assert.match(intro, /\$20/);
    assert.match(intro, /Free alternative/);
    assert.match(intro, /intro-free-badge/);
    assert.match(css, /@keyframes introFlip/);
    assert.match(css, /@keyframes introRouteDraw/);
    assert.match(css, /@keyframes introLeverKnob/);
  });

  it('route draw plays once on scroll and settles on the free pin', () => {
    assert.match(routeDraw, /useScrollReveal/);
    assert.match(routeDraw, /animateMotion/);
    assert.match(routeDraw, /Paid tool/);
    assert.match(routeDraw, /Free alternative/);
    for (const stop of ['#FF6A00', '#F93A12', '#FFB800']) assert.ok(routeDraw.includes(stop), `route gradient stop ${stop}`);
    assert.match(css, /\.route-draw\.is-played \.route-draw__line \{ stroke-dashoffset: 0; \}/);
  });

  it('price drop counts $29/mo down to $0 forever with the No subscription pill', () => {
    assert.match(priceDrop, /START_PRICE = 29/);
    assert.match(priceDrop, /useScrollReveal/);
    assert.match(priceDrop, /prefers-reduced-motion: reduce/);
    assert.match(priceDrop, /forever/);
    assert.match(priceDrop, /price-drop__pill">No subscription/);
    assert.match(priceDrop, /to="\/alternatives"/);
    assert.match(css, /\.price-drop\.is-done \.price-drop__pill \{ opacity: 1;/);
  });

  it('switch flow mini reuses real catalogue pairs from the full SwitchFlow', () => {
    assert.match(flowMini, /useScrollReveal/);
    for (const [paid, free] of [['figma', 'penpot'], ['notion', 'appflowy'], ['zapier', 'n8n']]) {
      assert.ok(flowMini.includes(`slug: '${paid}'`) && flowMini.includes(`slug: '${free}'`), `mini pair ${paid} -> ${free}`);
      assert.ok(switchFlow.includes(`slug: '${paid}'`) && switchFlow.includes(`slug: '${free}'`), `pair ${paid} -> ${free} is backed by SwitchFlow`);
    }
    // One-shot CSS animation, not the full looping engine.
    assert.match(css, /@keyframes flowMiniIn/);
    assert.match(css, /@keyframes flowMiniOut/);
    assert.match(css, /\.flow-mini\.is-played \.flow-mini__chip--in/);
  });

  it('no banned decoration sneaks in with the new components', () => {
    for (const [name, source] of [['IntroSplash', intro], ['RouteDraw', routeDraw], ['PriceDrop', priceDrop], ['SwitchFlowMini', flowMini]]) {
      assert.ok(!source.includes('Sparkles'), `${name} must not use sparkle icons`);
      assert.ok(!/#[0-9a-fA-F]{6}/.test(source.replace(/#FF6A00|#F93A12|#FFB800/g, '')), `${name} introduces no off-brand hex colours`);
    }
  });
});
