import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const read = (relative) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

const HALO = 'hover:shadow-[0_0_0_1px_rgb(var(--color-primary)/0.38),0_12px_38px_-8px_rgb(var(--brand-cyan)/0.48),0_28px_64px_-12px_rgb(var(--brand-violet)/0.42),0_4px_16px_-4px_rgb(var(--color-primary)/0.3)]';
const GRADIENT = '[background:var(--brand-route-gradient)] [color:rgb(var(--brand-midnight))]';

describe('Access-route boxes: brand route gradient, full-box click, homepage hover halo', () => {
  test('FrontierModelsPage route boxes use the brand route gradient with midnight ink text', () => {
    const page = read('src/pages/FrontierModelsPage.tsx');
    // The same gradient + ink as the site's .btn-primary (e.g. the orange
    // "Browse recent discoveries" button): orange -> vermilion -> amber,
    // theme-invariant, near-black label.
    assert.ok(page.includes(GRADIENT), 'Route box must use var(--brand-route-gradient) with brand-midnight ink');
    assert.ok(!page.includes('border-primary/50 bg-primary/5'), 'The v1 border/tint-only treatment must not come back');
    assert.ok(!page.includes('border border-primary bg-primary p-4 text-primary-foreground'), 'The v2 flat solid-primary treatment must not come back');
    assert.ok(page.includes(HALO), 'Route boxes must carry the homepage card hover halo');
    assert.ok(page.includes('has-[:focus-visible]:[outline:2px_solid'), 'Keyboard focus must outline the whole route box');
  });

  test('FrontierModelsPage route boxes are clickable across the whole box, not just the corner arrow', () => {
    const page = read('src/pages/FrontierModelsPage.tsx');
    assert.ok(page.includes('after:absolute after:inset-0 after:content-[\'\']'), 'The claim arrow link must stretch over the whole box');
    assert.ok(page.includes('className="relative z-10 underline" href={route.sourceUrl}'), 'Source and terms must stay independently clickable above the stretched link');
    assert.ok(page.includes('href={route.claimUrl}'), 'Route claim link unchanged');
  });

  test('Route boxes keep inner padding so content never touches the box edges', () => {
    // Regression (2026-11-07): the v3 gradient restyle dropped the original
    // p-4, so every label, badge and paragraph rendered flush against the
    // top-left corner of the box on production.
    const frontier = read('src/pages/FrontierModelsPage.tsx');
    const freeAi = read('src/pages/FreeAiSitesPage.tsx');
    assert.ok(frontier.includes('rounded-lg p-5 [background:var(--brand-route-gradient)]'), 'FrontierModelsPage route boxes must keep p-5 inner padding');
    assert.ok(freeAi.includes('rounded-lg p-5 [background:var(--brand-route-gradient)]'), 'FreeAiSitesPage route boxes must keep p-5 inner padding');
    assert.ok(!frontier.includes('rounded-lg [background:var(--brand-route-gradient)]'), 'FrontierModelsPage route box must not render without padding');
    assert.ok(!freeAi.includes('rounded-lg [background:var(--brand-route-gradient)]'), 'FreeAiSitesPage route box must not render without padding');
  });

  test('FreeAiSitesPage frontier route boxes get the same treatment', () => {
    const page = read('src/pages/FreeAiSitesPage.tsx');
    assert.ok(page.includes(GRADIENT), 'Free AI Sites route boxes must use the brand route gradient with midnight ink');
    assert.ok(page.includes(HALO), 'Free AI Sites route boxes must carry the homepage hover halo');
    assert.ok(page.includes('className="underline after:absolute after:inset-0 after:content-[\'\']" href={route.claimUrl}'), 'The Claim at provider link must stretch over the whole box');
    assert.ok(page.includes('className="relative z-10 underline" href={route.sourceUrl}'), 'Source and terms must stay independently clickable above the stretched link');
  });
});
