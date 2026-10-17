import React, { useState } from 'react';
import { toolsData } from '../data/seedData';
import { aiToolsData } from '../data/aiToolsData';
import { Link } from '../router/Router';
import { Tool, AiTool } from '../types';
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, Star, ExternalLink, ShieldCheck } from 'lucide-react';

interface MatchedRecommendation {
  tool: Tool | AiTool;
  type: 'open-source' | 'ai';
  matchScore: number;
  matchReasons: string[];
}

export const PickPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<string>('build-app');
  const [modelPreference, setModelPreference] = useState<'open-source' | 'ai-cloud' | 'both'>('both');
  const [budget, setBudget] = useState<'free' | 'freemium' | 'any'>('free');
  const [featureNeed, setFeatureNeed] = useState<string>('database');

  const goals = [
    { id: 'build-app', label: '💻 Build a Web App or Backend', desc: 'Databases, auth, APIs, code generation' },
    { id: 'create-media', label: '🎬 Generate Video or Images', desc: 'AI video, text-to-image, realistic rendering' },
    { id: 'write-copy', label: '✍️ Write Content or Automate Documents', desc: 'Copywriting, research, long-form articles' },
    { id: 'notes-wiki', label: '📝 Team Notes, Wiki & Knowledge Base', desc: 'Notion replacements, docs, self-hostable wikis' },
    { id: 'automate-workflows', label: '⚡ Automate Workflows & Integrations', desc: 'Zapier alternatives, webhook orchestrators' },
  ];

  const models = [
    { id: 'both', label: 'No Preference / Show Best of Both', desc: 'Evaluate top open-source tools and cloud AI platforms' },
    { id: 'open-source', label: '100% Open Source & Self-Hostable', desc: 'Prioritize data sovereignty, zero lock-in, and Docker hosting' },
    { id: 'ai-cloud', label: 'Ready-to-Use Cloud AI Platform', desc: 'Managed cloud models with high-speed generation APIs' },
  ];

  const budgets = [
    { id: 'free', label: '100% Free / Open Source', desc: 'No monthly subscription costs required' },
    { id: 'freemium', label: 'Free Tier / Generous Trial is Fine', desc: 'Free plan with optional paid upgrade' },
    { id: 'any', label: 'Any Budget / Commercial Tool Okay', desc: 'Best-in-class performance regardless of cost' },
  ];

  const runRecommendationEngine = (): MatchedRecommendation[] => {
    const results: MatchedRecommendation[] = [];

    // Evaluate open source tools
    if (modelPreference === 'both' || modelPreference === 'open-source') {
      toolsData.forEach((tool) => {
        let score = 50;
        const reasons: string[] = ['Free & open-source software with verifiable repository'];

        if (goal === 'build-app' && tool.categories.includes('developer-tools')) {
          score += 35;
          reasons.push('Matches software development & backend engineering goal');
        }
        if (goal === 'notes-wiki' && tool.categories.includes('productivity')) {
          score += 35;
          reasons.push('Designed for docs, wiki, and collaborative note-taking');
        }
        if (goal === 'automate-workflows' && (tool.slug === 'n8n' || tool.categories.includes('developer-tools'))) {
          score += 40;
          reasons.push('Specialized workflow orchestration engine');
        }
        if (goal === 'create-media' && tool.categories.includes('design-media')) {
          score += 35;
          reasons.push('Matches design & creative asset production');
        }
        if (tool.isSelfHostable) {
          score += 10;
          reasons.push('Self-hostable anywhere with Docker compose');
        }

        results.push({
          tool,
          type: 'open-source',
          matchScore: score,
          matchReasons: reasons,
        });
      });
    }

    // Evaluate AI tools
    if (modelPreference === 'both' || modelPreference === 'ai-cloud') {
      aiToolsData.forEach((tool) => {
        let score = 50;
        const reasons: string[] = [];

        if (goal === 'create-media' && (tool.category === 'video' || tool.category === 'image')) {
          score += 40;
          reasons.push('Leading generative video/image synthesis platform');
        }
        if (goal === 'build-app' && tool.category === 'coding') {
          score += 40;
          reasons.push('AI-assisted code editor & generative UI framework');
        }
        if (goal === 'write-copy' && (tool.category === 'writing' || tool.category === 'assistants')) {
          score += 35;
          reasons.push('Tailored for intelligent copywriting and research');
        }
        if (goal === 'automate-workflows' && tool.category === 'automation') {
          score += 40;
          reasons.push('Visual drag-and-drop automation connector');
        }

        if (budget === 'free' && (tool.pricingType === 'free' || tool.hasFreePlan)) {
          score += 15;
          reasons.push('Generous free tier available');
        } else if (budget === 'free' && tool.pricingType === 'paid') {
          score -= 30;
        }

        results.push({
          tool,
          type: 'ai',
          matchScore: score,
          matchReasons: reasons,
        });
      });
    }

    // Sort descending by score
    return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  };

  const recommendations = runRecommendationEngine();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Discovery Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Help Me Pick the Right Tool
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-xl mx-auto mb-6">
          Answer a few quick questions about your workflow, and we'll recommend the best open-source software and AI tools matching your exact needs.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
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
          <h2 className="text-lg font-bold text-foreground">Step 1 of 3: What is your primary objective?</h2>
          <div className="space-y-2.5">
            {goals.map((g) => (
              <label
                key={g.id}
                onClick={() => setGoal(g.id)}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  goal === g.id
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border bg-card/50 hover:bg-muted'
                }`}
              >
                <div>
                  <span className="font-semibold text-foreground text-sm block">{g.label}</span>
                  <span className="text-xs text-muted-foreground">{g.desc}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover shadow-sm"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Model Preference */}
      {step === 2 && (
        <div className="p-6 rounded-xl border border-border bg-card/80 space-y-4 shadow-md">
          <h2 className="text-lg font-bold text-foreground">Step 2 of 3: What is your hosting & license preference?</h2>
          <div className="space-y-2.5">
            {models.map((m) => (
              <label
                key={m.id}
                onClick={() => setModelPreference(m.id as any)}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  modelPreference === m.id
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border bg-card/50 hover:bg-muted'
                }`}
              >
                <div>
                  <span className="font-semibold text-foreground text-sm block">{m.label}</span>
                  <span className="text-xs text-muted-foreground">{m.desc}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    modelPreference === m.id ? 'border-primary bg-primary text-white' : 'border-border'
                  }`}
                >
                  {modelPreference === m.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </label>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover shadow-sm"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Budget */}
      {step === 3 && (
        <div className="p-6 rounded-xl border border-border bg-card/80 space-y-4 shadow-md">
          <h2 className="text-lg font-bold text-foreground">Step 3 of 3: What is your budget?</h2>
          <div className="space-y-2.5">
            {budgets.map((b) => (
              <label
                key={b.id}
                onClick={() => setBudget(b.id as any)}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  budget === b.id
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border bg-card/50 hover:bg-muted'
                }`}
              >
                <div>
                  <span className="font-semibold text-foreground text-sm block">{b.label}</span>
                  <span className="text-xs text-muted-foreground">{b.desc}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
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
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover shadow-sm"
            >
              <span>Calculate Recommendations</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-foreground">Recommended Tools for You</h2>
              <span className="text-xs text-muted-foreground">
                Rule-based matching engine calculated from live catalog metadata
              </span>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted hover:bg-border text-foreground text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Modify Answers</span>
            </button>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, i) => {
              const { tool, type, matchScore, matchReasons } = rec;
              const link = type === 'open-source' ? `/tools/${tool.slug}` : `/ai-tools/${tool.slug}`;

              return (
                <div
                  key={tool.id}
                  className="p-5 rounded-xl border border-border bg-card/80 space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-inner"
                        style={{ backgroundColor: tool.iconBgColor }}
                      >
                        {tool.iconLetter}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link to={link} className="font-bold text-base text-foreground hover:text-primary transition-colors">
                            {tool.name}
                          </Link>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-muted text-secondary-foreground border border-border uppercase">
                            {type === 'open-source' ? 'Open Source' : 'Cloud AI'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{tool.tagline}</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20 shrink-0">
                      {Math.min(99, matchScore)}% Match
                    </span>
                  </div>

                  {/* Why it matches */}
                  <div className="pt-2 border-t border-border/50 text-xs text-secondary-foreground space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Why it fits your criteria:
                    </span>
                    {matchReasons.map((r, ri) => (
                      <div key={ri} className="flex items-center gap-1.5 text-foreground text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <Link
                      to={link}
                      className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                    >
                      <span>Explore In Directory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-xs"
                    >
                      <span>Official Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
