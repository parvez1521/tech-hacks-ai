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

test('all ten existing AI categories use icon showcase bands and catalog-driven links/content', () => {
  const categories = [
    ['assistants', ['MessageSquare', 'Sparkles', 'Bot']],
    ['writing', ['PenLine', 'FileText', 'Type']],
    ['image', ['ImageIcon', 'Palette', 'Camera']],
    ['video', ['Clapperboard', 'Play', 'Scissors']],
    ['voice', ['Mic', 'Radio', 'Volume2']],
    ['music', ['Music', 'Headphones', 'Disc']],
    ['coding', ['Code2', 'Terminal', 'Braces']],
    ['productivity', ['Search', 'BookOpen', 'Compass']],
    ['automation', ['Workflow', 'Zap', 'Bot']],
    ["'3d'", ['Box', 'Shapes', 'PenTool']],
  ];
  const start = home.indexOf('const categoryArt');
  const end = home.indexOf('const resources', start);
  const mapping = home.slice(start, end);
  assert.equal((home.match(/aria-labelledby="categories-heading"/g) || []).length, 1);
  assert.match(home, /aiCategories\.map\(\(category\)/);
  assert.match(home, /category\.name/);
  assert.match(home, /category\.description/);
  assert.match(home, /category\.subcategories\.map/);
  assert.match(home, /to=\{`\/ai-tools\?category=\$\{encodeURIComponent\(category\.id\)\}`\}/);
  assert.match(home, /className="category-art" role="img" aria-label=\{art\.label\}/);
  assert.match(home, /art\.icons\.map\(\(Icon, i\)/);
  assert.ok(!mapping.includes('BrandLogo'), 'category bands use icons, not brand logos');
  assert.ok(!home.includes('/images/ai-categories/'), 'generated category artwork is gone');
  for (const [key, icons] of categories) {
    assert.ok(mapping.includes(`${key}: { icons: [`), `${key} has an icon band entry`);
    for (const icon of icons) {
      assert.ok(mapping.includes(icon), `${key} band uses the ${icon} icon`);
    }
  }
});
