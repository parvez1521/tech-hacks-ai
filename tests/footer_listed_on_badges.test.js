import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

describe('Footer — "Listed on" badges row', () => {
  let ssrModule;

  before(async () => {
    ssrModule = await import('../dist/test-ssr.js');
  });

  function setupMockBrowser(initialUrl = 'https://switchroute.in/') {
    const parsedUrl = new URL(initialUrl);
    const mockStorage = {};

    global.window = {
      location: {
        href: parsedUrl.toString(),
        origin: parsedUrl.origin,
        pathname: parsedUrl.pathname,
        search: parsedUrl.search,
      },
      history: {
        pushState: (state, title, url) => {
          const resolved = new URL(url, global.window.location.origin);
          global.window.location.pathname = resolved.pathname;
          global.window.location.search = resolved.search;
          global.window.location.href = resolved.toString();
        },
        replaceState: (state, title, url) => {
          const resolved = new URL(url, global.window.location.origin);
          global.window.location.pathname = resolved.pathname;
          global.window.location.search = resolved.search;
          global.window.location.href = resolved.toString();
        },
      },
      localStorage: {
        getItem: (k) => mockStorage[k] || null,
        setItem: (k, v) => { mockStorage[k] = String(v); },
        removeItem: (k) => { delete mockStorage[k]; },
      },
      dispatchEvent: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      scrollTo: () => {},
    };

    global.document = {
      title: '',
      querySelector: () => ({ setAttribute: () => {} }),
      querySelectorAll: () => [],
      documentElement: { classList: { toggle: () => {}, contains: () => false, add: () => {}, remove: () => {} } },
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  }

  function renderFooter() {
    setupMockBrowser();
    return ReactDOMServer.renderToStaticMarkup(
      React.createElement(ssrModule.RouterProvider, null, React.createElement(ssrModule.Footer)),
    );
  }

  test('renders a "Listed on" row with all three directory links', () => {
    const html = renderFooter();

    assert.ok(html.includes('Listed on'), 'Footer must label the directory row "Listed on"');
    assert.ok(html.includes('href="https://indielaunch.dev/?ref=badge"'), 'Footer must link to IndieLaunch');
    assert.ok(html.includes('href="https://fazier.com"'), 'Footer must link to Fazier');
    assert.ok(html.includes('href="https://1ai.tools"'), 'Footer must link to 1ai.tools');
  });

  test('IndieLaunch badge uses the supplied snippet verbatim', () => {
    const html = renderFooter();

    assert.ok(
      html.includes('src="https://indielaunch.dev/badges/indielaunch-light.svg"'),
      'IndieLaunch badge image src must be the supplied SVG',
    );
    assert.ok(html.includes('alt="Featured on IndieLaunch"'), 'IndieLaunch badge must keep its alt text');
  });

  test('Fazier badge uses the supplied snippet verbatim', () => {
    const html = renderFooter();

    assert.ok(
      html.includes('src="https://fazier.com/api/v1/public/badges/launch_badges.svg?badge_type=featured&amp;theme=neutral"'),
      'Fazier badge image src must be the supplied SVG (ampersand is HTML-escaped in SSR output)',
    );
    assert.ok(html.includes('alt="Featured on Fazier"'), 'Fazier badge must keep its alt text');
  });

  test('1ai.tools link is a plain dofollow link (no rel=nofollow)', () => {
    const html = renderFooter();
    const match = html.match(/<a[^>]*href="https:\/\/1ai\.tools"[^>]*>/);

    assert.ok(match, 'Footer must contain an anchor to https://1ai.tools');
    assert.ok(!/nofollow/i.test(match[0]), '1ai.tools link must NOT carry rel=nofollow (dofollow is the requirement)');
    assert.ok(match[0].includes('target="_blank"'), '1ai.tools link must open in a new tab');
    assert.ok(match[0].includes('rel="noopener"'), '1ai.tools link must carry rel=noopener');
    assert.ok(html.includes('>1ai.tools</a>'), '1ai.tools link text must be the plain directory name');
  });

  test('badge links open in a new tab with rel=noopener', () => {
    const html = renderFooter();

    for (const href of ['https://indielaunch.dev/?ref=badge', 'https://fazier.com']) {
      const match = html.match(new RegExp(`<a[^>]*href="${href.replace(/[.?]/g, (c) => `\\${c}`)}"[^>]*>`));
      assert.ok(match, `Footer must contain an anchor to ${href}`);
      assert.ok(match[0].includes('target="_blank"'), `${href} must open in a new tab`);
      assert.ok(match[0].includes('rel="noopener"'), `${href} must carry rel=noopener`);
    }
  });

  test('existing footer content is untouched: legal links, copyright, discovery callout', () => {
    const html = renderFooter();

    for (const href of ['/about', '/contact', '/privacy', '/terms', '/disclosure']) {
      assert.ok(html.includes(`href="${href}"`), `Footer must still link to ${href}`);
    }
    assert.ok(html.includes('SwitchRoute. Built with open web standards.'), 'Footer copyright line must remain');
    assert.ok(html.includes('Find your next useful tool'), 'Footer discovery callout must remain');
  });
});
