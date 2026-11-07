import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const read = (relative) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('Frontier model access-route boxes', () => {
  test('every access-route box is individually highlighted in the brand orange', () => {
    const page = read('src/pages/FrontierModelsPage.tsx');
    // The route boxes are rendered from one shared map, so this single
    // class set highlights the boxes on every model card on the page.
    assert.ok(page.includes('border-primary/50 bg-primary/5'), 'Route boxes must carry the primary-orange border and tint');
    assert.ok(page.includes('shadow-[0_0_28px_-12px_rgb(var(--color-primary)/0.5)]'), 'Route boxes must carry the soft primary-orange glow');
    assert.ok(!page.includes('<div key={route.id} className="border border-border rounded-lg p-4">'), 'The plain un-highlighted route box must not come back');
    // Highlight only: the route box markup, links and data flow stay untouched.
    assert.ok(page.includes('href={route.claimUrl}'), 'Route claim link unchanged');
    assert.ok(page.includes('href={route.sourceUrl}'), 'Source and terms link unchanged');
  });
});
