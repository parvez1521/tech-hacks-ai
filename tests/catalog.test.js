import { test, describe } from 'node:test';
import assert from 'node:assert';
import { toolsData } from '../src/data/seedData.ts';
import { proprietaryTools } from '../src/data/alternatives.ts';
import { categories } from '../src/data/categories.ts';
import { collections } from '../src/data/collections.ts';
import {
  filterAndSortTools,
  getToolBySlug,
  getProprietaryToolBySlug,
  getCategoryBySlug,
  getCollectionBySlug,
  getToolsForProprietary,
  getSimilarTools,
  getDistinctTechStacks,
  getDistinctLicenses,
} from '../src/services/catalogService.ts';

describe('Catalog Data Foundation', () => {
  test('all tools have unique slugs and ids', () => {
    const ids = new Set();
    const slugs = new Set();

    for (const tool of toolsData) {
      assert.ok(!ids.has(tool.id), `Duplicate ID found: ${tool.id}`);
      assert.ok(!slugs.has(tool.slug), `Duplicate Slug found: ${tool.slug}`);
      ids.add(tool.id);
      slugs.add(tool.slug);
    }

    assert.ok(toolsData.length >= 20, 'Should have at least 20 verified tools in seed catalog');
  });

  test('all tools reference valid categories', () => {
    const validCategorySlugs = new Set(categories.map((c) => c.slug));

    for (const tool of toolsData) {
      for (const cat of tool.categories) {
        assert.ok(
          validCategorySlugs.has(cat),
          `Tool ${tool.slug} references invalid category ${cat}`
        );
      }
    }
  });

  test('all alternative mappings point to valid proprietary software', () => {
    const validProprietarySlugs = new Set(proprietaryTools.map((p) => p.slug));

    for (const tool of toolsData) {
      for (const alt of tool.alternativesTo) {
        assert.ok(
          validProprietarySlugs.has(alt),
          `Tool ${tool.slug} references non-existent proprietary slug ${alt}`
        );
      }
    }
  });

  test('all tools contain valid license and repository URLs', () => {
    for (const tool of toolsData) {
      assert.ok(tool.license.length > 0, `Tool ${tool.slug} missing license`);
      assert.ok(tool.repositoryUrl.startsWith('https://github.com/'), `Tool ${tool.slug} missing valid GitHub repo`);
      assert.ok(typeof tool.stars === 'number' && tool.stars > 0, `Tool ${tool.slug} invalid stars`);
      assert.ok(typeof tool.forks === 'number' && tool.forks >= 0, `Tool ${tool.slug} invalid forks`);
    }
  });
});

describe('Search & Filter Engine', () => {
  test('text search matches by tool name', () => {
    const result = filterAndSortTools({
      searchQuery: 'supabase',
      sortBy: 'popular',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });

    assert.strictEqual(result.tools.length, 1);
    assert.strictEqual(result.tools[0].slug, 'supabase');
  });

  test('text search matches by tech stack (e.g. Rust)', () => {
    const result = filterAndSortTools({
      searchQuery: 'Rust',
      sortBy: 'popular',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });

    assert.ok(result.totalCount > 0);
    for (const tool of result.tools) {
      const hasRustInStack = tool.techStack.includes('Rust');
      const hasRustInName = tool.name.toLowerCase().includes('rust');
      const hasRustInDesc = tool.description.toLowerCase().includes('rust');
      assert.ok(hasRustInStack || hasRustInName || hasRustInDesc);
    }
  });

  test('clearing search returns full set of tools', () => {
    const withSearch = filterAndSortTools({
      searchQuery: 'appflowy',
      sortBy: 'popular',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });
    assert.strictEqual(withSearch.totalCount, 1);

    const cleared = filterAndSortTools({
      searchQuery: '',
      sortBy: 'popular',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });
    assert.strictEqual(cleared.totalCount, toolsData.length);
  });

  test('category filter restricts results to that category', () => {
    const result = filterAndSortTools({
      searchQuery: '',
      sortBy: 'popular',
      category: 'analytics',
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });

    assert.ok(result.totalCount > 0);
    for (const tool of result.tools) {
      assert.ok(tool.categories.includes('analytics'));
    }
  });

  test('alternativeTo filter restricts to tools replacing that app', () => {
    const result = filterAndSortTools({
      searchQuery: '',
      sortBy: 'popular',
      category: null,
      alternativeTo: 'notion',
      techStack: null,
      license: null,
      page: 1,
    });

    assert.ok(result.totalCount >= 2);
    for (const tool of result.tools) {
      assert.ok(tool.alternativesTo.includes('notion'));
    }
  });

  test('license filter restricts to tools with specified license', () => {
    const result = filterAndSortTools({
      searchQuery: '',
      sortBy: 'popular',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: 'MIT',
      page: 1,
    });

    assert.ok(result.totalCount > 0);
    for (const tool of result.tools) {
      assert.strictEqual(tool.license, 'MIT');
    }
  });

  test('empty results returned when no match is found', () => {
    const result = filterAndSortTools({
      searchQuery: 'nonexistent-query-xyz-12345',
      sortBy: 'popular',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });

    assert.strictEqual(result.totalCount, 0);
    assert.strictEqual(result.tools.length, 0);
    assert.strictEqual(result.totalPages, 1);
  });
});

