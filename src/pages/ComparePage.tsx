import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { getToolBySlug } from '../services/catalogService';
import { getAiToolBySlug } from '../services/aiCatalogService';
import { toolsData } from '../data/seedData';
import { aiToolsData } from '../data/aiToolsData';
import { Tool, AiTool } from '../types';
import { Scales, Plus, X, ExternalLink, Check, Star, ShieldCheck, HardDrive, RefreshCw } from 'lucide-react';

type UnifiedTool =
  | { kind: 'open-source'; data: Tool }
  | { kind: 'ai'; data: AiTool };

export const ComparePage: React.FC = () => {
  const { searchParams, setSearchParams } = useRouter();
  const toolsParam = searchParams.get('tools') || 'supabase,firebase,cursor';
  const slugs = toolsParam.split(',').filter(Boolean);

  const [searchPicker, setSearchPicker] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

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
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl mb-6">
          Evaluate licensing, self-hostability, pricing models, tech stacks, and repository metrics side by side.
        </p>

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
                        <div
                          className="w-7 h-7 rounded flex items-center justify-center font-bold text-xs text-white shrink-0"
                          style={{ backgroundColor: t.data.iconBgColor }}
                        >
                          {t.data.iconLetter}
                        </div>
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
    </div>
  );
};
