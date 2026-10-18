import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { proprietaryTools } from '../src/data/alternatives.ts';
import { toolsData } from '../src/data/seedData.ts';
import { aiToolsData } from '../src/data/aiToolsData.ts';
import { getToolsForProprietary, getProprietaryToolBySlug } from '../src/services/catalogService.ts';
import { offersData, getOfferBySlug, getFeaturedOffers, getOffersByType } from '../src/data/offersData.ts';
import { generateGroundedResponse } from '../src/services/chatRetrievalService.ts';

describe('Phase 12: Alternative Navigation, Claude Code/Perplexity Alts, OmniRush Reclassification & AI Offers', () => {

  // ===========================================================================
  // 1. Priority 1: Alternatives Navigation Fix Verification
  // ===========================================================================
  describe('Priority 1: Alternatives Navigation & Card Integrity', () => {
    const cardFilePath = path.resolve('src/components/AlternativeCard.tsx');
    const cardContent = fs.readFileSync(cardFilePath, 'utf-8');

    test('AlternativeCard contains explicit semantic Link for Explore button', () => {
      assert.ok(
        cardContent.includes("<Link") && cardContent.includes("to={`/alternatives/${alternative.slug}`}"),
        'AlternativeCard must contain an explicit Link component pointing to /alternatives/:slug'
      );
      assert.ok(
        cardContent.includes("Explore") && cardContent.includes("pointer-events-auto"),
        'Explore link must be interactive with pointer-events-auto'
      );
    });

    test('AlternativeCard contains full-card stretch link without event blocking', () => {
      assert.ok(
        cardContent.includes('absolute inset-0 z-10 rounded-lg focus:outline-none'),
        'AlternativeCard must provide a full-card absolute stretch link'
      );
      assert.ok(
        cardContent.includes('pointer-events-none'),
        'Non-interactive card body wrapper must have pointer-events-none so whole-card clicks cleanly reach the stretch link'
      );
    });

    test('AlternativeCard allows clicking individual alternative tools without navigating to parent card', () => {
      assert.ok(
        cardContent.includes("to={`/tools/${tool.slug}`}"),
        'Replacement tool pills must link to individual tool detail pages (/tools/:slug)'
      );
      assert.ok(
        cardContent.includes("pointer-events-auto") && cardContent.includes("relative z-20"),
        'Interactive pills must have pointer-events-auto and sit above the stretch link'
      );
    });
  });

  // ===========================================================================
  // 2. Priority 2: OmniRush Classification Integrity
  // ===========================================================================
  describe('Priority 2: OmniRush Classification Integrity', () => {
    const omnirush = aiToolsData.find((t) => t.id === 'omnirush');

    test('OmniRush exists in aiToolsData catalog', () => {
      assert.ok(omnirush, 'OmniRush must exist in aiToolsData');
    });

    test('OmniRush is strictly classified as Free (never Freemium or Trial)', () => {
      assert.strictEqual(
        omnirush?.pricingType,
        'free',
        'OmniRush pricingType must be strictly "free", not "freemium" or "free-trial"'
      );
      assert.strictEqual(
        omnirush?.freeAccessType,
        'recurring-free',
        'OmniRush freeAccessType must be "recurring-free"'
      );
      assert.notStrictEqual(
        omnirush?.pricingType,
        'freemium',
        'OmniRush must NOT be marked as freemium'
      );
    });

    test('OmniRush requires desktop or CLI installation', () => {
      assert.strictEqual(
        omnirush?.requiresInstallation,
        true,
        'OmniRush must have requiresInstallation: true'
      );
      assert.ok(
        omnirush?.tags?.includes('desktop') || omnirush?.tags?.includes('cli'),
        'OmniRush tags must indicate desktop or cli'
      );
    });

    test('OmniRush descriptions clearly delineate community free access vs optional BYOK', () => {
      const fullText = `${omnirush?.description} ${omnirush?.longDescription} ${omnirush?.features.join(' ')}`;
      assert.ok(
        fullText.toLowerCase().includes('byok') || fullText.toLowerCase().includes('bring your own key'),
        'OmniRush description or features must mention optional BYOK'
      );
      assert.ok(
        fullText.toLowerCase().includes('community') || fullText.toLowerCase().includes('card'),
        'OmniRush must mention community model routing without credit cards'
      );
    });
  });

  // ===========================================================================
  // 3. Priority 3: Claude Code and Perplexity Alternatives
  // ===========================================================================
  describe('Priority 3: Claude Code & Perplexity Alternatives Mapping', () => {
    test('Claude Code is registered in proprietaryTools', () => {
      const claudeCode = getProprietaryToolBySlug('claude-code');
      assert.ok(claudeCode, 'claude-code must exist in proprietaryTools');
      assert.strictEqual(claudeCode?.name, 'Claude Code');
      assert.strictEqual(claudeCode?.category, 'developer-tools');
    });

    test('Perplexity is registered in proprietaryTools', () => {
      const perplexity = getProprietaryToolBySlug('perplexity');
      assert.ok(perplexity, 'perplexity must exist in proprietaryTools');
      assert.strictEqual(perplexity?.name, 'Perplexity AI');
      assert.strictEqual(perplexity?.category, 'productivity');
    });

    test('Claude Code has verified open-source alternatives mapped', () => {
      const alts = getToolsForProprietary('claude-code');
      assert.ok(alts.length >= 4, `Expected at least 4 Claude Code alternatives, found ${alts.length}`);

      const slugs = alts.map((t) => t.slug);
      assert.ok(slugs.includes('aider'), 'Claude Code alts must include Aider');
      assert.ok(slugs.includes('cline'), 'Claude Code alts must include Cline');
      assert.ok(slugs.includes('roocode'), 'Claude Code alts must include Roo Code');
      assert.ok(slugs.includes('opencode'), 'Claude Code alts must include OpenCode');

      alts.forEach((tool) => {
        assert.ok(tool.stars > 0, `${tool.name} must have positive stars`);
        assert.ok(tool.isSelfHostable, `${tool.name} must be self-hostable/local`);
        assert.ok(['Apache-2.0', 'MIT', 'GPL-3.0'].includes(tool.license), `${tool.name} has valid OSI license`);
      });
    });

    test('Perplexity has verified open-source alternatives mapped', () => {
      const alts = getToolsForProprietary('perplexity');
      assert.ok(alts.length >= 3, `Expected at least 3 Perplexity alternatives, found ${alts.length}`);

      const slugs = alts.map((t) => t.slug);
      assert.ok(slugs.includes('perplexica'), 'Perplexity alts must include Perplexica');
      assert.ok(slugs.includes('khoj'), 'Perplexity alts must include Khoj');
      assert.ok(slugs.includes('searxng'), 'Perplexity alts must include SearXNG');

      alts.forEach((tool) => {
        assert.ok(tool.stars >= 5000, `${tool.name} must have significant GitHub stars`);
        assert.ok(tool.isSelfHostable, `${tool.name} must be self-hostable`);
      });
    });

    test('Official brand SVG logos exist on disk for new tools', () => {
      const expectedLogos = [
        'claude-code.svg',
        'cline.svg',
        'roocode.svg',
        'opencode.svg',
        'perplexica.svg',
        'khoj.svg',
        'searxng.svg',
        'gemini-cli.svg',
      ];

      expectedLogos.forEach((logoFile) => {
        const fullPath = path.resolve('public/logos', logoFile);
        assert.ok(fs.existsSync(fullPath), `SVG logo must exist at public/logos/${logoFile}`);
        const content = fs.readFileSync(fullPath, 'utf-8');
        assert.ok(content.includes('<svg') && content.includes('</svg>'), `${logoFile} must contain valid SVG XML`);
      });
    });
  });

  // ===========================================================================
  // 4. Priority 4: AI Offers, Deals & Student Benefits
  // ===========================================================================
  describe('Priority 4: AI Offers Directory & Verification', () => {
    test('Catalog contains at least 8 verified offers', () => {
      assert.ok(offersData.length >= 8, `Expected at least 8 offers, found ${offersData.length}`);
    });

    test('Reliance Jio + Google Gemini 18-month offer is complete and accurate', () => {
      const jioOffer = getOfferBySlug('jio-google-gemini-offer');
      assert.ok(jioOffer, 'Jio offer must exist');
      assert.strictEqual(jioOffer?.region, 'India');
      assert.strictEqual(jioOffer?.offerType, 'telecom-bundle');
      assert.ok(jioOffer?.benefitSummary.includes('18 Months'), 'Must specify 18 Months');
      assert.ok(jioOffer?.benefitSummary.includes('Google One AI Premium'), 'Must specify Google One AI Premium');
      assert.ok(jioOffer?.eligibility.includes('349'), 'Must specify ₹349+ recharge eligibility');
      assert.ok(jioOffer?.renewalTerms.includes('recharge'), 'Must state dependence on active 5G recharge');
      assert.ok(jioOffer?.claimSteps.length >= 4, 'Must have detailed step-by-step claim instructions');
    });

    test('Student AI programs are indexed with student verification requirements', () => {
      const studentOffers = getOffersByType('student-plan');
      assert.ok(studentOffers.length >= 2, 'Must have at least 2 student plans');

      const copilot = getOfferBySlug('github-student-pack-copilot');
      assert.ok(copilot, 'GitHub Student Pack offer must exist');
      assert.strictEqual(copilot?.requiresStudentVerification, true);
      assert.ok(copilot?.benefitSummary.includes('Copilot'));

      const perplexityEdu = getOfferBySlug('perplexity-education-pro');
      assert.ok(perplexityEdu, 'Perplexity Education Pro offer must exist');
      assert.strictEqual(perplexityEdu?.requiresStudentVerification, true);
    });

    test('Startup cloud credit offers are indexed with realistic terms', () => {
      const startupOffers = getOffersByType('startup-credits');
      assert.ok(startupOffers.length >= 2, 'Must have at least 2 startup cloud credit programs');
      const aws = getOfferBySlug('aws-activate-ai-startups');
      assert.ok(aws, 'AWS Activate offer must exist');
      const ms = getOfferBySlug('microsoft-founders-hub-credits');
      assert.ok(ms, 'Microsoft Founders Hub offer must exist');
    });

    test('getFeaturedOffers returns active featured offers', () => {
      const featured = getFeaturedOffers();
      assert.ok(featured.length >= 3, 'Must return at least 3 featured offers for homepage display');
      featured.forEach((f) => assert.strictEqual(f.isFeatured, true));
    });
  });

  // ===========================================================================
  // 5. Priority 5: Chatbot Grounded Answers for Deals, Alts & Pricing
  // ===========================================================================
  describe('Priority 5: Chatbot Grounded Retrieval Intelligence', () => {
    test('Chatbot answers Jio Google Gemini queries with grounded details', () => {
      const res = generateGroundedResponse('How can I get the Jio Google Gemini 18 months offer?');
      assert.ok(res.text.includes('18 months') || res.text.includes('18 Months'), 'Must mention 18 months duration');
      assert.ok(res.text.includes('Gemini Advanced'), 'Must mention Gemini Advanced');
      assert.ok(res.text.includes('349'), 'Must mention ₹349 eligibility');
      assert.ok(res.text.includes('MyJio'), 'Must mention MyJio app claim path');
      assert.ok(res.text.includes('/offers/jio-google-gemini-offer'), 'Must link to dedicated deal page');
    });

    test('Chatbot answers student AI plan queries with verified student programs', () => {
      const res = generateGroundedResponse('Are there any free AI plans or discounts for college students?');
      assert.ok(res.text.includes('GitHub Student Developer Pack'), 'Must include GitHub pack');
      assert.ok(res.text.includes('Copilot'), 'Must mention GitHub Copilot');
      assert.ok(res.text.includes('Perplexity'), 'Must mention Perplexity Education');
      assert.ok(res.text.includes('/offers'), 'Must link to /offers');
    });

    test('Chatbot answers coupon/promo code queries honestly without fake codes', () => {
      const res = generateGroundedResponse('Do you have coupon codes or discount vouchers for AI tools?');
      assert.ok(
        res.text.includes('No Fake Codes') || res.text.includes('never list expired or fabricated'),
        'Must maintain honesty regarding promo codes'
      );
      assert.ok(res.text.includes('/offers'), 'Must point to verified offers directory');
    });

    test('Chatbot recommends Aider, Cline, and Roo Code for Claude Code alternative queries', () => {
      const res = generateGroundedResponse('What are the best open source alternatives to Claude Code?');
      assert.ok(res.text.includes('Aider'), 'Must mention Aider');
      assert.ok(res.text.includes('Cline'), 'Must mention Cline');
      assert.ok(res.text.includes('Roo Code') || res.text.includes('RooCode'), 'Must mention Roo Code');
      assert.ok(res.text.includes('/alternatives/claude-code'), 'Must link to /alternatives/claude-code');
    });

    test('Chatbot recommends Perplexica, Khoj, and SearXNG for Perplexity alternative queries', () => {
      const res = generateGroundedResponse('What is an open source alternative to Perplexity AI?');
      assert.ok(res.text.includes('Perplexica'), 'Must mention Perplexica');
      assert.ok(res.text.includes('Khoj'), 'Must mention Khoj');
      assert.ok(res.text.includes('SearXNG'), 'Must mention SearXNG');
      assert.ok(res.text.includes('/alternatives/perplexity'), 'Must link to /alternatives/perplexity');
    });

    test('Chatbot accurately reports OmniRush is 100% Free desktop/CLI with community model routing', () => {
      const res = generateGroundedResponse('What is the pricing for OmniRush? Is it free or freemium?');
      assert.ok(res.text.includes('100% Free'), 'Must state OmniRush is 100% Free');
      assert.ok(res.text.includes('not freemium'), 'Must explicitly clarify not freemium');
      assert.ok(res.text.includes('BYOK') || res.text.includes('Bring Your Own Key'), 'Must explain optional BYOK');
    });
  });
});
