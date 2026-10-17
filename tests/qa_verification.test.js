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
} from '../src/services/catalogService.ts';

describe('Task 7: Real Behavior of Every Advertised Sort Option', () => {
  test('sort_stars orders by stars descending', () => {
    const res = filterAndSortTools({
      searchQuery: '',
      sortBy: 'stars',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });
    for (let i = 0; i < res.tools.length - 1; i++) {
      assert.ok(
        res.tools[i].stars >= res.tools[i + 1].stars,
        `Expected stars ${res.tools[i].stars} >= ${res.tools[i + 1].stars}`
      );
    }
  });

  test('sort_trending orders by starGrowthDelta (estimated monthly velocity) descending', () => {
    const res = filterAndSortTools({
      searchQuery: '',
      sortBy: 'trending',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });
    for (let i = 0; i < res.tools.length - 1; i++) {
      assert.ok(
        res.tools[i].starGrowthDelta >= res.tools[i + 1].starGrowthDelta,
        `Expected delta ${res.tools[i].starGrowthDelta} >= ${res.tools[i + 1].starGrowthDelta}`
      );
    }
  });

  test('sort_forks orders by forks descending', () => {
    const res = filterAndSortTools({
      searchQuery: '',
      sortBy: 'forks',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });
    for (let i = 0; i < res.tools.length - 1; i++) {
      assert.ok(
        res.tools[i].forks >= res.tools[i + 1].forks,
        `Expected forks ${res.tools[i].forks} >= ${res.tools[i + 1].forks}`
      );
    }
  });

  test('sort_last_commit orders by recent commit date descending', () => {
    const res = filterAndSortTools({
      searchQuery: '',
      sortBy: 'last_commit',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });
    for (let i = 0; i < res.tools.length - 1; i++) {
      const timeA = new Date(res.tools[i].lastCommitDate).getTime();
      const timeB = new Date(res.tools[i + 1].lastCommitDate).getTime();
      assert.ok(timeA >= timeB, `Expected commit time ${timeA} >= ${timeB}`);
    }
  });

  test('sort_oldest orders by repositoryAgeYears descending', () => {
    const res = filterAndSortTools({
      searchQuery: '',
      sortBy: 'oldest',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });
    for (let i = 0; i < res.tools.length - 1; i++) {
      assert.ok(
        res.tools[i].repositoryAgeYears >= res.tools[i + 1].repositoryAgeYears,
        `Expected age ${res.tools[i].repositoryAgeYears} >= ${res.tools[i + 1].repositoryAgeYears}`
      );
    }
  });

  test('sort_name_asc and sort_name_desc order alphabetically', () => {
    const asc = filterAndSortTools({
      searchQuery: '',
      sortBy: 'name_asc',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });
    const desc = filterAndSortTools({
      searchQuery: '',
      sortBy: 'name_desc',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });

    assert.strictEqual(asc.tools[0].name.toLowerCase() <= asc.tools[1].name.toLowerCase(), true);
    assert.strictEqual(desc.tools[0].name.toLowerCase() >= desc.tools[1].name.toLowerCase(), true);
  });
});

