import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { freeToolsData } from '../src/data/freeToolsData.ts';

const read = (relative) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('Free tools card icons (Style B — single brand orange)', () => {
  const iconMapSource = read('src/data/freeToolIcons.ts');
  const entries = [...iconMapSource.matchAll(/'([a-z0-9-]+)':\s*([A-Za-z0-9]+),/g)]
    .map((match) => ({ id: match[1], icon: match[2] }));

  test('every registered utility has exactly one icon entry', () => {
    assert.equal(entries.length, freeToolsData.length, 'Icon map must cover every utility exactly once');
    freeToolsData.forEach((tool) => {
      assert.ok(entries.some((entry) => entry.id === tool.id), `${tool.id} must have an icon`);
    });
  });

  test('no two utilities share the same icon', () => {
    assert.equal(new Set(entries.map((entry) => entry.icon)).size, entries.length, 'Icons must be unique per tool');
  });

  test('every mapped icon is a real export of the installed lucide-react', () => {
    const declarations = read('node_modules/lucide-react/dist/lucide-react.d.ts');
    entries.forEach(({ icon }) => {
      assert.ok(declarations.includes(`declare const ${icon}:`), `${icon} must exist in lucide-react`);
    });
  });

  test('the listing page renders the icon tile and the stylesheet defines it in the brand accent', () => {
    const page = read('src/pages/FreeToolsPage.tsx');
    assert.ok(page.includes("from '../data/freeToolIcons'"), 'FreeToolsPage must import the icon map');
    assert.ok(page.includes('free-tool-tile'), 'FreeToolsPage cards must render the icon tile');
    const css = read('src/index.css');
    assert.ok(css.includes('.free-tool-tile'), 'index.css must define .free-tool-tile');
    assert.ok(css.includes('rgb(var(--color-primary)'), 'Tile must resolve through the primary (brand orange) token');
  });
});
