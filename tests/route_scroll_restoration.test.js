import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const routerSource = fs.readFileSync(path.join(ROOT, 'src/router/Router.tsx'), 'utf-8');

describe('Route navigation scroll restoration', () => {
  test('the SPA disables browser-managed scroll restoration while mounted', () => {
    assert.match(
      routerSource,
      /window\.history\.scrollRestoration\s*=\s*'manual'/,
      'RouterProvider should own route scroll position instead of restoring a stale browser position'
    );
  });

  test('a route change scrolls to the top after the new route commits', () => {
    assert.match(
      routerSource,
      /useIsomorphicLayoutEffect\(\(\)\s*=>\s*\{[\s\S]*?safeScrollTo\(\{\s*top:\s*0,\s*left:\s*0,\s*behavior:\s*'auto'\s*\}\);[\s\S]*?\},\s*\[currentPath\]\)/,
      'route changes should reset scroll before paint'
    );
  });

  test('navigation does not start a smooth scroll before route rendering', () => {
    const start = routerSource.indexOf('const navigate =');
    const end = routerSource.indexOf('const setSearchParams =', start);
    assert.ok(start >= 0 && end > start, 'navigate function should be present');
    const navigateBody = routerSource.slice(start, end);
    assert.doesNotMatch(
      navigateBody,
      /behavior:\s*'smooth'/,
      'smooth scrolling can be interrupted while the page is being replaced'
    );
  });

  test('the previous browser scroll restoration mode is restored on router cleanup', () => {
    assert.match(
      routerSource,
      /window\.history\.scrollRestoration\s*=\s*previousScrollRestoration/,
      'RouterProvider should avoid leaking global history settings if it unmounts'
    );
  });
});
