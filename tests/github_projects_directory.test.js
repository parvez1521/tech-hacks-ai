import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { readmeExcerpt } from '../api/github-projects.js';
import { githubProjectCategories, githubProjects, githubProjectSources, publicGitHubProjects } from '../src/data/githubProjectsData.ts';
import { filterAndSortGitHubProjects, refreshGitHubProjectMetadata } from '../src/services/githubProjectsService.ts';

function responseMock() {
  return {
    headers: {}, code: 200, body: null,
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; return this; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

function req(method, url) { return { method, url, headers: { host: 'localhost' } }; }
function okJson(data, headers = {}) { return { ok: true, status: 200, headers: new Headers({ 'x-ratelimit-remaining': '55', ...headers }), json: async () => data, text: async () => JSON.stringify(data) }; }

test('candidate records are unique, categories resolve, and only verified projects are public', () => {
  assert.equal(new Set(githubProjects.map((project) => project.fullName)).size, githubProjects.length);
  assert.equal(githubProjectCategories.length, 10);
  for (const project of githubProjects) {
    assert.ok(githubProjectCategories.some((category) => category.id === project.primaryCategory));
    for (const categoryId of project.secondaryCategories) assert.ok(githubProjectCategories.some((category) => category.id === categoryId));
    assert.ok(['verified', 'needs-review', 'archived-unavailable', 'license-unclear'].includes(project.verificationStatus));
  }
  assert.ok(publicGitHubProjects.every((project) => project.verificationStatus === 'verified'));
  assert.equal(publicGitHubProjects.some((project) => project.fullName === 'Autom8AI/Open-Higgsfield-AI'), false);
  assert.equal(publicGitHubProjects.some((project) => project.fullName === 'n8n-io/n8n'), false);
  assert.equal(githubProjects.find((project) => project.fullName === 'n8n-io/n8n').verificationStatus, 'needs-review');
  assert.equal(githubProjectSources.some((source) => githubProjects.some((project) => project.fullName === source.fullName)), false);
});

test('directory search, category relationships, structured filters, sorting and pagination work', () => {
  const secondaryCategory = filterAndSortGitHubProjects({ category: 'self-hosted-apps', pageSize: 100 });
  assert.ok(secondaryCategory.projects.some((project) => project.fullName === 'ollama/ollama'));
  assert.ok(secondaryCategory.projects.some((project) => project.fullName === 'Comfy-Org/ComfyUI'));
  const searched = filterAndSortGitHubProjects({ query: 'transcription offline', pageSize: 100 });
  assert.deepEqual(searched.projects.map((project) => project.slug), ['handy']);
  const filtered = filterAndSortGitHubProjects({ license: 'MIT', language: 'Python', selfHostable: 'yes', requiresGpu: 'not-required', requiresApiKey: 'not-required', pageSize: 100 });
  assert.ok(filtered.projects.length > 0);
  assert.ok(filtered.projects.every((project) => project.licenseSpdxId === 'MIT' && project.language === 'Python' && project.selfHostable && project.requiresGpu === false && project.requiresApiKey === false));
  const stars = filterAndSortGitHubProjects({ sort: 'stars', pageSize: 100 }).projects;
  assert.ok(stars[0].stars >= stars.at(-1).stars);
  const curated = filterAndSortGitHubProjects({ sort: 'curated', pageSize: 100 }).projects;
  assert.equal(curated[0].featured, true);
  const updated = filterAndSortGitHubProjects({ sort: 'updated', pageSize: 100 }).projects;
  assert.ok(new Date(updated[0].repositoryUpdatedAt) >= new Date(updated.at(-1).repositoryUpdatedAt));
  const first = filterAndSortGitHubProjects({ sort: 'stars', page: 1, pageSize: 4 });
  const second = filterAndSortGitHubProjects({ sort: 'stars', page: 2, pageSize: 4 });
  assert.equal(first.pageCount, Math.ceil(first.total / 4));
  assert.equal(new Set([...first.projects, ...second.projects].map((project) => project.id)).size, 8);
});

test('metadata API is GET-only and restricts requests to curated verified repositories', async () => {
  const notFound = responseMock();
  let fetchCount = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { fetchCount += 1; throw new Error('should not fetch'); };
  try {
    await handler(req('GET', '/api/github-projects?repo=attacker/other'), notFound);
    assert.equal(notFound.code, 400);
    assert.match(notFound.body.error, /allowlist/);
    const method = responseMock();
    await handler(req('POST', '/api/github-projects?repo=ollama/ollama'), method);
    assert.equal(method.code, 405);
    assert.equal(method.headers.allow, 'GET');
    assert.equal(fetchCount, 0);
  } finally { globalThis.fetch = originalFetch; }
});

test('metadata API fetches repository, README and latest commit, sanitizes text and caches results', async () => {
  let fetchCount = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    fetchCount += 1;
    if (String(url).endsWith('/readme')) return { ok: true, status: 200, headers: new Headers({ 'x-ratelimit-remaining': '50' }), text: async () => '# Ollama\n\nRun local models <script>alert(1)</script> from a simple CLI and API.' };
    if (String(url).includes('/commits?per_page=1')) return okJson([{ commit: { committer: { date: '2026-11-03T10:00:00Z' } } }]);
    return okJson({ full_name: 'ollama/ollama', description: '<img src=x onerror=alert(1)> Run open models <script>x</script> locally.', language: 'Go', license: { name: 'MIT License', spdx_id: 'MIT' }, stargazers_count: 42, forks_count: 4, open_issues_count: 2, archived: false, default_branch: 'main', homepage: 'https://ollama.com', pushed_at: '2026-11-03T09:00:00Z', updated_at: '2026-11-03T10:00:00Z' });
  };
  try {
    const first = responseMock();
    await handler(req('GET', '/api/github-projects?repo=ollama/ollama&refresh=1'), first);
    assert.equal(first.code, 200);
    assert.equal(fetchCount, 3);
    assert.equal(first.body.metadata.lastCommitAt, '2026-11-03T10:00:00Z');
    assert.doesNotMatch(first.body.metadata.githubDescription, /script|onerror|<img/i);
    assert.doesNotMatch(first.body.metadata.readmeExcerpt, /script|alert|</i);
    assert.equal(first.headers['cache-control'], 'no-store');
    const second = responseMock();
    await handler(req('GET', '/api/github-projects?repo=ollama/ollama'), second);
    assert.equal(second.code, 200);
    assert.equal(fetchCount, 3);
    assert.equal(second.body.metadata.stars, 42);
    assert.match(second.headers['cache-control'], /s-maxage=300/);
  } finally { globalThis.fetch = originalFetch; }
});

test('metadata API serves the last successful response as stale when an expired cache refresh fails', async () => {
  const originalFetch = globalThis.fetch;
  const originalNow = Date.now;
  let now = originalNow();
  Date.now = () => now;
  globalThis.fetch = async (url) => {
    if (String(url).endsWith('/readme')) return { ok: true, status: 200, headers: new Headers({ 'x-ratelimit-remaining': '50' }), text: async () => '# MarkItDown\n\nConvert documents into Markdown with a simple command line utility.' };
    if (String(url).includes('/commits?per_page=1')) return okJson([{ commit: { committer: { date: '2026-11-03T10:00:00Z' } } }]);
    return okJson({ full_name: 'microsoft/markitdown', description: 'Convert files to Markdown.', language: 'Python', license: { name: 'MIT License', spdx_id: 'MIT' }, stargazers_count: 1, forks_count: 1, open_issues_count: 1, archived: false, default_branch: 'main', homepage: 'https://github.com/microsoft/markitdown', updated_at: '2026-11-03T10:00:00Z' });
  };
  try {
    const first = responseMock();
    await handler(req('GET', '/api/github-projects?repo=microsoft/markitdown'), first);
    assert.equal(first.code, 200);
    assert.equal(first.body.stale, false);
    const originalFetchedAt = first.body.metadata.fetchedAt;

    now += 16 * 60 * 1000;
    globalThis.fetch = async () => ({ ok: false, status: 503, headers: new Headers(), json: async () => ({ error: 'temporarily unavailable' }) });
    const stale = responseMock();
    await handler(req('GET', '/api/github-projects?repo=microsoft/markitdown'), stale);
    assert.equal(stale.code, 200);
    assert.equal(stale.body.stale, true);
    assert.equal(stale.body.metadata.fetchedAt, originalFetchedAt);
  } finally {
    globalThis.fetch = originalFetch;
    Date.now = originalNow;
  }
});

test('API metadata failure leaves the curated offline directory intact', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 503, headers: new Headers(), json: async () => ({ error: 'offline' }) });
  try {
    const result = await refreshGitHubProjectMetadata('ollama/ollama');
    assert.equal(result.success, false);
    assert.match(result.error, /unavailable|reach|offline/i);
    assert.ok(publicGitHubProjects.some((project) => project.fullName === 'ollama/ollama'));
    assert.match(readmeExcerpt('# Example\n\nA useful thing. <script>bad</script>'), /A useful thing/);
  } finally { globalThis.fetch = originalFetch; }
});
