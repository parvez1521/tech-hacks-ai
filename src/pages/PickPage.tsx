import React, { useState } from 'react';
import { Link } from '../router/Router.tsx';
import { getPickRecommendations } from '../services/aiCatalogService.ts';
import type { PickCriteria, MatchedPickResult } from '../types/index.ts';
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, ExternalLink, SlidersHorizontal, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo.tsx';

export const PickPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [goal, setGoal] = useState<string>('video-generation');
  const [taskDetail, setTaskDetail] = useState<string>('all-video');
  const [budget, setBudget] = useState<PickCriteria['budget']>('free-credits');
  const [hostingPreference, setHostingPreference] = useState<'browser' | 'local' | 'any'>('any');
  const [watermarkPreference, setWatermarkPreference] = useState<'no-watermark' | 'any'>('any');

  const goals = [
    { id: 'coding-dev', label: '💻 Code or Build a Web App or Backend', desc: 'AI code editors, full-stack builders, databases, and APIs' },
    { id: 'video-generation', label: '🎬 Create Videos — Generate Video or Images', desc: 'Text-to-video, realistic animation, motion, and talking avatars' },
    { id: 'image-generation', label: '🎨 Create Images & AI Art', desc: 'Photorealism, design assets, typography, FLUX, and Midjourney' },
    { id: 'chat-research', label: '✍️ Write or Research with AI', desc: 'AI assistants, deep research, summarization, and writing' },
    { id: 'workflow-automation', label: '⚡ Work Faster & Automate', desc: 'Visual integrations, webhooks, multi-step triggers, and workflow automation' },
    { id: 'open-source-software', label: '🔓 Explore Open Source', desc: 'Self-hostable, privacy-first replacements for Notion, Firebase, Figma, Airtable' },
    { id: 'voice-music', label: '🎙️ Voice, Speech & Music', desc: 'Realistic voice generation and music creators' },
    { id: 'browser-utilities', label: '🛠️ Fast Browser Utilities', desc: 'Client-side JSON formatters, hashers, diff checkers, and generators' },
  ];

  // Dynamic task details based on chosen goal
  const getTaskOptions = (currentGoal: string) => {
    switch (currentGoal) {
      case 'video-generation':
        return [
          { id: 'all-video', label: 'Any Video Generation', desc: 'Show top video engines across all styles' },
          { id: 'text-to-video', label: 'Text-to-Video', desc: 'Generate cinematic shots and narrative scenes from written prompts' },
          { id: 'image-to-video', label: 'Image-to-Video', desc: 'Bring static photos, illustrations, and midjourney art to life' },
          { id: 'avatar-video', label: 'Talking Avatars & Lip-Sync', desc: 'Virtual spokespersons with realistic speech and head gestures' },
          { id: 'video-to-video', label: 'Video-to-Video / Stylization', desc: 'Restyle existing footage into anime or stylized animation' },
        ];
      case 'image-generation':
        return [
          { id: 'all-image', label: 'Any Image Creation', desc: 'Photorealism, illustration, or design concepts' },
          { id: 'text-to-image', label: 'Text-to-Image', desc: 'Photorealistic scenes, accurate typography, and creative art' },
          { id: 'image-editing', label: 'Image Inpainting & Editing', desc: 'Canvas expansion, selective editing, and style transfers' },
        ];
      case 'chat-research':
        return [
          { id: 'all-chat', label: 'Any Conversational AI', desc: 'All-around daily AI assistants' },
          { id: 'reasoning', label: 'Deep Reasoning & Math', desc: 'Chain-of-thought models (DeepSeek-R1, QwQ) for complex logic' },
          { id: 'research', label: 'Live Grounded Research', desc: 'Direct web answers with verifiable bibliographic citations' },
          { id: 'coding-chat', label: 'Interactive Coding & Canvas', desc: 'Artifacts and Canvas workspaces for building apps live' },
        ];
      case 'coding-dev':
        return [
          { id: 'ide-editor', label: 'AI IDE / Code Editor', desc: 'Full-repository pair programming editors (Cursor, OmniRush)' },
          { id: 'ui-builder', label: 'Generative UI & Scaffolding', desc: 'Generate modern React and Tailwind components from prompts' },
          { id: 'backend-dev', label: 'Backend & Database BaaS', desc: 'Open-source Firebase & Supabase alternatives' },
        ];
      case 'voice-music':
        return [
          { id: 'text-to-speech', label: 'Hyper-Realistic Voice (TTS)', desc: 'Emotional cadence, voice cloning, and audio narration' },
          { id: 'music-generation', label: 'Full Song & Music Composition', desc: 'Generate complete broadcast-quality tracks with vocals' },
        ];
      case 'workflow-automation':
        return [
          { id: 'workflow-orchestrator', label: 'Visual Workflow Orchestrators', desc: 'Self-hostable or cloud Zapier alternatives' },
        ];
      case 'open-source-software':
        return [
          { id: 'developer-tools', label: 'Developer Tools & BaaS', desc: 'Databases, auth, object storage, serverless' },
          { id: 'productivity', label: 'Team Wiki & Document Management', desc: 'Notion and Google Docs open-source alternatives' },
          { id: 'analytics', label: 'Privacy Analytics & Metrics', desc: 'Google Analytics and Mixpanel replacements' },
        ];
      case 'browser-utilities':
        return [
          { id: 'developer', label: 'Developer Data Parsers', desc: 'JSON formatters, regex testers, URL encoders' },
          { id: 'security', label: 'Security & Hash Generators', desc: 'SHA-256 hashes, UUIDs, client-side cryptography' },
        ];
      default:
        return [{ id: 'all', label: 'General', desc: 'Any specialized sub-task' }];
    }
  };

  const budgets = [
    { id: 'completely-free', label: '✨ Free only', desc: 'Zero cost, 100% free forever, no credit card required' },
    { id: 'free-credits', label: '🎁 Free plan is okay', desc: 'Generous daily or monthly free generations (Kling, Vidu, PixVerse, etc.)' },
    { id: 'any', label: '🌐 Paid tools are fine', desc: 'Evaluate top tools regardless of payment requirements' },
    { id: 'free-trial', label: '⏱️ Free trial credits', desc: 'One-time initial starter credits (Runway, Kaiber, KIE AI)' },
    { id: 'self-hosted', label: '🖥️ Run on my computer', desc: 'Run locally on your GPU (Wan 2.1, LTX Video, CogVideoX, FLUX.1)' },
  ];

  const showWatermark = goal === 'video-generation' || goal === 'image-generation';

  const handleGoalSelect = (newGoal: string) => {
    setGoal(newGoal);
    const options = getTaskOptions(newGoal);
    setTaskDetail(options[0].id);
    // Reset watermark preference when switching to non-media goals
    if (newGoal !== 'video-generation' && newGoal !== 'image-generation') {
      setWatermarkPreference('any');
    }
  };

  // Run recommendation engine with current criteria
  const criteria: PickCriteria = {
    goal,
    taskDetail,
    budget,
    hostingPreference,
    watermarkPreference,
  };

  const recommendations: MatchedPickResult[] = getPickRecommendations(criteria);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Intelligent Tool Matcher</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Help Me Pick the Right Tool
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-xl mx-auto mb-6">
          Answer 4 quick questions. Our recommendation engine eliminates irrelevant tools first, then scores the best verified AI platforms and open-source software for your workflow.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                s === step
                  ? 'w-10 bg-primary'
                  : s < step
                  ? 'w-6 bg-primary/40'
                  : 'w-6 bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Goal */}
      {step === 1 && (
        <div className="p-6 rounded-xl border border-border bg-card/80 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Step 1 of 4: What is your primary objective?</h2>
            <span className="text-xs text-muted-foreground font-mono">1/4</span>
          </div>
          <div className="space-y-2.5">
            {goals.map((g) => (
              <label
                key={g.id}
                onClick={() => handleGoalSelect(g.id)}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  goal === g.id
                    ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
                    : 'border-border bg-card/50 hover:bg-muted'
                }`}
              >
                <div>
                  <span className="font-semibold text-foreground text-sm block">{g.label}</span>
                  <span className="text-xs text-muted-foreground">{g.desc}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                    goal === g.id ? 'border-primary bg-primary text-white' : 'border-border'
                  }`}
                >
                  {goal === g.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </label>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Task Details */}
      {step === 2 && (
        <div className="p-6 rounded-xl border border-border bg-card/80 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Step 2 of 4: Which specific task do you need?</h2>
            <span className="text-xs text-muted-foreground font-mono">2/4</span>
          </div>
          <div className="space-y-2.5">
            {getTaskOptions(goal).map((opt) => (
              <label
                key={opt.id}
                onClick={() => setTaskDetail(opt.id)}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  taskDetail === opt.id
                    ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
                    : 'border-border bg-card/50 hover:bg-muted'
                }`}
              >
                <div>
                  <span className="font-semibold text-foreground text-sm block">{opt.label}</span>
                  <span className="text-xs text-muted-foreground">{opt.desc}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                    taskDetail === opt.id ? 'border-primary bg-primary text-white' : 'border-border'
                  }`}
                >
                  {taskDetail === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </label>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground text-xs font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm"
            >
              <span>Next: Budget & Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Budget & Access */}
      {step === 3 && (
        <div className="p-6 rounded-xl border border-border bg-card/80 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Step 3 of 4: What is your budget and access model?</h2>
            <span className="text-xs text-muted-foreground font-mono">3/4</span>
          </div>
          <div className="space-y-2.5">
            {budgets.map((b) => (
              <label
                key={b.id}
                onClick={() => setBudget(b.id as PickCriteria['budget'])}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  budget === b.id
                    ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
                    : 'border-border bg-card/50 hover:bg-muted'
                }`}
              >
                <div>
                  <span className="font-semibold text-foreground text-sm block">{b.label}</span>
                  <span className="text-xs text-muted-foreground">{b.desc}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                    budget === b.id ? 'border-primary bg-primary text-white' : 'border-border'
                  }`}
                >
                  {budget === b.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </label>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground text-xs font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm"
            >
              <span>{showWatermark ? 'Next: Setup & Watermarks' : 'Next: Setup & Preferences'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Hosting & Conditional Watermark Preferences */}
      {step === 4 && (
        <div className="p-6 rounded-xl border border-border bg-card/80 space-y-6 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              {showWatermark
                ? 'Step 4 of 4: Setup and watermark preferences'
                : 'Step 4 of 4: Setup and preferences'}
            </h2>
            <span className="text-xs text-muted-foreground font-mono">4/4</span>
          </div>

          {/* Hosting Preference */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
              Where do you prefer to run the tool?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'any', label: 'No preference', desc: 'Show both website and desktop options' },
                { id: 'browser', label: '🌐 Website', desc: 'Run directly in your browser without installing' },
                { id: 'local', label: '🖥️ Desktop app / local', desc: 'Install on your computer or self-host' },
              ].map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setHostingPreference(h.id as any)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    hostingPreference === h.id
                      ? 'border-primary bg-primary/10 ring-1 ring-primary'
                      : 'border-border bg-card/50 hover:bg-muted'
                  }`}
                >
                  <span className="text-xs font-semibold text-foreground block">{h.label}</span>
                  <span className="text-[11px] text-muted-foreground">{h.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Watermark Preference — Strictly conditional for video & image workflows only */}
          {showWatermark && (
            <div className="space-y-3 pt-2 border-t border-border/50">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                Watermark Tolerance on Free Output:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'any', label: 'Watermark is fine', desc: 'Prioritize free generations even if watermarked' },
                  { id: 'no-watermark', label: 'No watermark', desc: 'Prioritize clean output or watermark-free plans' },
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWatermarkPreference(w.id as any)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      watermarkPreference === w.id
                        ? 'border-primary bg-primary/10 ring-1 ring-primary'
                        : 'border-border bg-card/50 hover:bg-muted'
                    }`}
                  >
                    <span className="text-xs font-semibold text-foreground block">{w.label}</span>
                    <span className="text-[11px] text-muted-foreground">{w.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground text-xs font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-md transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find My Best Matches</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Recommendations Results */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Match Calculation</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">Recommended Tools for Your Workflow</h2>
              <span className="text-xs text-muted-foreground">
                Strictly filtered to eliminate non-matching categories; scored on capabilities and access provenance.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors shrink-0 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Criteria</span>
            </button>
          </div>

          {/* Active criteria tags bar */}
          <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-lg bg-card/60 border border-border/60 text-xs">
            <span className="text-muted-foreground font-medium">Applied Criteria:</span>
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-medium">
              Goal: {goals.find((g) => g.id === goal)?.label.split(' ')[1] || goal}
            </span>
            <span className="px-2 py-0.5 rounded bg-muted text-foreground border border-border font-medium">
              Task: {taskDetail.replace(/-/g, ' ')}
            </span>
            <span className="px-2 py-0.5 rounded bg-muted text-foreground border border-border font-medium">
              Budget: {budget.replace(/-/g, ' ')}
            </span>
            {hostingPreference !== 'any' && (
              <span className="px-2 py-0.5 rounded bg-muted text-foreground border border-border font-medium">
                Host: {hostingPreference}
              </span>
            )}
            {watermarkPreference !== 'any' && (
              <span className="px-2 py-0.5 rounded bg-muted text-foreground border border-border font-medium">
                No watermark
              </span>
            )}
          </div>

          {recommendations.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-border bg-card/40 space-y-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground mb-1">No exact tool matched all strict filters</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Your combination of goal ({goal}), hosting ({hostingPreference}), and watermark preferences is very narrow. Try broadening your budget or hosting preference.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBudget('any');
                  setHostingPreference('any');
                  setWatermarkPreference('any');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Broaden Budget & Hosting Filters</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec, i) => {
                const { tool, type, matchScore, matchExplanation, matchReasons, tasks, freeAccessSummary, detailUrl, websiteUrl, pricingVerifiedAt } = rec;

                return (
                  <div
                    key={tool.id}
                    className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-all space-y-3.5 shadow-md relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <BrandLogo
                          slug={tool.slug}
                          name={tool.name}
                          size="lg"
                          iconBgColor={tool.iconBgColor}
                          iconLetter={tool.iconLetter}
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link to={detailUrl} className="font-bold text-base text-foreground hover:text-primary transition-colors">
                              {tool.name}
                            </Link>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-muted text-secondary-foreground border border-border uppercase">
                              {type === 'open-source' ? 'Open Source' : type === 'utility' ? 'Utility' : 'Cloud AI'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Verified {pricingVerifiedAt}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{tool.tagline}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                          {Math.min(99, matchScore)}% Match
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">Rank #{i + 1}</span>
                      </div>
                    </div>

                    {/* Matched tasks tags */}
                    {tasks && tasks.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tasks.map((task, ti) => (
                          <span
                            key={ti}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted/80 text-secondary-foreground border border-border/50"
                          >
                            {task}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Detailed match rationale */}
                    <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs space-y-2">
                      <p className="text-foreground leading-relaxed font-medium">
                        {matchExplanation}
                      </p>

                      <div className="pt-2 border-t border-border/40 space-y-1">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                          Verified Access Provenance:
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-secondary-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{freeAccessSummary}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-1 flex items-center justify-between text-xs">
                      <Link
                        to={detailUrl}
                        className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                      >
                        <span>View Details & Limits</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-xs"
                      >
                        <span>Official Destination</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
