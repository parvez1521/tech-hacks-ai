/**
 * Phase 25 Test Suite — Premium Product Experience, Scroll Motion & Smart AI Assistant Welcome
 *
 * Tests cover:
 * 1. WELCOME_QUESTIONS array exists with exactly 10 curated entries
 * 2. All welcome questions are unique strings of minimum useful length
 * 3. pickWelcomeQuestion de-duplication logic (via WELCOME_QUESTIONS export)
 * 4. scroll-reveal CSS utilities exist in index.css
 * 5. useScrollReveal hook file exists and exports the hook
 * 6. FloatingChatbot exports WELCOME_QUESTIONS
 * 7. Homepage has useScrollReveal import
 * 8. prefers-reduced-motion guard exists for reveal-section in CSS
 * 9. welcome-question-chip testid referenced in the component source
 * 10. No theme toggle reintroduced
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const SRC = path.join(ROOT, 'src');

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf-8');

describe('Phase 25: Premium UX, Scroll Reveal & Smart Welcome', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // 1. WELCOME_QUESTIONS array
  // ──────────────────────────────────────────────────────────────────────────
  it('FloatingChatbot exports WELCOME_QUESTIONS constant', () => {
    const src = read('src/components/FloatingChatbot.tsx');
    assert.ok(
      src.includes('export const WELCOME_QUESTIONS'),
      'WELCOME_QUESTIONS should be exported from FloatingChatbot.tsx'
    );
  });

  it('WELCOME_QUESTIONS has exactly 10 entries', () => {
    const src = read('src/components/FloatingChatbot.tsx');
    // Count the items in the const array (lines ending with a question string)
    const matches = src.match(/'[^']{20,}\?'/g) || src.match(/"[^"]{20,}\?"/g);
    // More robust: count entries in the WELCOME_QUESTIONS block
    const start = src.indexOf('export const WELCOME_QUESTIONS');
    const end = src.indexOf('] as const;', start);
    const block = src.slice(start, end);
    const entries = block.match(/^\s+['"].*['"]/gm) || [];
    assert.equal(entries.length, 10, `Expected 10 welcome questions, found ${entries.length}`);
  });

  it('All welcome questions are unique', () => {
    const src = read('src/components/FloatingChatbot.tsx');
    const start = src.indexOf('export const WELCOME_QUESTIONS');
    const end = src.indexOf('] as const;', start);
    const block = src.slice(start, end);
    const entries = (block.match(/^\s+['"](.*)['"],?$/gm) || [])
      .map((l) => l.trim().replace(/^['"]|['"],?$/g, ''));
    const unique = new Set(entries);
    assert.equal(unique.size, entries.length, 'All welcome questions should be unique');
  });

  it('Each welcome question is at least 20 characters long', () => {
    const src = read('src/components/FloatingChatbot.tsx');
    const start = src.indexOf('export const WELCOME_QUESTIONS');
    const end = src.indexOf('] as const;', start);
    const block = src.slice(start, end);
    const entries = (block.match(/^\s+['"](.*)['"],?$/gm) || [])
      .map((l) => l.trim().replace(/^['"]|['"],?$/g, ''));
    for (const q of entries) {
      assert.ok(q.length >= 20, `Welcome question too short: "${q}"`);
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Welcome question chip in the welcome bubble
  // ──────────────────────────────────────────────────────────────────────────
  it('FloatingChatbot contains data-testid="welcome-question-chip"', () => {
    const src = read('src/components/FloatingChatbot.tsx');
    assert.ok(
      src.includes('data-testid="welcome-question-chip"'),
      'Welcome bubble should have a clickable question chip with testid'
    );
  });

  it('Clicking the welcome question chip calls handleSend with the question', () => {
    const src = read('src/components/FloatingChatbot.tsx');
    // The handleSendWelcomeQuestion function should exist and call handleSend
    assert.ok(
      src.includes('handleSendWelcomeQuestion'),
      'handleSendWelcomeQuestion handler should be defined'
    );
    assert.ok(
      src.includes('handleSend(q)') || src.includes('handleSend(welcomeQuestion)'),
      'handleSendWelcomeQuestion should invoke handleSend with the question'
    );
  });

  it('welcomeQuestion state is set from pickWelcomeQuestion', () => {
    const src = read('src/components/FloatingChatbot.tsx');
    assert.ok(
      src.includes('pickWelcomeQuestion()'),
      'pickWelcomeQuestion() should be called to select the welcome question'
    );
    assert.ok(
      src.includes('setWelcomeQuestion'),
      'setWelcomeQuestion should be called to store the selected question'
    );
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Scroll-reveal hook
  // ──────────────────────────────────────────────────────────────────────────
  it('useScrollReveal hook file exists', () => {
    const hookPath = path.join(SRC, 'hooks', 'useScrollReveal.ts');
    assert.ok(fs.existsSync(hookPath), 'src/hooks/useScrollReveal.ts should exist');
  });

  it('useScrollReveal exports the hook function', () => {
    const src = read('src/hooks/useScrollReveal.ts');
    assert.ok(
      src.includes('export function useScrollReveal'),
      'useScrollReveal should be exported as a named function'
    );
  });

  it('useScrollReveal uses IntersectionObserver', () => {
    const src = read('src/hooks/useScrollReveal.ts');
    assert.ok(
      src.includes('IntersectionObserver'),
      'useScrollReveal should use IntersectionObserver'
    );
  });

  it('useScrollReveal respects prefers-reduced-motion', () => {
    const src = read('src/hooks/useScrollReveal.ts');
    assert.ok(
      src.includes('prefers-reduced-motion'),
      'useScrollReveal should check prefers-reduced-motion and skip animation'
    );
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Scroll-reveal CSS
  // ──────────────────────────────────────────────────────────────────────────
  it('index.css defines .reveal-section class', () => {
    const css = read('src/index.css');
    assert.ok(css.includes('.reveal-section'), '.reveal-section class should exist in index.css');
  });

  it('index.css defines .reveal-section.in-view revealed state', () => {
    const css = read('src/index.css');
    assert.ok(
      css.includes('.reveal-section.in-view'),
      '.reveal-section.in-view should be defined in index.css'
    );
  });

  it('prefers-reduced-motion block handles .reveal-section', () => {
    const css = read('src/index.css');
    // Find the media query block
    const mediaStart = css.indexOf('@media (prefers-reduced-motion: reduce)');
    const mediaEnd = css.indexOf('}', css.lastIndexOf('.reveal-section'));
    const mediaBlock = css.slice(mediaStart, mediaEnd + 1);
    assert.ok(
      mediaBlock.includes('.reveal-section'),
      '.reveal-section should be covered by prefers-reduced-motion media query'
    );
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 5. HomePage imports and uses useScrollReveal
  // ──────────────────────────────────────────────────────────────────────────
  it('HomePage imports useScrollReveal', () => {
    const src = read('src/pages/HomePage.tsx');
    assert.ok(
      src.includes("from '../hooks/useScrollReveal'"),
      "HomePage should import useScrollReveal from hooks"
    );
  });

  it('HomePage declares multiple useScrollReveal instances for below-fold sections', () => {
    const src = read('src/pages/HomePage.tsx');
    // Should have at least 5 reveal hooks for below-fold sections
    const matches = src.match(/useScrollReveal/g) || [];
    assert.ok(
      matches.length >= 6,
      `Expected at least 6 useScrollReveal calls (import + 5+ sections), got ${matches.length}`
    );
  });

  it('HomePage sections use reveal-section class', () => {
    const src = read('src/pages/HomePage.tsx');
    assert.ok(
      src.includes('reveal-section'),
      'HomePage should apply reveal-section class to below-fold sections'
    );
  });

  it('Hero section (Section 1) does NOT have reveal-section class', () => {
    const src = read('src/pages/HomePage.tsx');
    // The first section tag should be the hero with no reveal-section
    const heroSection = src.slice(src.indexOf('<section className="relative'), src.indexOf('SECTION 2'));
    assert.ok(
      !heroSection.includes('reveal-section'),
      'Hero section (above fold) should NOT have scroll-reveal applied'
    );
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 6. Theme toggle not reintroduced (regression guard)
  // ──────────────────────────────────────────────────────────────────────────
  it('Header does not contain a rendered theme toggle button', () => {
    const src = read('src/components/Header.tsx');
    // Check that there's no actual theme toggle UI element (button with aria-label for theme)
    // toggleTheme may still be imported/destructured from context but must not be rendered as a button
    const hasToggleButton =
      src.includes('aria-label="Toggle theme"') ||
      src.includes('aria-label="Switch theme"') ||
      src.includes('aria-label="Dark mode"') ||
      src.includes('data-testid="theme-toggle"') ||
      src.includes('onClick={toggleTheme}');
    assert.ok(!hasToggleButton, 'Theme toggle button should NOT be rendered in the Header (dark-only mode)');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 7. Welcome session de-duplication storage key
  // ──────────────────────────────────────────────────────────────────────────
  it('FloatingChatbot tracks welcome question index in sessionStorage to avoid repeats', () => {
    const src = read('src/components/FloatingChatbot.tsx');
    assert.ok(
      src.includes('WELCOME_Q_STORAGE_KEY') || src.includes('techhacks_welcome_q_idx'),
      'Should use a sessionStorage key to track and avoid repeating the same welcome question'
    );
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 8. 5-second timer preserved
  // ──────────────────────────────────────────────────────────────────────────
  it('FloatingChatbot 5-second welcome timer is preserved', () => {
    const src = read('src/components/FloatingChatbot.tsx');
    assert.ok(
      src.includes('5000'),
      'The 5-second delay for the welcome popup should still be present'
    );
  });
});
