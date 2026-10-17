import { test, describe } from 'node:test';
import assert from 'node:assert';

function matchRoute(pathname) {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  if (cleanPath === '/') return { route: 'home', params: {} };
  if (cleanPath === '/tools') return { route: 'tools', params: {} };
  if (cleanPath === '/categories') return { route: 'categories', params: {} };
  if (cleanPath === '/alternatives') return { route: 'alternatives', params: {} };

  const toolsMatch = cleanPath.match(/^\/tools\/([^/]+)$/);
  if (toolsMatch) return { route: 'tool-detail', params: { slug: toolsMatch[1] } };

  const categoriesMatch = cleanPath.match(/^\/categories\/([^/]+)$/);
  if (categoriesMatch) return { route: 'category-detail', params: { slug: categoriesMatch[1] } };

  const alternativesMatch = cleanPath.match(/^\/alternatives\/([^/]+)$/);
  if (alternativesMatch) return { route: 'alternative-detail', params: { slug: alternativesMatch[1] } };

  const collectionsMatch = cleanPath.match(/^\/collections\/([^/]+)$/);
  if (collectionsMatch) return { route: 'collection-detail', params: { slug: collectionsMatch[1] } };

  const singleSlugMatch = cleanPath.match(/^\/([a-zA-Z0-9_-]+)$/);
  if (singleSlugMatch) return { route: 'tool-detail', params: { slug: singleSlugMatch[1] } };

  return { route: 'not-found', params: {} };
}

describe('Core Routes Matching Verification', () => {
  test('matches root / to home', () => {
    assert.deepStrictEqual(matchRoute('/'), { route: 'home', params: {} });
  });

  test('matches /tools to tools directory', () => {
    assert.deepStrictEqual(matchRoute('/tools'), { route: 'tools', params: {} });
  });

  test('matches /tools/:slug to tool-detail', () => {
    assert.deepStrictEqual(matchRoute('/tools/supabase'), {
      route: 'tool-detail',
      params: { slug: 'supabase' },
    });
  });

  test('matches /categories to categories index', () => {
    assert.deepStrictEqual(matchRoute('/categories'), { route: 'categories', params: {} });
  });

  test('matches /categories/:slug to category-detail', () => {
    assert.deepStrictEqual(matchRoute('/categories/developer-tools'), {
      route: 'category-detail',
      params: { slug: 'developer-tools' },
    });
  });

  test('matches /alternatives to alternatives index', () => {
    assert.deepStrictEqual(matchRoute('/alternatives'), { route: 'alternatives', params: {} });
  });

  test('matches /alternatives/:slug to alternative-detail', () => {
    assert.deepStrictEqual(matchRoute('/alternatives/notion'), {
      route: 'alternative-detail',
      params: { slug: 'notion' },
    });
  });

  test('matches /collections/:slug to collection-detail', () => {
    assert.deepStrictEqual(matchRoute('/collections/self-hosted'), {
      route: 'collection-detail',
      params: { slug: 'self-hosted' },
    });
    assert.deepStrictEqual(matchRoute('/collections/trending'), {
      route: 'collection-detail',
      params: { slug: 'trending' },
    });
  });

  test('matches direct slug /supabase as tool-detail fallback', () => {
    assert.deepStrictEqual(matchRoute('/postiz'), {
      route: 'tool-detail',
      params: { slug: 'postiz' },
    });
  });
});
