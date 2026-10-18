import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { getToolBySlug } from '../services/catalogService';
import { getAiToolBySlug } from '../services/aiCatalogService';
import { toolsData } from '../data/seedData';
import { aiToolsData } from '../data/aiToolsData';
import { Tool, AiTool } from '../types';
import { Plus, X, ExternalLink, Check, Star, ShieldCheck, HardDrive, RefreshCw, Share2, Compass, BookOpen, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { siteConfig } from '../config/siteConfig';

type UnifiedTool =
  | { kind: 'open-source'; data: Tool }
  | { kind: 'ai'; data: AiTool };

const POPULAR_COMPARISONS = [
  { label: 'Cursor vs Claude Code vs Aider', tools: 'cursor,claude-code,aider' },
  { label: 'Supabase vs Firebase', tools: 'supabase,firebase' },
  { label: 'Penpot vs Figma', tools: 'penpot,figma' },
  { label: 'Perplexity vs Perplexica vs Khoj', tools: 'perplexity,perplexica,khoj' },
  { label: 'Kling AI vs Wan 2.1 vs Runway', tools: 'kling-ai,wan-video,runway' },
  { label: 'Ollama vs Open WebUI', tools: 'ollama,open-webui' },
];

export const ComparePage: React.FC = () => {
  const { searchParams, setSearchParams } = useRouter();
  const toolsParam = searchParams.get('tools') || 'supabase,firebase,cursor';
  const slugs = toolsParam.split(',').filter(Boolean);

  const [searchPicker, setSearchPicker] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyComparison = () => {
    if (typeof window !== 'undefined') {
      const canonicalUrl = `${siteConfig.url}/compare?tools=${slugs.join(',')}`;
      navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Resolve tools from catalog
  const resolvedTools: UnifiedTool[] = [];
  slugs.forEach((slug) => {
    const os = getToolBySlug(slug);
    if (os) {
      resolvedTools.push({ kind: 'open-source', data: os });
      return;
    }
    const ai = getAiToolBySlug(slug);
    if (ai) {
      resolvedTools.push({ kind: 'ai', data: ai });
    }
  });

  const handleRemove = (slugToRemove: string) => {
    const nextSlugs = slugs.filter((s) => s.toLowerCase() !== slugToRemove.toLowerCase());
    setSearchParams({ tools: nextSlugs.length > 0 ? nextSlugs.join(',') : null });
  };

  const handleAdd = (slugToAdd: string) => {
    if (slugs.includes(slugToAdd)) return;
    const nextSlugs = [...slugs, slugToAdd];
    setSearchParams({ tools: nextSlugs.join(',') });
    setIsPickerOpen(false);
    setSearchPicker('');
  };

  const handleReset = () => {
    setSearchParams({ tools: null });
  };

  // Available tools to add
  const availableOptions: { name: string; slug: string; type: string }[] = [
    ...toolsData.map((t) => ({ name: t.name, slug: t.slug, type: 'Open Source' })),
    ...aiToolsData.map((a) => ({ name: a.name, slug: a.slug, type: 'AI Tool' })),
  ].filter(
    (item) =>
      !slugs.includes(item.slug) &&
      (item.name.toLowerCase().includes(searchPicker.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchPicker.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="text-sm">⚖️</span>
          <span>Side-by-Side Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Compare Open Source & AI Software
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl mb-4">
          Evaluate licensing, self-hostability, pricing models, tech stacks, and repository metrics side by side.
        </p>

        {/* Popular Comparison Presets */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-muted-foreground font-medium">Popular Comparisons:</span>
          {POPULAR_COMPARISONS.map((preset) => (
            <Link
              key={preset.tools}
              to={`/compare?tools=${preset.tools}`}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                toolsParam === preset.tools
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-card text-secondary-foreground border-border hover:bg-muted'
              }`}
            >
              {preset.label}
            </Link>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-card/60 border border-border">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-hover shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tool to Compare</span>
            </button>

            {isPickerOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-card border border-border p-2 shadow-2xl z-50 animate-fade-in">
                <input
                  type="text"
                  value={searchPicker}
                  onChange={(e) => setSearchPicker(e.target.value)}
                  placeholder="Search tool to add..."
                  className="w-full px-3 py-1.5 rounded bg-muted border border-border text-foreground text-xs mb-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
                <div className="max-h-48 overflow-y-auto no-scrollbar flex flex-col gap-1">
                  {availableOptions.map((opt) => (
                    <button
                      key={opt.slug}
                      type="button"
                      onClick={() => handleAdd(opt.slug)}
                      className="w-full text-left px-2.5 py-1.5 rounded text-xs hover:bg-muted flex items-center justify-between text-foreground"
                    >
                      <span className="font-medium truncate">{opt.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{opt.type}</span>
                    </button>
                  ))}
                  {availableOptions.length === 0 && (
                    <span className="text-xs text-muted-foreground p-2 text-center">No matching tools</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted-foreground">
              Comparing <strong className="text-foreground">{resolvedTools.length}</strong> {resolvedTools.length === 1 ? 'tool' : 'tools'}
            </span>

            <button
              type="button"
              onClick={handleCopyComparison}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-card hover:bg-muted text-foreground transition-colors"
              aria-label="Share comparison"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3 text-muted-foreground" />
                  <span>Share URL</span>
                </>
              )}
            </button>

            {resolvedTools.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-primary hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Grid Table */}
      {resolvedTools.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-card/60 border border-border max-w-md mx-auto my-8">
          <p className="text-secondary-foreground text-sm mb-4">
            No tools selected for comparison. Pick 2 or more tools to inspect side-by-side.
          </p>
          <button
            type="button"
            onClick={() => handleAdd('supabase')}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-sm"
          >
            Start with Supabase & Cursor
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto no-scrollbar rounded-xl border border-border bg-card/80 shadow-md">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-4 w-44 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  Attribute
                </th>
                {resolvedTools.map((t) => (
                  <th key={t.data.id} className="p-4 min-w-[220px] max-w-[280px]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <BrandLogo
                          slug={t.data.slug}
                          name={t.data.name}
                          size="xs"
                          iconBgColor={t.data.iconBgColor}
                          iconLetter={t.data.iconLetter}
                          className="w-7 h-7"
                        />
                        <div>
                          <span className="font-bold text-foreground text-sm block truncate">{t.data.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-mono">
                            {t.kind === 'open-source' ? 'Open Source' : 'Cloud AI'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(t.data.slug)}
                        className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
                        aria-label={`Remove ${t.data.name} from comparison`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {/* Category */}
              <tr>
                <td className="p-4 font-semibold text-muted-foreground bg-muted/20">Category</td>
                {resolvedTools.map((t) => (
                  <td key={t.data.id} className="p-4 capitalize text-foreground font-medium">
                    {t.kind === 'open-source' ? t.data.categories.join(', ') : t.data.category}
                  </td>
                ))}
              </tr>

              {/* Tagline */}
              <tr>
                <td className="p-4 font-semibold text-muted-foreground bg-muted/20">Summary</td>
                {resolvedTools.map((t) => (
                  <td key={t.data.id} className="p-4 text-secondary-foreground leading-relaxed">
                    {t.data.tagline}
                  </td>
                ))}
              </tr>

              {/* Pricing / License */}
              <tr>
                <td className="p-4 font-semibold text-muted-foreground bg-muted/20">Pricing / License</td>
                {resolvedTools.map((t) => (
                  <td key={t.data.id} className="p-4 text-foreground">
                    {t.kind === 'open-source' ? (
                      <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-muted border border-border">
                        {t.data.license} (Free & Open Source)
                      </span>
                    ) : (
                      <div>
                        <span className="px-2 py-0.5 rounded font-medium text-[11px] bg-primary/10 text-primary border border-primary/20 capitalize">
                          {t.data.pricingType}
                        </span>
                        <p className="text-[11px] text-muted-foreground mt-1">{t.data.pricingDetails}</p>
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Hosting Model */}
              <tr>
                <td className="p-4 font-semibold text-muted-foreground bg-muted/20">Hosting & Privacy</td>
                {resolvedTools.map((t) => (
                  <td key={t.data.id} className="p-4 text-foreground">
                    {t.kind === 'open-source' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>Self-Hostable (Docker / Local)</span>
                      </span>
                    ) : (
                      <span className="text-secondary-foreground">Cloud SaaS Platform</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Key Features / Tech Stack */}
              <tr>
                <td className="p-4 font-semibold text-muted-foreground bg-muted/20">Features / Stack</td>
                {resolvedTools.map((t) => (
                  <td key={t.data.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {t.kind === 'open-source'
                        ? t.data.techStack.map((s) => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-secondary-foreground">
                              {s}
                            </span>
                          ))
                        : t.data.features.map((f) => (
                            <span key={f} className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-secondary-foreground">
                              {f}
                            </span>
                          ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* GitHub Metrics / Rating */}
              <tr>
                <td className="p-4 font-semibold text-muted-foreground bg-muted/20">Verified Metrics</td>
                {resolvedTools.map((t) => (
                  <td key={t.data.id} className="p-4 text-foreground font-mono">
                    {t.kind === 'open-source' ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t.data.stars.toLocaleString()} stars</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground block">
                          Updated {t.data.lastCommitFormatted}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{t.data.rating ? `${t.data.rating.toFixed(1)} / 5.0` : 'Curated'}</span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Action Links */}
              <tr>
                <td className="p-4 font-semibold text-muted-foreground bg-muted/20">Explore</td>
                {resolvedTools.map((t) => (
                  <td key={t.data.id} className="p-4">
                    <div className="flex flex-col gap-1.5">
                      <Link
                        to={t.kind === 'open-source' ? `/tools/${t.data.slug}` : `/ai-tools/${t.data.slug}`}
                        className="inline-flex items-center gap-1 text-primary font-medium hover:underline text-xs"
                      >
                        <span>View Details</span>
                        <span>→</span>
                      </Link>
                      <a
                        href={t.data.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-[11px]"
                      >
                        <span>Official Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Decision-Making Framework */}
      <div className="mt-12 space-y-8">
        <div className="border-t border-border pt-8">
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>Architecture & Cost Evaluation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
            Software Decision-Making Framework
          </h2>
          <p className="text-sm text-secondary-foreground max-w-3xl leading-relaxed">
            Comparing software isn't just about feature checklists—it requires balancing infrastructure hosting overhead, inference token economics, privacy compliance, and team ergonomics.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-border bg-card/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-semibold text-foreground">Self-Hosted vs. Cloud SaaS</h3>
            <p className="text-xs text-secondary-foreground leading-relaxed">
              Open-source self-hosted solutions (e.g. Supabase, Penpot, Umami) give you complete data sovereignty and zero per-seat licensing fees. However, factor in ongoing VM costs, automated database backups, security patching, and uptime monitoring.
            </p>
            <div className="pt-2 text-[11px] text-muted-foreground border-t border-border/50">
              <strong>Best for:</strong> Regulated industries, cost-conscious dev shops, and long-term project archiving.
            </div>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-semibold text-foreground">Fixed SaaS vs. BYOK Token Economics</h3>
            <p className="text-xs text-secondary-foreground leading-relaxed">
              Proprietary AI tools usually charge $20–$30/user/month. Open-source or CLI alternatives (Aider, Cline, OpenCode) leverage BYOK (Bring Your Own Key) where you pay Anthropic or OpenAI directly at wholesale token rates, often saving 60–80% for moderate users.
            </p>
            <div className="pt-2 text-[11px] text-muted-foreground border-t border-border/50">
              <strong>Best for:</strong> Developers wanting model flexibility (Sonnet 3.7 vs DeepSeek V3) without vendor margin.
            </div>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-semibold text-foreground">Licensing & Commercial Freedom</h3>
            <p className="text-xs text-secondary-foreground leading-relaxed">
              Always verify repository licenses before embedding tools into commercial workflows. Permissive licenses (MIT, Apache 2.0, BSD) allow unrestricted commercial integration; copyleft licenses (GPL, AGPL) may require open-sourcing derivative backend services.
            </p>
            <div className="pt-2 text-[11px] text-muted-foreground border-t border-border/50">
              <strong>Best for:</strong> Founders and enterprise compliance teams verifying IP boundaries.
            </div>
          </div>
        </div>

        {/* Practical Selection Matrix */}
        <div className="p-6 rounded-xl border border-border bg-card/70 space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Practical Selection Cheat Sheet</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-muted/40 border border-border/70 space-y-1.5">
              <span className="font-semibold text-foreground block">Individual Developer / Solopreneur</span>
              <p className="text-secondary-foreground text-[11px] leading-relaxed">
                Prioritize low monthly overhead. Pair <strong>Supabase</strong> (free tier) with <strong>Cursor</strong> or <strong>Aider/Cline</strong> using DeepSeek V3 / Sonnet APIs to keep software costs under $10/month.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-muted/40 border border-border/70 space-y-1.5">
              <span className="font-semibold text-foreground block">Privacy & Confidential Codebase</span>
              <p className="text-secondary-foreground text-[11px] leading-relaxed">
                Deploy <strong>Ollama</strong> or <strong>vLLM</strong> locally with <strong>Open WebUI</strong> or <strong>Aider</strong> running over local weights (Qwen 2.5 Coder 32B). No code or context tokens ever leave your local network.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-muted/40 border border-border/70 space-y-1.5">
              <span className="font-semibold text-foreground block">Scaling Growth Team</span>
              <p className="text-secondary-foreground text-[11px] leading-relaxed">
                Start with managed cloud versions of open-source software (e.g. Supabase Cloud, Penpot Cloud). When usage scales, transition to self-hosted Docker/Kube clusters without rewriting client application code.
              </p>
            </div>
          </div>
        </div>

        {/* Related Deep Dive Guides */}
        <div className="p-6 rounded-xl border border-border bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Related Guides & Migration Frameworks</h3>
            </div>
            <Link to="/guides" className="text-xs text-primary hover:underline font-medium">
              View All Guides →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/guides/how-to-choose-ai-coding-assistant"
              className="p-3.5 rounded-lg border border-border bg-muted/40 hover:bg-muted/80 transition-colors flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-primary mb-1 block">Architecture Deep-Dive</span>
                <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  Cursor vs Claude Code vs Aider vs Cline
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-2">12 min read • Coding</span>
            </Link>

            <Link
              to="/guides/evaluating-free-ai-plans"
              className="p-3.5 rounded-lg border border-border bg-muted/40 hover:bg-muted/80 transition-colors flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-primary mb-1 block">Cost Reality Check</span>
                <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  How to Evaluate Free AI Tool Plans: Recurring vs Starter Credits
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-2">8 min read • Productivity</span>
            </Link>

            <Link
              to="/guides/local-llm-privacy-guide"
              className="p-3.5 rounded-lg border border-border bg-muted/40 hover:bg-muted/80 transition-colors flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-primary mb-1 block">Data Sovereignty</span>
                <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  Running Local LLMs for Total Privacy: Ollama + Open WebUI
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-2">7 min read • Privacy</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
