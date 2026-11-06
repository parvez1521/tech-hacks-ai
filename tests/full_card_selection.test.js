import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const read = (relative) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('Full-card click & touch selection', () => {
  test('Pick wizard steps 1-3 use real radio inputs inside their labels, not label onClick', () => {
    const page = read('src/pages/PickPage.tsx');
    assert.ok(!/<label[^>]*onClick/.test(page), 'No PickPage label may carry its own onClick (duplicate/dead semantics)');
    for (const name of ['pick-goal', 'pick-task', 'pick-budget']) {
      assert.ok(page.includes(`type="radio"`), 'Pick options must be native radio inputs');
      assert.ok(page.includes(`name="${name}"`), `${name} radio group must exist`);
    }
    assert.ok(page.includes('checked={goal === g.id}') && page.includes('onChange={() => handleGoalSelect(g.id)}'), 'Goal radios keep the original selection logic');
    assert.ok(page.includes('checked={taskDetail === opt.id}') && page.includes('onChange={() => setTaskDetail(opt.id)}'), 'Task radios keep the original selection logic');
    assert.ok(page.includes('checked={budget === b.id}') && page.includes("onChange={() => setBudget(b.id as PickCriteria['budget'])}"), 'Budget radios keep the original selection logic');
    assert.equal((page.match(/role="radiogroup"/g) || []).length, 3, 'Each Pick step list is a labelled radiogroup');
    assert.equal((page.match(/has-\[:focus-visible\]:\[outline:2px_solid/g) || []).length, 3, 'Each Pick card mirrors the site focus outline (primary token) while its radio is keyboard-focused — a blue ring would be invisible against the blue selected state');
  });

  test('Pick wizard step 4 option buttons expose their pressed state', () => {
    const page = read('src/pages/PickPage.tsx');
    assert.ok(page.includes('aria-pressed={hostingPreference === h.id}'), 'Hosting options need aria-pressed');
    assert.ok(page.includes('aria-pressed={watermarkPreference === w.id}'), 'Watermark options need aria-pressed');
  });

  test('Cookie preference rows are one full-row label per toggle (no nested labels)', () => {
    const banner = read('src/components/CookieConsentBanner.tsx');
    assert.equal((banner.match(/<label/g) || []).length, 2, 'Exactly the two toggle rows are labels; nesting a label inside a label is invalid');
    for (const id of ['cookie-consent-analytics', 'cookie-consent-advertising']) {
      assert.ok(banner.includes(`htmlFor="${id}"`), `Row label must target ${id}`);
      assert.ok(banner.includes(`id="${id}"`), `Toggle input ${id} must exist`);
    }
    assert.ok(banner.includes('checked={analytics}') && banner.includes('setAnalytics(e.target.checked)'), 'Analytics toggle logic unchanged');
    assert.ok(banner.includes('checked={advertising}') && banner.includes('setAdvertising(e.target.checked)'), 'Advertising toggle logic unchanged');
  });

  test('Admin discoveries metric cards and filter chips are buttons with aria-pressed', () => {
    const admin = read('src/components/AdminDiscoveriesManager.tsx');
    assert.ok(!/<div\s+onClick=\{\(\) => setStatusFilter/.test(admin), 'Metric filter cards must not be clickable divs');
    assert.ok(admin.includes("aria-pressed={statusFilter === 'all'}"), 'All-status card/chip needs aria-pressed');
    assert.ok(admin.includes("aria-pressed={statusFilter === 'published'}"), 'Published card/chip needs aria-pressed');
    assert.ok(admin.includes("aria-pressed={statusFilter === 'draft'}"), 'Draft card/chip needs aria-pressed');
  });

  test('Moderation metrics and submission rows are buttons with aria-pressed', () => {
    const mod = read('src/pages/ModerationDashboardPage.tsx');
    assert.ok(!/<div\s+onClick=\{\(\) => setFilterStatus/.test(mod), 'Metric filter cards must not be clickable divs');
    assert.ok(!/<div\s+onClick=\{\(\) => setSelectedSubmission/.test(mod), 'Submission rows must not be clickable divs');
    for (const key of ['all', 'pending', 'in_review', 'published', 'rejected']) {
      assert.ok(mod.includes(`aria-pressed={filterStatus === '${key}'}`), `${key} metric needs aria-pressed`);
    }
    assert.ok(mod.includes('aria-pressed={isSelected}'), 'Submission rows need aria-pressed');
    assert.ok(mod.includes('onClick={() => setSelectedSubmission(sub)}'), 'Submission selection logic unchanged');
  });

  test('Verification network cards expose their pressed state', () => {
    const network = read('src/components/IntelligenceVerificationNetwork.tsx');
    assert.ok(network.includes('aria-pressed={isActive}'), 'Active node card needs aria-pressed');
  });

  test('homepage Frontier Access cards are fully clickable through their Try route link (stretched link)', () => {
    const home = read('src/pages/HomePage.tsx');
    assert.ok(home.includes('frontier-access-card group relative'), 'Frontier card must be the positioned ancestor for its stretched link');
    assert.ok(home.includes("after:absolute after:inset-0 after:content-['']"), 'The Try route link must stretch over the whole card');
    assert.ok(home.includes('has-[:focus-visible]:[outline:2px_solid'), 'Keyboard focus on the stretched link must outline the whole card, not just the link text');
    assert.ok(home.includes('href={route.claimUrl} target="_blank" rel="noreferrer"'), 'The card keeps the original route URL, new-tab behaviour and rel');
  });

  test('no clickable divs remain anywhere in src (allowlist: decorative AiOrb3D only)', () => {
    const offenders = [];
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith('.tsx')) {
          const source = fs.readFileSync(full, 'utf8');
          if (/<div[^>]{0,900}?onClick/s.test(source)) offenders.push(path.relative(process.cwd(), full));
        }
      }
    };
    walk(path.resolve(process.cwd(), 'src'));
    assert.deepEqual(offenders, ['src/components/AiOrb3D.tsx'], 'Only the decorative chat orb may keep a div onClick; selectable cards must be buttons, labels or inputs');
  });
});