describe('Sorting Capabilities', () => {
  test('sorting by stars sorts descending', () => {
    const result = filterAndSortTools({
      searchQuery: '',
      sortBy: 'stars',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });

    for (let i = 0; i < result.tools.length - 1; i++) {
      assert.ok(result.tools[i].stars >= result.tools[i + 1].stars);
    }
  });

  test('sorting by trending sorts by monthly star velocity descending', () => {
    const result = filterAndSortTools({
      searchQuery: '',
      sortBy: 'trending',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });

    for (let i = 0; i < result.tools.length - 1; i++) {
      assert.ok(result.tools[i].starGrowthDelta >= result.tools[i + 1].starGrowthDelta);
    }
  });

  test('sorting by name A-Z sorts alphabetically', () => {
    const result = filterAndSortTools({
      searchQuery: '',
      sortBy: 'name_asc',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });

    for (let i = 0; i < result.tools.length - 1; i++) {
      assert.ok(result.tools[i].name.localeCompare(result.tools[i + 1].name) <= 0);
    }
  });

  test('sorting by name Z-A sorts in reverse alphabetical order', () => {
    const result = filterAndSortTools({
      searchQuery: '',
      sortBy: 'name_desc',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });

    for (let i = 0; i < result.tools.length - 1; i++) {
      assert.ok(result.tools[i].name.localeCompare(result.tools[i + 1].name) >= 0);
    }
  });
});

describe('Detail Lookups & Similar Projects', () => {
  test('getToolBySlug returns exact tool details', () => {
    const tool = getToolBySlug('supabase');
    assert.ok(tool);
    assert.strictEqual(tool.name, 'Supabase');
    assert.strictEqual(tool.license, 'Apache-2.0');
    assert.strictEqual(tool.isSelfHostable, true);
  });

  test('getSimilarTools returns relevant tools in same category or alternative', () => {
    const baserow = getToolBySlug('baserow');
    assert.ok(baserow);
    const similar = getSimilarTools(baserow, 3);
    assert.ok(similar.length > 0);
    assert.ok(similar.every((t) => t.id !== baserow.id));
  });

  test('getProprietaryToolBySlug finds Notion and Airtable', () => {
    const notion = getProprietaryToolBySlug('notion');
    assert.ok(notion);
    assert.strictEqual(notion.name, 'Notion');

    const airtable = getProprietaryToolBySlug('airtable');
    assert.ok(airtable);
    assert.strictEqual(airtable.name, 'Airtable');
  });

  test('getCategoryBySlug returns category with subcategories', () => {
    const cat = getCategoryBySlug('developer-tools');
    assert.ok(cat);
    assert.ok(cat.subcategories.length > 0);
  });
});
