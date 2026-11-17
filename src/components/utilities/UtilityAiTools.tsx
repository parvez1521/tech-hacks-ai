import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, Copy, Download } from 'lucide-react';
import { extractChatText, type PuterChatResponse } from '../../lib/utilities/puterChat';

/**
 * AI Text, Image & Video Generator, powered by Puter.js (https://js.puter.com/v2/).
 *
 * Verified against the official Puter docs (developer.puter.com tutorials and
 * docs.puter.com/Auth + docs.puter.com/AI/txt2vid, read 2026-11-17):
 * - CDN script: https://js.puter.com/v2/ — loaded dynamically when this tool
 *   mounts, never in index.html, so other pages pay nothing for it.
 * - `puter.ai.chat(prompt)` resolves to the model's reply (used as a string
 *   in every official example; handled defensively below in case the SDK
 *   resolves an object with a `message.content` or `text` field instead).
 * - `puter.ai.txt2img(prompt)` resolves to an HTMLImageElement, called with
 *   no model argument so the provider default applies.
 * - `puter.ai.txt2vid(prompt, options)` resolves to an HTMLVideoElement with
 *   `controls` enabled. Model defaults to 'togetherai:wan-ai/wan2.7-t2v'
 *   (Wan 2.7 text-to-video, per docs.puter.com/AI/txt2vid): per-second
 *   pricing, 2–15 s clips (default 5 s), 720P/1080P tiers. This tool passes
 *   the documented default explicitly, with seconds: 5 and size: '720x1280'
 *   (720P tier, 9:16) so a visitor's allowance lasts longer. Video is slow
 *   (tens of seconds to several minutes; Puter waits up to 14 minutes, then
 *   fails with `upstream_timeout`), so the UI shows an honest waiting state
 *   with real elapsed time and no fake progress bar.
 * - `puter.auth.isSignedIn()` is a synchronous signed-in check;
 *   `puter.auth.signIn()` opens the Puter sign-in popup and must be called
 *   from a user action, so the sign-in button calls it directly.
 *
 * User-Pays: no API key, no backend, no cost to SwitchRoute. Each visitor
 * signs in with their own free Puter account on first use and generation is
 * billed to their own account's allowance. Nothing here is mocked: every
 * result comes from a live Puter call, and failures surface as errors.
 * The shipped code never requests a placeholder clip; video costs far more
 * credits than text or image, which the page says plainly.
 */

export const PUTER_SCRIPT_URL = 'https://js.puter.com/v2/';

/** Documented Wan 2.7 text-to-video default (docs.puter.com/AI/txt2vid). */
export const PUTER_VIDEO_MODEL = 'togetherai:wan-ai/wan2.7-t2v';
/** Modest defaults so a visitor's allowance lasts: 5 s clip, 720P tier, 9:16. */
export const PUTER_VIDEO_SECONDS = 5;
export const PUTER_VIDEO_SIZE = '720x1280';

interface PuterApi {
  ai: {
    chat: (prompt: string) => Promise<PuterChatResponse>;
    txt2img: (prompt: string) => Promise<HTMLImageElement>;
    txt2vid: (
      prompt: string,
      options?: { model?: string; seconds?: number; size?: string },
    ) => Promise<HTMLVideoElement>;
  };
  auth: {
    isSignedIn: () => boolean;
    signIn: () => Promise<unknown>;
    getUser: () => Promise<{ username?: string } | null>;
  };
}

declare global {
  interface Window {
    puter?: PuterApi;
  }
}

type ScriptStatus = 'loading' | 'ready' | 'error';
type Mode = 'text' | 'image' | 'video';

let puterScriptPromise: Promise<void> | null = null;

function loadPuterScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Puter.js needs a browser window.'));
  if (window.puter?.ai && window.puter?.auth) return Promise.resolve();
  if (puterScriptPromise) return puterScriptPromise;
  puterScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${PUTER_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Puter.js could not be loaded.')));
      return;
    }
    const script = document.createElement('script');
    script.src = PUTER_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Puter.js could not be loaded. Check your connection and try again.'));
    document.head.appendChild(script);
  });
  puterScriptPromise.catch(() => {
    puterScriptPromise = null;
  });
  return puterScriptPromise;
}

function friendlyError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? '');
  const code = (error as { code?: unknown } | null)?.code;
  const haystack = `${code ?? ''} ${message}`;
  if (/upstream_timeout|504|timed?\s?out/i.test(haystack)) {
    return 'Puter timed out waiting for the clip (it waits up to 14 minutes). Try again with a shorter prompt, or retry as-is.';
  }
  if (/insufficient_funds|402|insufficient|balance/i.test(haystack)) {
    return 'Your Puter balance cannot cover this generation. Use a shorter clip, or top up your Puter account, and try again.';
  }
  if (/moderation_flagged|moderation/i.test(haystack)) {
    return 'Puter refused this prompt — its content filter flagged it. Change the prompt and try again.';
  }
  if (/network|fetch|failed to fetch|load|offline/i.test(message)) {
    return 'Could not reach Puter. Check your connection and try again.';
  }
  if (/auth|sign|401|403|unauthor/i.test(message)) {
    return 'Puter did not accept the sign-in. Sign in again and retry.';
  }
  if (/429|rate|limit|quota|allowance/i.test(message)) {
    return 'Puter refused this request (rate limit or allowance reached). Wait a while and try again.';
  }
  return message ? `Generation failed: ${message}` : 'Generation failed. Please try again.';
}

