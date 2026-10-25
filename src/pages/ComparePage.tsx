import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { getToolBySlug } from '../services/catalogService';
import { getAiToolBySlug } from '../services/aiCatalogService';
import { toolsData } from '../data/seedData';
import { aiToolsData } from '../data/aiToolsData';
import { proprietaryTools } from '../data/alternatives';
import { Tool, AiTool } from '../types';
import { Plus, X, ExternalLink, Check, Star, ShieldCheck, HardDrive, RefreshCw, Share2, Compass, BookOpen, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { siteConfig } from '../config/siteConfig';
import { AffiliateDisclosure } from '../components/AffiliateDisclosure';

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

  const resolvedSlugs = new Set(resolvedTools.map((tool) => tool.data.slug.toLowerCase()));
  const unresolvedSlugs = slugs.filter((slug) => !resolvedSlugs.has(slug.toLowerCase()));
  const getUnresolvedToolName = (slug: string) =>
    toolsData.find((tool) => tool.slug.toLowerCase() === slug.toLowerCase())?.name ||
    aiToolsData.find((tool) => tool.slug.toLowerCase() === slug.toLowerCase())?.name ||
    proprietaryTools.find((tool) => tool.slug.toLowerCase() === slug.toLowerCase())?.name ||
    slug.split('-').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

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
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <span className="text-sm">⚖️</span>
          <span>Side-by-Side Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Compare Open Source & AI Software
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mb-4">
          Evaluate licensing, self-hostability, pricing models, tech stacks, and repository metrics side by side.
        </p>

        {/* Popular Comparison Presets */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-slate-500 font-medium">Popular Comparisons:</span>
          {POPULAR_COMPARISONS.map((preset) => (
            <Link
              key={preset.tools}
              to={`/compare?tools=${preset.tools}`}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                toolsParam === preset.tools
                  ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold shadow-xs'
                  : 'bg-white text-slate-700 border-[#DFE7F3] hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {preset.label}
            </Link>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#DFE7F3] shadow-invary-card">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tool to Compare</span>
            </button>

            {isPickerOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-white border border-[#DFE7F3] p-2.5 shadow-2xl z-50 animate-fade-in">
                <input
                  type="text"
                  value={searchPicker}
                  onChange={(e) => setSearchPicker(e.target.value)}
                  placeholder="Search tool to add..."
                  className="w-full px-3 py-1.5 rounded-lg bg-[#F5F8FF] border border-[#DFE7F3] text-slate-900 placeholder:text-slate-400 text-xs mb-2 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  autoFocus
                />
                <div className="max-h-48 overflow-y-auto no-scrollbar flex flex-col gap-1">
                  {availableOptions.map((opt) => (
                    <button
                      key={opt.slug}
                      type="button"
                      onClick={() => handleAdd(opt.slug)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 cursor-pointer"
                    >
                      <span className="font-medium truncate">{opt.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{opt.type}</span>
                    </button>
                  ))}
                  {availableOptions.length === 0 && (
                    <span className="text-xs text-slate-500 p-2 text-center">No matching tools</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">
              Comparing <strong className="text-slate-900">{resolvedTools.length}</strong> {resolvedTools.length === 1 ? 'tool' : 'tools'}
            </span>

            <button
              type="button"
              onClick={handleCopyComparison}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DFE7F3] bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs cursor-pointer"
              aria-label={copied ? 'Copied comparison link' : 'Share URL: copy comparison link'}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Share URL</span>
                </>
              )}
            </button>

            {resolvedTools.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {unresolvedSlugs.length > 0 && (
        <section
          className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 sm:p-5"
          role="status"
          aria-live="polite"
        >
          <h2 className="text-sm font-bold text-amber-950">
            {unresolvedSlugs.length} selected {unresolvedSlugs.length === 1 ? 'tool is' : 'tools are'} not included
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-amber-900">
            These slugs do not have a comparable catalogue record yet. They were not silently treated as part of the comparison.
          </p>
          <ul className="mt-3 space-y-2">
            {unresolvedSlugs.map((slug) => (
              <li key={slug} className="flex flex-wrap items-center justify-between gap-2 text-xs text-amber-950">
                <span><strong>{getUnresolvedToolName(slug)}</strong> <span className="font-mono text-amber-800">({slug})</span> — not compared</span>
                <button
                  type="button"
                  onClick={() => handleRemove(slug)}
                  className="rounded-md border border-amber-400 px-2.5 py-1 font-semibold hover:bg-amber-100"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Comparison Grid Table */}
      {resolvedTools.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-[#DFE7F3] shadow-invary-card max-w-md mx-auto my-8">
          <p className="text-slate-600 text-sm mb-4">
            No tools selected for comparison. Pick 2 or more tools to inspect side-by-side.
          </p>
          <button
            type="button"
            onClick={() => handleAdd('supabase')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
          >
            Start with Supabase & Cursor
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto no-scrollbar rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#DFE7F3] bg-slate-50/80">
                <th className="p-4 w-44 font-semibold text-slate-500 uppercase tracking-wider text-[11px] font-mono">
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
                          <span className="font-bold text-slate-900 text-sm block truncate">{t.data.name}</span>
                          <span className="text-[10px] text-slate-500 uppercase font-mono">
                            {t.kind === 'open-source' ? 'Open Source' : 'Cloud AI'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(t.data.slug)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label={`Remove ${t.data.name} from comparison`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE7F3]">
              {/* Category */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Category</td>
                {resolvedTools.map((t) => (
                  <td key={t.data.id} className="p-4 capitalize text-slate-800 font-medium">
                    {t.kind === 'open-source' ? t.data.categories.join(', ') : t.data.category}
                  </td>
                ))}
              </tr>

              {/* Tagline */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Summary</td>
                {resolvedTools.map((t) => (
                  <td key={t.data.id} className="p-4 text-slate-600 leading-relaxed">
                    {t.data.tagline}
                  </td>
                ))}
              </tr>

              {/* Pricing / License */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Pricing / License</td>
                {resolvedTools.map((t) => (
                  <td key={t.data.id} className="p-4 text-slate-800">
                    {t.kind === 'open-source' ? (
                      <span className="px-2.5 py-1 rounded-md font-mono text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                        {t.data.license} (Free & Open Source)
                      </span>
                    ) : (
                      <div>
                        <span className="px-2.5 py-1 rounded-full font-medium text-[11px] bg-blue-50 text-blue-700 border border-blue-200 capitalize font-mono">
                          {t.data.pricingType}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1">{t.data.pricingDetails}</p>
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Hosting Model */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Hosting & Privacy</td>
                {resolvedTools.map((t) => (
                  <td key={t.data.id} className="p-4 text-slate-800">
                    {t.kind === 'open-source' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                        <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Self-Hostable (Docker / Local)</span>
                      </span>
                    ) : (
                      <span className="text-slate-600">Cloud SaaS Platform</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Key Features / Tech Stack */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Features / Stack</td>
                {resolvedTools.map((t) => (
                  <td key={t.data.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {t.kind === 'open-source'
                        ? t.data.techStack.map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 border border-slate-200">
                              {s}
                            </span>
                          ))
                        : t.data.features.map((f) => (
                            <span key={f} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 border border-slate-200">
                              {f}
                            </span>
                          ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Public repository metrics; AI ratings are hidden until their source is recorded. */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Public Metrics / Rating</td>
                {resolvedTools.map((t) => (
                  <td key={t.data.id} className="p-4 text-slate-800 font-mono">
                    {t.kind === 'open-source' ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="font-semibold text-slate-900">{t.data.stars.toLocaleString()} stars</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          Updated {t.data.lastCommitFormatted}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 leading-relaxed">
                        No sourced third-party rating recorded
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Action Links */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Explore</td>
                {resolvedTools.map((t) => {
                  const affiliateUrl = t.kind === 'ai' ? t.data.affiliateUrl : undefined;
                  return (
                    <td key={t.data.id} className="p-4">
                    <div className="flex flex-col gap-1.5">
                      <Link
                        to={t.kind === 'open-source' ? `/tools/${t.data.slug}` : `/ai-tools/${t.data.slug}`}
                        className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700 hover:underline text-xs"
                      >
                        <span>View Details</span>
                        <span>→</span>
                      </Link>
                      <a
                        href={affiliateUrl || t.data.websiteUrl}
                        target="_blank"
                        rel={affiliateUrl ? 'noopener noreferrer sponsored nofollow' : 'noopener noreferrer'}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 text-[11px] transition-colors"
                      >
                        <span>{affiliateUrl ? `Try ${t.data.name}` : 'Official Website'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {affiliateUrl && <AffiliateDisclosure />}
                    </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Decision-Making Framework */}
      <div className="mt-12 space-y-8">
        <div className="border-t border-[#DFE7F3] pt-8">
          <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2 w-fit font-mono">
            <Compass className="w-3.5 h-3.5" />
            <span>Architecture & Cost Evaluation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
            Software Decision-Making Framework
          </h2>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Comparing software isn't just about feature checklists—it requires balancing infrastructure hosting overhead, inference token economics, privacy compliance, and team ergonomics.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm font-mono">
              01
            </div>
            <h3 className="text-base font-semibold text-slate-900">Self-Hosted vs. Cloud SaaS</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Open-source self-hosted solutions (e.g. Supabase, Penpot, Umami) give you complete data sovereignty and zero per-seat licensing fees. However, factor in ongoing VM costs, automated database backups, security patching, and uptime monitoring.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 border-t border-[#DFE7F3]">
              <strong className="text-slate-800">Best for:</strong> Regulated industries, cost-conscious dev shops, and long-term project archiving.
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm font-mono">
              02
            </div>
            <h3 className="text-base font-semibold text-slate-900">Fixed SaaS vs. BYOK Token Economics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Proprietary AI tools usually charge $20–$30/user/month. Open-source or CLI alternatives (Aider, Cline, OpenCode) leverage BYOK (Bring Your Own Key) where you pay Anthropic or OpenAI directly at wholesale token rates, often saving 60–80% for moderate users.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 border-t border-[#DFE7F3]">
              <strong className="text-slate-800">Best for:</strong> Developers wanting model flexibility (Sonnet 3.7 vs DeepSeek V3) without vendor margin.
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm font-mono">
              03
            </div>
            <h3 className="text-base font-semibold text-slate-900">Licensing & Commercial Freedom</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Always verify repository licenses before embedding tools into commercial workflows. Permissive licenses (MIT, Apache 2.0, BSD) allow unrestricted commercial integration; copyleft licenses (GPL, AGPL) may require open-sourcing derivative backend services.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 border-t border-[#DFE7F3]">
              <strong className="text-slate-800">Best for:</strong> Founders and enterprise compliance teams verifying IP boundaries.
            </div>
          </div>
        </div>

        {/* Practical Selection Matrix */}
        <div className="p-6 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Practical Selection Cheat Sheet</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F5F8FF] border border-[#DFE7F3] space-y-2">
              <span className="font-semibold text-slate-900 block">Individual Developer / Solopreneur</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Prioritize low monthly overhead. Pair <strong>Supabase</strong> (free tier) with <strong>Cursor</strong> or <strong>Aider/Cline</strong> using DeepSeek V3 / Sonnet APIs to keep software costs under $10/month.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F8FF] border border-[#DFE7F3] space-y-2">
              <span className="font-semibold text-slate-900 block">Privacy & Confidential Codebase</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Deploy <strong>Ollama</strong> or <strong>vLLM</strong> locally with <strong>Open WebUI</strong> or <strong>Aider</strong> running over local weights (Qwen 2.5 Coder 32B). No code or context tokens ever leave your local network.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F8FF] border border-[#DFE7F3] space-y-2">
              <span className="font-semibold text-slate-900 block">Scaling Growth Team</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Start with managed cloud versions of open-source software (e.g. Supabase Cloud, Penpot Cloud). When usage scales, transition to self-hosted Docker/Kube clusters without rewriting client application code.
              </p>
            </div>
          </div>
        </div>

        {/* Related Deep Dive Guides */}
        <div className="p-6 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Related Guides & Migration Frameworks</h3>
            </div>
            <Link to="/guides" className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium">
              View All Guides →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/guides/how-to-choose-ai-coding-assistant"
              className="p-4 rounded-xl border border-[#DFE7F3] bg-[#F5F8FF] hover:bg-white hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-blue-600 mb-1 block">Architecture Deep-Dive</span>
                <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  Cursor vs Claude Code vs Aider vs Cline
                </span>
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 mt-2">12 min read • Coding</span>
            </Link>

            <Link
              to="/guides/evaluating-free-ai-plans"
              className="p-4 rounded-xl border border-[#DFE7F3] bg-[#F5F8FF] hover:bg-white hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-blue-600 mb-1 block">Cost Reality Check</span>
                <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  How to Evaluate Free AI Tool Plans: Recurring vs Starter Credits
                </span>
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 mt-2">8 min read • Productivity</span>
            </Link>

            <Link
              to="/guides/local-llm-privacy-guide"
              className="p-4 rounded-xl border border-[#DFE7F3] bg-[#F5F8FF] hover:bg-white hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-blue-600 mb-1 block">Data Sovereignty</span>
                <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  Running Local LLMs for Total Privacy: Ollama + Open WebUI
                </span>
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 mt-2">7 min read • Privacy</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
