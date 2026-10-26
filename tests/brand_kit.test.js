import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(new URL(file, import.meta.url), 'utf8');

test('public Brand Kit page documents the existing SwitchRoute identity and is routable', async () => {
  const page = await read('../src/pages/BrandKitPage.tsx');
  const app = await read('../src/App.tsx');
  const router = await read('../src/router/Router.tsx');
  const footer = await read('../src/components/Footer.tsx');
  const sitemap = await read('../public/sitemap.xml');

  assert.match(page, /Brand Kit/);
  assert.match(page, /TechHacksLogo/);
  assert.match(page, /Route Blue/);
  assert.match(page, /Route Cyan/);
  assert.match(page, /Route Violet/);
  assert.match(page, /Typography/);
  assert.match(page, /Accessibility/);
  assert.match(page, /brand-kit\.json/);
  assert.match(app, /case 'brand-kit':\s+return formatPageTitle\('SwitchRoute Brand Kit: Logo, Colours & Typography'\)/);
  assert.match(app, /case 'brand-kit':\s+return <BrandKitPage \/>/);
  assert.match(router, /cleanPath === '\/brand-kit'[\s\S]*route: 'brand-kit'/);
  assert.match(footer, /to="\/brand-kit"[\s\S]*Brand Kit/);
  assert.match(sitemap, /<loc>https:\/\/switchroute\.in\/brand-kit<\/loc>/);
});

test('brand tokens are shared between CSS, Tailwind, logo assets, and downloadable JSON', async () => {
  const css = await read('../src/index.css');
  const tailwind = await read('../tailwind.config.js');
  const logo = await read('../src/components/TechHacksLogo.tsx');
  const favicon = await read('../public/favicon.svg');
  const socialCard = await read('../public/social-card.svg');
  const tokens = JSON.parse(await read('../public/brand-kit.json'));

  for (const token of ['--brand-midnight', '--brand-navy', '--brand-blue', '--brand-cyan', '--brand-violet', '--brand-light-bg']) {
    assert.ok(css.includes(token), `CSS must define ${token}`);
  }
  for (const color of ['midnight:', 'navy:', 'blue:', 'cyan:', 'violet:', "'light-bg':"]) {
    assert.ok(tailwind.includes(color), `Tailwind must expose ${color}`);
  }
  assert.match(logo, /from-brand-cyan via-brand-blue to-brand-violet/);
  assert.match(favicon, /#22D3EE/);
  assert.match(favicon, /#60A5FA/);
  assert.match(favicon, /#8B5CF6/);
  assert.match(socialCard, /#8B5CF6/);
  assert.equal(tokens.name, 'SwitchRoute');
  assert.equal(tokens.colors.routeBlue.hex, '#60A5FA');
  assert.equal(tokens.colors.routeCyan.hex, '#22D3EE');
  assert.equal(tokens.colors.routeViolet.hex, '#8B5CF6');
});
