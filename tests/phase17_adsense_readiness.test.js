import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import { siteConfig } from '../src/config/siteConfig.ts';

describe('Phase 17: Google AdSense Readiness & Regulatory Compliance Audit', () => {
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

  function renderClean(element) {
    return ReactDOMServer.renderToStaticMarkup(element);
  }

  function renderWithRouter(element, initialUrl = 'https://switchroute.in/') {
    setupMockBrowser(initialUrl);
    return ReactDOMServer.renderToStaticMarkup(
      React.createElement(ssrModule.RouterProvider, null, element)
    );
  }

  describe('1. Legal & Regulatory Compliance Pages Existence & Structure', () => {
    test('AboutPage renders mission, editorial independence, and 4 pillars', () => {
      const html = renderWithRouter(React.createElement(ssrModule.AboutPage));
      assert.ok(html.includes('About SwitchRoute'), 'Must render about title');
      assert.ok(html.includes('Editorial Independence'), 'Must explain editorial policy');
      assert.ok(html.includes('Zero Paid Rankings'), 'Must disclose zero pay-for-ranking policy');
      assert.ok(html.includes('href="/contact"'), 'Must link to contact page');
      assert.ok(html.includes('Pricing & Access Notes'), 'Must list core pillar');
      assert.ok(html.includes('Open-Source First'), 'Must list OSS pillar');
    });

    test('ContactPage checks secure message intake before exposing the form', () => {
      const html = renderWithRouter(React.createElement(ssrModule.ContactPage));
      assert.ok(html.includes('Contact SwitchRoute'), 'Must render contact title');
      assert.ok(html.includes('Checking secure message intake'), 'Must check server readiness before showing the form');
      assert.ok(!html.includes('contact@techhacksai.com'), 'Must not publish inactive email');
      assert.ok(!html.includes('Send message'), 'Must not render the form until intake is ready');
    });

    test('PrivacyPage contains all mandatory Google AdSense & DoubleClick disclosures', () => {
      const html = renderWithRouter(React.createElement(ssrModule.PrivacyPage));
      assert.ok(html.includes('Privacy Policy'), 'Must render privacy title');
      assert.ok(html.includes('Google Advertising Cookies'), 'Must explicitly disclose Google advertising cookies');
      assert.ok(html.includes('DoubleClick'), 'Must disclose DoubleClick cookies');
      assert.ok(html.includes('https://adssettings.google.com/'), 'Must provide link to Google Ads Settings');
      assert.ok(html.includes('https://optout.aboutads.info/'), 'Must provide link to Digital Advertising Alliance');
      assert.ok(html.includes('https://optout.networkadvertising.org/'), 'Must provide link to Network Advertising Initiative');
      assert.ok(html.includes('https://www.youronlinechoices.eu/'), 'Must provide link to EDAA European opt-out');
      assert.ok(html.includes('Consent Management Platform') || html.includes('CMP'), 'Must disclose CMP mechanism');
      assert.ok(html.includes('General Data Protection Regulation'), 'Must disclose GDPR rights');
      assert.ok(html.includes('California Privacy Rights'), 'Must disclose CCPA/CPRA rights');
      assert.ok(html.includes('COPPA') || html.includes('Children'), 'Must disclose COPPA compliance');
    });

    test('TermsPage renders conditions, educational purpose, and intellectual property terms', () => {
      const html = renderWithRouter(React.createElement(ssrModule.TermsPage));
      assert.ok(html.includes('Terms of Use'), 'Must render terms title');
      assert.ok(html.includes('Informational &amp; Educational Purpose') || html.includes('Informational'), 'Must declare informational purpose');
      assert.ok(html.includes('Nominative Fair Use'), 'Must clarify nominative fair use');
      assert.ok(html.includes('Limitation of Liability'), 'Must state liability limitations');
    });

    test('DisclosurePage provides transparent affiliate and advertising disclosures', () => {
      const html = renderWithRouter(React.createElement(ssrModule.DisclosurePage));
      assert.ok(html.includes('Affiliate &amp; Advertising Disclosure') || html.includes('Affiliate & Advertising Disclosure'), 'Must render disclosure title');
      assert.ok(html.includes('FTC') && html.includes('16 CFR'), 'Must reference FTC guidance');
      assert.ok(html.includes('Google AdSense'), 'Must explain display ad policy');
      assert.ok(html.includes('Editorial Independence Guarantee'), 'Must guarantee editorial independence');
    });
  });

  describe('2. Site-Wide Footer Links & Cookie Preferences Access', () => {
    test('Footer renders all 5 legal and compliance links in column and strip', () => {
      const html = renderWithRouter(React.createElement(ssrModule.Footer));

      assert.ok(html.includes('href="/about"'), 'Footer must contain link to /about');
      assert.ok(html.includes('href="/contact"'), 'Footer must contain link to /contact');
      assert.ok(html.includes('href="/privacy"'), 'Footer must contain link to /privacy');
      assert.ok(html.includes('href="/terms"'), 'Footer must contain link to /terms');
      assert.ok(html.includes('href="/disclosure"'), 'Footer must contain link to /disclosure');
      assert.ok(html.includes('Cookie Preferences'), 'Footer must provide Cookie Preferences control');
    });

    test('siteConfig defines navigation.legal with all 5 required entries', () => {
      assert.ok(Array.isArray(siteConfig.navigation.legal), 'navigation.legal must be an array');
      const hrefs = siteConfig.navigation.legal.map(item => item.href);
      assert.ok(hrefs.includes('/about'), 'Must include /about');
      assert.ok(hrefs.includes('/contact'), 'Must include /contact');
      assert.ok(hrefs.includes('/privacy'), 'Must include /privacy');
      assert.ok(hrefs.includes('/terms'), 'Must include /terms');
      assert.ok(hrefs.includes('/disclosure'), 'Must include /disclosure');
    });
  });

  describe('3. AdSense Configuration & Pre-Approval Safety', () => {
    test('siteConfig.adsense is disabled by default before account verification', () => {
      assert.strictEqual(siteConfig.adsense.enabled, false, 'AdSense must remain disabled prior to review');
      assert.strictEqual(siteConfig.adsense.autoAds, false, 'Auto-ads must be false');
      assert.strictEqual(siteConfig.adsense.publisherId, '', 'Publisher ID must not be a fake dummy string');
    });

    test('AdSenseBanner does not emit ads or scripts when disabled', () => {
      const html = renderClean(React.createElement(ssrModule.AdSenseBanner, { slot: '1234567890' }));
      assert.strictEqual(html, '', 'AdSenseBanner must render nothing in production when disabled');
    });

    test('AdSenseBanner displays compliant advertisement badge in preview mode', () => {
      const html = renderClean(React.createElement(ssrModule.AdSenseBanner, { slot: '1234567890', format: 'horizontal', showPreviewPlaceholder: true }));
      assert.ok(html.includes('Advertisement'), 'AdSenseBanner must display compliant "Advertisement" label');
      assert.ok(html.includes('Google AdSense Placement Slot'), 'Preview must show placement placeholder');
      assert.ok(html.includes('Dormant — Awaiting Google AdSense account verification'), 'Preview must show dormancy note');
    });
  });

  describe('4. Cookie Consent & GDPR/CMP Readiness', () => {
    test('CookieConsentBanner renders essential vs non-essential options', () => {
      const html = renderWithRouter(React.createElement(ssrModule.CookieConsentBanner));
      assert.ok(html.includes('Cookie &amp; Privacy Notice') || html.includes('Cookie & Privacy Notice'), 'Banner heading');
      assert.ok(html.includes('Accept All'), 'Must have Accept All button');
      assert.ok(html.includes('Essential Only'), 'Must have Essential Only button');
      assert.ok(html.includes('Customize'), 'Must have Customize button');
    });
  });

  describe('5. Client Router & Legal Route Resolution', () => {
    test('Router resolves primary and alias URLs for all legal pages', () => {
      assert.strictEqual(ssrModule.matchRoute('/about')?.route, 'about');
      assert.strictEqual(ssrModule.matchRoute('/about-us')?.route, 'about');
      assert.strictEqual(ssrModule.matchRoute('/contact')?.route, 'contact');
      assert.strictEqual(ssrModule.matchRoute('/contact-us')?.route, 'contact');
      assert.strictEqual(ssrModule.matchRoute('/privacy')?.route, 'privacy');
      assert.strictEqual(ssrModule.matchRoute('/privacy-policy')?.route, 'privacy');
      assert.strictEqual(ssrModule.matchRoute('/terms')?.route, 'terms');
      assert.strictEqual(ssrModule.matchRoute('/terms-of-use')?.route, 'terms');
      assert.strictEqual(ssrModule.matchRoute('/terms-of-service')?.route, 'terms');
      assert.strictEqual(ssrModule.matchRoute('/disclosure')?.route, 'disclosure');
      assert.strictEqual(ssrModule.matchRoute('/affiliate-disclosure')?.route, 'disclosure');
    });

    test('getRouteTitle produces clear, branded titles for legal pages', () => {
      const aboutTitle = ssrModule.getRouteTitle('about');
      assert.ok(aboutTitle.includes('About Us') && aboutTitle.includes('SwitchRoute'));

      const contactTitle = ssrModule.getRouteTitle('contact');
      assert.ok(contactTitle.includes('Contact Us') && contactTitle.includes('SwitchRoute'));

      const privacyTitle = ssrModule.getRouteTitle('privacy');
      assert.ok(privacyTitle.includes('Privacy Policy') && privacyTitle.includes('SwitchRoute'));

      const termsTitle = ssrModule.getRouteTitle('terms');
      assert.ok(termsTitle.includes('Terms of Use') && termsTitle.includes('SwitchRoute'));

      const disclosureTitle = ssrModule.getRouteTitle('disclosure');
      assert.ok(disclosureTitle.includes('Affiliate & Advertising Disclosure') && disclosureTitle.includes('SwitchRoute'));
    });

    test('getRouteDescription produces informative meta descriptions for legal pages', () => {
      assert.ok(ssrModule.getRouteDescription('about').length > 50, 'About meta description should be substantial');
      assert.ok(ssrModule.getRouteDescription('contact').length > 50, 'Contact meta description should be substantial');
      assert.ok(ssrModule.getRouteDescription('privacy').includes('Google AdSense') || ssrModule.getRouteDescription('privacy').includes('cookies'), 'Privacy meta description must mention privacy/cookies');
      assert.ok(ssrModule.getRouteDescription('terms').length > 50, 'Terms meta description should be substantial');
      assert.ok(ssrModule.getRouteDescription('disclosure').includes('affiliate') || ssrModule.getRouteDescription('disclosure').includes('advertising'), 'Disclosure meta description must mention affiliate/ads');
    });

    test('App renders full pages without errors on legal routes in SSR', () => {
      const legalPaths = ['/about', '/contact', '/privacy', '/terms', '/disclosure'];
      for (const pathname of legalPaths) {
        setupMockBrowser(`https://switchroute.in${pathname}`);
        const html = renderClean(React.createElement(ssrModule.App));
        assert.ok(html.length > 500, `Page at ${pathname} must render substantive content`);
        assert.ok(html.includes('SwitchRoute'), `Page at ${pathname} must render header with brand`);
        assert.ok(html.includes('href="/privacy"'), `Page at ${pathname} must include footer links`);
      }
    });
  });

  describe('6. Sitemap & Robots Audit for AdSense Crawler Access', () => {
    test('sitemap.xml includes all 5 legal page URLs with correct canonical domain', () => {
      const sitemapPath = path.resolve('public/sitemap.xml');
      const content = fs.readFileSync(sitemapPath, 'utf8');

      assert.ok(content.includes('<loc>https://switchroute.in/about</loc>'), 'Sitemap must contain /about');
      assert.ok(content.includes('<loc>https://switchroute.in/contact</loc>'), 'Sitemap must contain /contact');
      assert.ok(content.includes('<loc>https://switchroute.in/privacy</loc>'), 'Sitemap must contain /privacy');
      assert.ok(content.includes('<loc>https://switchroute.in/terms</loc>'), 'Sitemap must contain /terms');
      assert.ok(content.includes('<loc>https://switchroute.in/disclosure</loc>'), 'Sitemap must contain /disclosure');
    });

    test('robots.txt allows Google crawlers to index legal and public pages', () => {
      const robotsPath = path.resolve('public/robots.txt');
      const content = fs.readFileSync(robotsPath, 'utf8');

      assert.ok(content.includes('User-agent: *'), 'Must target all user agents');
      assert.ok(content.includes('Allow: /'), 'Must allow root access');
      assert.ok(content.includes('Sitemap: https://switchroute.in/sitemap.xml'), 'Must declare sitemap location');
    });
  });
});