export const AiGeneratorTool: React.FC = () => {
  const [scriptStatus, setScriptStatus] = useState<ScriptStatus>('loading');
  const [signedIn, setSignedIn] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [mode, setMode] = useState<Mode>('text');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [textResult, setTextResult] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState('ai-generated-video.mp4');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // Real elapsed seconds while a video renders — a clock, not a progress bar:
  // video generation takes minutes and Puter reports no progress to show.
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const mountedRef = useRef(true);
  // Latest-request gate: switching modes abandons a still-running generation
  // (a video render cannot be cancelled, but its late result must never
  // clobber the mode the visitor switched to, and the UI must not stay stuck
  // on "Generating…" in the new mode).
  const requestRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    loadPuterScript()
      .then(() => {
        if (!mountedRef.current) return;
        setScriptStatus('ready');
        try {
          setSignedIn(Boolean(window.puter?.auth?.isSignedIn()));
        } catch {
          setSignedIn(false);
        }
      })
      .catch(() => {
        if (mountedRef.current) setScriptStatus('error');
      });
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!generating || mode !== 'video') return;
    const timer = window.setInterval(() => {
      if (mountedRef.current) setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [generating, mode]);

  const handleSignIn = async () => {
    const puter = window.puter;
    if (!puter?.auth) {
      setError('Puter.js is not loaded yet. Wait a moment and try again.');
      return;
    }
    setSigningIn(true);
    setError(null);
    try {
      await puter.auth.signIn();
      if (mountedRef.current) setSignedIn(Boolean(puter.auth.isSignedIn()));
    } catch (err) {
      if (mountedRef.current) setError(friendlyError(err));
    } finally {
      if (mountedRef.current) setSigningIn(false);
    }
  };

  const handleGenerate = async () => {
    const puter = window.puter;
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError('Enter a prompt first.');
      return;
    }
    if (!puter?.ai || !puter?.auth) {
      setError('Puter.js is not loaded yet. Wait a moment and try again.');
      return;
    }
    if (!signedIn) {
      setError('Sign in with Puter first — generation uses your own Puter account.');
      return;
    }
    setGenerating(true);
    setError(null);
    setTextResult(null);
    setImageSrc(null);
    setVideoSrc(null);
    setElapsedSeconds(0);
    const requestId = ++requestRef.current;
    const isCurrent = () => mountedRef.current && requestRef.current === requestId;
    try {
      if (mode === 'text') {
        const response = await puter.ai.chat(trimmed);
        const text = extractChatText(response);
        if (!text.trim()) throw new Error('Puter returned an empty reply.');
        if (isCurrent()) setTextResult(text);
      } else if (mode === 'image') {
        const image = await puter.ai.txt2img(trimmed);
        const src = image?.src || '';
        if (!src) throw new Error('Puter returned an image without a usable source.');
        if (isCurrent()) setImageSrc(src);
      } else {
        const video = await puter.ai.txt2vid(trimmed, {
          model: PUTER_VIDEO_MODEL,
          seconds: PUTER_VIDEO_SECONDS,
          size: PUTER_VIDEO_SIZE,
        });
        const src = video?.src || '';
        if (!src) throw new Error('Puter returned a video without a usable source.');
        if (isCurrent()) {
          const mime = typeof video.getAttribute === 'function' ? video.getAttribute('data-mime-type') || '' : '';
          setVideoFileName(mime.includes('webm') ? 'ai-generated-video.webm' : 'ai-generated-video.mp4');
          setVideoSrc(src);
        }
      }
    } catch (err) {
      if (isCurrent()) setError(friendlyError(err));
    } finally {
      if (isCurrent()) setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!textResult) return;
    navigator.clipboard.writeText(textResult).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    // Abandon any running generation so the new mode starts idle; a late
    // result from the abandoned call is ignored by the request gate.
    requestRef.current += 1;
    setGenerating(false);
    setElapsedSeconds(0);
    setMode(next);
    setTextResult(null);
    setImageSrc(null);
    setVideoSrc(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-border bg-muted/60 p-3 text-xs leading-relaxed text-secondary-foreground">
        Powered by Puter.js. Your prompt is sent to Puter, a third-party AI service. Generation uses your own free
        Puter account and its allowance — SwitchRoute pays nothing and charges nothing. Output is AI-generated by
        Puter&rsquo;s models, so check it before you use it. Video costs far more credits than text or image, so
        video mode requests a short 5-second clip at 720p by default to make your allowance last.
      </p>

      {scriptStatus === 'loading' && (
        <div className="flex min-h-32 items-center justify-center rounded-xl border border-border bg-card/50 text-xs text-muted-foreground" role="status">
          Loading Puter.js…
        </div>
      )}

      {scriptStatus === 'error' && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Puter.js could not be loaded. Check your connection, then reload this page to try again.</span>
        </div>
      )}

      {scriptStatus === 'ready' && !signedIn && (
        <div className="rounded-xl border border-border bg-card/60 p-5 text-center">
          <p className="mb-1 text-sm font-semibold text-foreground">Sign in with Puter to generate</p>
          <p className="mx-auto mb-4 max-w-md text-xs leading-relaxed text-muted-foreground">
            Puter asks you to sign in with your own free Puter account before it generates anything. Your usage is
            billed to your account&rsquo;s allowance, not to SwitchRoute.
          </p>
          <button
            type="button"
            onClick={handleSignIn}
            disabled={signingIn}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {signingIn ? 'Opening Puter sign-in…' : 'Sign in with Puter'}
          </button>
        </div>
      )}

      {scriptStatus === 'ready' && signedIn && (
        <>
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Generation mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'text'}
              onClick={() => switchMode('text')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${mode === 'text' ? 'bg-primary text-primary-foreground' : 'border border-border bg-muted text-secondary-foreground hover:bg-card'}`}
            >
              Text
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'image'}
              onClick={() => switchMode('image')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${mode === 'image' ? 'bg-primary text-primary-foreground' : 'border border-border bg-muted text-secondary-foreground hover:bg-card'}`}
            >
              Image
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'video'}
              onClick={() => switchMode('video')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${mode === 'video' ? 'bg-primary text-primary-foreground' : 'border border-border bg-muted text-secondary-foreground hover:bg-card'}`}
            >
              Video
            </button>
            <span className="ml-auto text-[11px] text-muted-foreground">Signed in to Puter</span>
          </div>

          <div>
            <label htmlFor="ai-generator-prompt" className="mb-1 block text-xs text-muted-foreground">
              {mode === 'text' ? 'What should the AI write?' : mode === 'image' ? 'Describe the image to generate' : 'Describe the clip to generate'}
            </label>
            <textarea
              id="ai-generator-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder={mode === 'text' ? 'Ask a question or describe what to write…' : mode === 'image' ? 'A calm mountain lake at sunrise, photorealistic…' : 'A fox sprinting through a snow-covered forest at dusk…'}
              className="w-full rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {mode === 'video' && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Video uses Wan 2.7 text-to-video at 5 seconds, 720p, 9:16. Video generation costs far more credits
              than text or image — a short clip keeps your Puter allowance lasting longer.
            </p>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {generating ? 'Generating…' : mode === 'text' ? 'Generate text' : mode === 'image' ? 'Generate image' : 'Generate video'}
          </button>

          {generating && mode === 'video' && (
            <div className="rounded-lg border border-border bg-muted/60 p-3 text-xs leading-relaxed text-secondary-foreground" role="status">
              <p className="font-semibold text-foreground">Generating your clip, this can take a while</p>
              <p>
                Video rendering usually takes a few minutes. Please keep this page open — the clip appears here when
                Puter finishes it. Waiting {elapsedSeconds}s so far; this is elapsed time, not a progress estimate.
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300" role="alert">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
              <button type="button" onClick={handleGenerate} className="ml-auto shrink-0 font-semibold text-foreground underline">
                Retry
              </button>
            </div>
          )}

          {textResult !== null && (
            <div className="rounded-xl border border-border bg-card/60 p-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-foreground">Generated text</h4>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{textResult}</p>
            </div>
          )}

          {imageSrc !== null && (
            <div className="rounded-xl border border-border bg-card/60 p-5">
              <h4 className="mb-3 text-sm font-bold text-foreground">Generated image</h4>
              <img src={imageSrc} alt={`AI-generated image for prompt: ${prompt.trim()}`} className="mx-auto max-h-[420px] max-w-full rounded-lg border border-border object-contain" />
              <a
                href={imageSrc}
                download="ai-generated-image.png"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download image</span>
              </a>
            </div>
          )}

          {videoSrc !== null && (
            <div className="rounded-xl border border-border bg-card/60 p-5">
              <h4 className="mb-1 text-sm font-bold text-foreground">Generated video</h4>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                Generated with Wan 2.7 text-to-video (5 seconds, 720p). Download the clip now — Puter&rsquo;s link
                is temporary and may stop working later.
              </p>
              <video src={videoSrc} controls preload="metadata" playsInline className="mx-auto max-h-[420px] max-w-full rounded-lg border border-border bg-black object-contain" />
              <a
                href={videoSrc}
                download={videoFileName}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download video</span>
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};