describe('Task 4: Combined Filters, Reset, and State Transitions', () => {
  test('combines search query with tech stack filter', () => {
    const res = filterAndSortTools({
      searchQuery: 'database',
      sortBy: 'popular',
      category: null,
      alternativeTo: null,
      techStack: 'PostgreSQL',
      license: null,
      page: 1,
    });

    assert.ok(res.totalCount > 0);
    for (const tool of res.tools) {
      assert.ok(tool.techStack.includes('PostgreSQL'));
      const textMatches =
        tool.name.toLowerCase().includes('database') ||
        tool.tagline.toLowerCase().includes('database') ||
        tool.description.toLowerCase().includes('database') ||
        tool.tags.some((t) => t.toLowerCase().includes('database'));
      assert.ok(textMatches);
    }
  });

  test('combines category, alternative, and license filters', () => {
    const res = filterAndSortTools({
      searchQuery: '',
      sortBy: 'popular',
      category: 'productivity',
      alternativeTo: 'notion',
      techStack: null,
      license: 'AGPL-3.0',
      page: 1,
    });

    assert.ok(res.totalCount > 0);
    for (const tool of res.tools) {
      assert.ok(tool.categories.includes('productivity'));
      assert.ok(tool.alternativesTo.includes('notion'));
      assert.strictEqual(tool.license, 'AGPL-3.0');
    }
  });

  test('clearing a single filter expands result count', () => {
    const restricted = filterAndSortTools({
      searchQuery: '',
      sortBy: 'popular',
      category: 'productivity',
      alternativeTo: 'notion',
      techStack: null,
      license: 'AGPL-3.0',
      page: 1,
    });

    // Remove license filter
    const expanded = filterAndSortTools({
      searchQuery: '',
      sortBy: 'popular',
      category: 'productivity',
      alternativeTo: 'notion',
      techStack: null,
      license: null,
      page: 1,
    });

    assert.ok(expanded.totalCount >= restricted.totalCount);
  });
});

describe('Task 8: Unknown Slugs, Empty Results, and Invalid Parameters', () => {
  test('returns empty results when search does not match', () => {
    const res = filterAndSortTools({
      searchQuery: 'completely-nonexistent-search-term-xyz',
      sortBy: 'popular',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });

    assert.strictEqual(res.totalCount, 0);
    assert.strictEqual(res.tools.length, 0);
    assert.strictEqual(res.totalPages, 1);
  });

  test('handles unknown category gracefully', () => {
    const res = filterAndSortTools({
      searchQuery: '',
      sortBy: 'popular',
      category: 'fake-category-123',
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 1,
    });

    assert.strictEqual(res.totalCount, 0);
  });

  test('handles invalid/negative page numbers by clamping to page 1', () => {
    const res = filterAndSortTools({
      searchQuery: '',
      sortBy: 'popular',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: -5,
    });

    assert.strictEqual(res.currentPage, 1);
    assert.ok(res.tools.length > 0);
  });

  test('handles excessive page numbers by clamping to totalPages', () => {
    const res = filterAndSortTools({
      searchQuery: '',
      sortBy: 'popular',
      category: null,
      alternativeTo: null,
      techStack: null,
      license: null,
      page: 99999,
    });

    assert.strictEqual(res.currentPage, res.totalPages);
    assert.ok(res.tools.length > 0);
  });

  test('getToolBySlug returns undefined for unknown slug', () => {
    assert.strictEqual(getToolBySlug('unknown-tool-slug-xyz'), undefined);
  });

  test('getProprietaryToolBySlug returns undefined for unknown slug', () => {
    assert.strictEqual(getProprietaryToolBySlug('unknown-proprietary-slug'), undefined);
  });

  test('getCategoryBySlug returns undefined for unknown slug', () => {
    assert.strictEqual(getCategoryBySlug('unknown-category-slug'), undefined);
  });

  test('getCollectionBySlug returns undefined for unknown slug', () => {
    assert.strictEqual(getCollectionBySlug('unknown-collection-slug'), undefined);
  });
});

describe('Task 6: Data Integrity & Provenance', () => {
  test('all verified tools have verifiedAt date and valid repository URL', () => {
    for (const tool of toolsData) {
      if (tool.isVerified) {
        assert.ok(tool.verifiedAt, `Tool ${tool.slug} marked verified without verifiedAt date`);
        assert.ok(
          tool.repositoryUrl.startsWith('https://github.com/'),
          `Tool ${tool.slug} marked verified without valid GitHub URL`
        );
      }
    }
  });

  test('starGrowthDelta is explicitly marked with starVelocityType', () => {
    for (const tool of toolsData) {
      assert.ok(
        ['estimated', 'measured'].includes(tool.starVelocityType),
        `Tool ${tool.slug} missing starVelocityType`
      );
    }
  });
});
