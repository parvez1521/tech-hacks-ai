import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const home = fs.readFileSync(path.join(root, 'src/pages/HomePage.tsx'), 'utf8');
const image = (relativePath) => fs.readFileSync(path.join(root, 'public', relativePath));
const validateWebp = (relativePath) => {
  const bytes = image(relativePath);
  assert.equal(bytes.subarray(0, 4).toString(), 'RIFF', `${relativePath} begins with RIFF`);
  assert.equal(bytes.subarray(8, 12).toString(), 'WEBP', `${relativePath} has a WebP signature`);
};

test('homepage uses exactly the approved collection banner mapping and existing destinations', () => {
  const mappings = [
    ['/frontier-models', '/images/collections/frontier-models.webp'],
    ['/ai-video-tools', '/images/collections/free-ai-video-models.webp'],
    ['/ai-tools', '/images/collections/all-ai-tools.webp'],
    ['/github-projects', '/images/collections/github-projects.webp'],
  ];
  assert.equal((home.match(/Choose a collection/g) || []).length, 1);
  assert.equal((home.match(/image: '\/images\/collections\//g) || []).length, 4);
  for (const [route, asset] of mappings) {
    assert.ok(home.includes(`href: '${route}'`), `${route} remains the collection destination`);
    assert.ok(home.includes(`image: '${asset}'`), `${route} has its mapped banner`);
    validateWebp(asset);
  }
  assert.match(home, /samples\.map\(\(sample\)/);
  assert.match(home, /<BrandLogo slug=\{sample\.slug\}/);
});

test('frontier access images match the four catalog routes in the required display order', () => {
  const mappings = [
    ["'astra-rusherai'", '/images/frontier-access/01-gpt-6-astra-weekly-shared-pool.webp'],
    ["'opus-rusherai'", '/images/frontier-access/02-claude-opus-5-5-weekly-shared-pool.webp'],
    ["'astra-omnirush-daily'", '/images/frontier-access/03-gpt-6-astra-daily-allowance.webp'],
    ["'seedance-dreamina-daily'", '/images/frontier-access/04-seedance-2-5-daily-credits.webp'],
  ];
  const start = home.indexOf('const frontierAccessBanners');
  const end = home.indexOf('const frontierAccessRouteOrder', start);
  const mappingSource = home.slice(start, end);
  let prior = -1;
  for (const [index, [routeId, asset]] of mappings.entries()) {
    const current = mappingSource.indexOf(routeId);
    assert.ok(current > prior, `${routeId} appears in the specified order`);
    const next = mappings[index + 1] ? mappingSource.indexOf(mappings[index + 1][0]) : mappingSource.length;
    assert.ok(mappingSource.slice(current, next).includes(asset), `${routeId} uses ${asset}`);
    validateWebp(asset);
    prior = current;
  }
  assert.match(home, /route\.allowance/);
  assert.match(home, /route\.quickNote \|\| route\.conditions/);
  assert.match(home, /route\.lastVerifiedAt/);
  assert.match(home, /href=\{route\.claimUrl\}/);
  assert.match(home, /loading="lazy" decoding="async"/);
  assert.match(home, /object-cover/);
});

test('all ten existing AI categories keep their own banner and catalog-driven links/content', () => {
  const categories = [
    ['assistants', '01-ai-assistants-reasoning.webp'],
    ['writing', '02-writing-content.webp'],
    ['image', '03-image-generation.webp'],
    ['video', '04-video-generation-editing.webp'],
    ['voice', '05-audio-voice.webp'],
    ['music', '06-music.webp'],
    ['coding', '07-coding-development.webp'],
    ['productivity', '08-productivity-research.webp'],
    ['automation', '09-automation-agents.webp'],
    ["'3d'", '10-design-creativity.webp'],
  ];
  const start = home.indexOf('const categoryArtwork');
  const end = home.indexOf('const resources', start);
  const mapping = home.slice(start, end);
  assert.equal((home.match(/aria-labelledby="categories-heading"/g) || []).length, 1);
  assert.match(home, /aiCategories\.map\(\(category\)/);
  assert.match(home, /category\.name/);
  assert.match(home, /category\.description/);
  assert.match(home, /category\.subcategories\.map/);
  assert.match(home, /to=\{`\/ai-tools\?category=\$\{encodeURIComponent\(category\.id\)\}`\}/);
  assert.match(home, /alt=\{artwork\.alt\}/);
  assert.match(home, /width=\{495\} height=\{236\} loading="lazy"/);
  for (const [key, filename] of categories) {
    const asset = `/images/ai-categories/${filename}`;
    assert.ok(mapping.includes(`${key}: { src: '${asset}', alt: '`), `${key} maps to ${filename}`);
    validateWebp(asset);
  }
});
