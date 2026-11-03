const VERIFIED_REPOSITORIES = new Set([
  'Comfy-Org/ComfyUI', 'QwenLM/qwen-code', 'aaif-goose/goose', 'langchain-ai/open-swe',
  'ollama/ollama', 'ggml-org/llama.cpp', 'containers/ramalama', 'kestra-io/kestra',
  'browser-use/browser-use', 'deepset-ai/haystack', 'firecrawl/firecrawl', 'cjpais/Handy', 'microsoft/markitdown',
]);
const cache = new Map();
const inFlight = new Map();
const lastRefreshAt = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;
const MIN_REFRESH_GAP_MS = 5 * 60 * 1000;
const USER_AGENT = 'SwitchRoute-GitHub-Project-Catalog';
let knownRateLimitRemaining = null;

function sanitizeText(value, maxLength = 500) {
  if (typeof value !== 'string') return null;
  return value
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s*/gm, '')
    .replace(/[`*_>#|]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength) || null;
}

function readmeExcerpt(readme) {
  if (typeof readme !== 'string') return null;
  const blocks = readme.split(/\n\s*\n/).map((block) => block.trim()).filter((block) =>
    block && !/^([#`!<|\[])|^(badge|table of contents)/i.test(block) && !/^(\[[^\]]+\]:|https?:\/\/)/.test(block)
  );
  for (const block of blocks) {
    const excerpt = sanitizeText(block, 700);
    if (excerpt && excerpt.length > 50) return excerpt;
  }
  return sanitizeText(blocks.join(' '), 700);
}

function sendCached(res, entry, stale = false) {
  return res.status(200).json({ metadata: entry.metadata, stale, fetchedAt: entry.fetchedAt });
}

async function fetchRepositoryMetadata(fullName) {
  const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': USER_AGENT };
  const requestGitHub = async (path, accept = headers.Accept) => {
    if (knownRateLimitRemaining !== null && knownRateLimitRemaining < 1) {
      const error = new Error('GitHub API rate limit reached. Try again after the reset window.');
      error.status = 503;
      throw error;
    }
    const response = await fetch(`https://api.github.com${path}`, { headers: { ...headers, Accept: accept } });
    const remainingHeader = response.headers.get('x-ratelimit-remaining');
    if (remainingHeader !== null && /^\d+$/.test(remainingHeader)) knownRateLimitRemaining = Number(remainingHeader);
    if (!response.ok) {
      const error = new Error(response.status === 403 || response.status === 429 ? 'GitHub API rate limit reached.' : `GitHub repository request failed (${response.status}).`);
      error.status = response.status === 404 ? 404 : 503;
      throw error;
    }
    return response;
  };
  const repoResponse = await requestGitHub(`/repos/${fullName}`);
  const repo = await repoResponse.json();
  const readmeResponse = await requestGitHub(`/repos/${fullName}/readme`, 'application/vnd.github.raw+json');
  const readme = await readmeResponse.text();
  let lastCommitAt = null;
  if (knownRateLimitRemaining === null || knownRateLimitRemaining > 0) {
    try {
      const commitsResponse = await requestGitHub(`/repos/${fullName}/commits?per_page=1`);
      const commits = await commitsResponse.json();
      lastCommitAt = commits[0]?.commit?.committer?.date || commits[0]?.commit?.author?.date || null;
    } catch {
      // Do not substitute repository push/update timestamps for a commit timestamp.
    }
  }
  const license = repo.license || {};
  const metadata = {
    fullName: repo.full_name,
    githubDescription: sanitizeText(repo.description, 300),
    language: sanitizeText(repo.language, 80),
    licenseName: sanitizeText(license.name, 120),
    licenseSpdxId: sanitizeText(license.spdx_id, 80),
    stars: Number.isInteger(repo.stargazers_count) ? repo.stargazers_count : null,
    forks: Number.isInteger(repo.forks_count) ? repo.forks_count : null,
    openIssues: Number.isInteger(repo.open_issues_count) ? repo.open_issues_count : null,
    archived: Boolean(repo.archived),
    defaultBranch: sanitizeText(repo.default_branch, 100),
    homepageUrl: sanitizeSafeUrl(repo.homepage),
    lastCommitAt,
    repositoryUpdatedAt: repo.updated_at || null,
    readmeExcerpt: readmeExcerpt(readme),
    fetchedAt: new Date().toISOString(),
  };
  return metadata;
}

function sanitizeSafeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const parsed = new URL(value);
    return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const fullName = url.searchParams.get('repo') || '';
  const forceRefresh = url.searchParams.get('refresh') === '1';
  if (!VERIFIED_REPOSITORIES.has(fullName)) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ error: 'Repository is not in the verified project allowlist.' });
  }
  res.setHeader('Cache-Control', forceRefresh ? 'no-store' : 'public, s-maxage=300, stale-while-revalidate=3600');
  const cached = cache.get(fullName);
  if (cached && !forceRefresh && Date.now() - cached.cachedAt < CACHE_TTL_MS) return sendCached(res, cached);
  if (cached && forceRefresh && Date.now() - (lastRefreshAt.get(fullName) || 0) < MIN_REFRESH_GAP_MS) return sendCached(res, cached);
  if (inFlight.has(fullName)) {
    try {
      const entry = await inFlight.get(fullName);
      return sendCached(res, entry);
    } catch (error) {
      if (cached) return sendCached(res, cached, true);
      return res.status(error.status || 503).json({ error: error.message || 'GitHub metadata is currently unavailable.' });
    }
  }

  lastRefreshAt.set(fullName, Date.now());
  const request = fetchRepositoryMetadata(fullName)
    .then((metadata) => {
      const entry = { metadata, fetchedAt: metadata.fetchedAt, cachedAt: Date.now() };
      cache.set(fullName, entry);
      return entry;
    })
    .finally(() => inFlight.delete(fullName));
  inFlight.set(fullName, request);
  try {
    return sendCached(res, await request);
  } catch (error) {
    if (cached) return sendCached(res, cached, true);
    return res.status(error.status || 503).json({ error: error.message || 'GitHub metadata is currently unavailable.' });
  }
}

export { sanitizeText, readmeExcerpt };
