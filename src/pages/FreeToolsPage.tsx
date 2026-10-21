import React, { useMemo } from 'react';
import { getAllFreeTools } from '../services/aiCatalogService';
import { Link, useRouter } from '../router/Router';
import { getUtilityCategory, getUtilityCategoryDefinition, utilityCategoryDefinitions } from '../data/catalogTaxonomy';
import { Wrench, ArrowRight, ShieldCheck, Cpu, Search, X } from 'lucide-react';

export const FreeToolsPage: React.FC = () => {
  const tools = getAllFreeTools();
  const { searchParams, setSearchParams, resetSearchParams } = useRouter();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const normalized = query.trim().toLowerCase();

  const filteredTools = useMemo(() => tools.filter((tool) => {
    const matchesCategory = category === 'all' || getUtilityCategory(tool) === category;
    const haystack = `${tool.name} ${tool.tagline} ${tool.description} ${tool.acceptedInput} ${tool.outputFormat} ${getUtilityCategoryDefinition(getUtilityCategory(tool))?.name || ''}`.toLowerCase();
    return matchesCategory && (!normalized || haystack.includes(normalized));
  }), [category, normalized, tools]);

  const groupedTools = useMemo(() => utilityCategoryDefinitions
    .map((definition) => ({
      definition,
      tools: filteredTools.filter((tool) => getUtilityCategory(tool) === definition.id),
    }))
    .filter((group) => group.tools.length > 0), [filteredTools]);

  const updateQuery = (value: string) => setSearchParams({ q: value || null, page: null }, { replace: true });
  const updateCategory = (value: string) => setSearchParams({ category: value === 'all' ? null : value, page: null });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground">Home</Link><span>/</span><span className="font-medium text-foreground">Utility Tools</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2"><Wrench className="w-4 h-4" /><span>Utility Tools · Free Browser-Based Utilities</span></div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">Utility Tools</h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl mb-6">Perform common text, data, media, image, security, and browser tasks directly with focused tools. Client-Side utilities explain local processing, while service-backed tools clearly disclose their configured provider requirement.</p>
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3 text-xs text-secondary-foreground mb-8"><ShieldCheck className="w-5 h-5 text-primary shrink-0" /><span><strong>Privacy-first processing:</strong> Browser utilities keep their input local. Service-backed transcription sends a file only after you start it and reports when server configuration is unavailable.</span></div>

        <div className="mb-5 grid gap-3 rounded-xl border border-border bg-card/60 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><label className="sr-only" htmlFor="utility-search">Search Utility Tools</label><input id="utility-search" value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search Utility Tools, formats, or tasks…" className="w-full rounded-lg border border-border bg-muted py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />{query && <button type="button" onClick={() => updateQuery('')} aria-label="Clear utility search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}</div>
          <span className="text-xs text-muted-foreground">Showing <strong className="text-foreground">{filteredTools.length}</strong> of {tools.length} utilities</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar" aria-label="Utility categories">
          <button type="button" onClick={() => updateCategory('all')} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${category === 'all' ? 'bg-primary text-primary-foreground' : 'border border-border bg-muted text-secondary-foreground hover:bg-card'}`}>All Tools</button>
          {utilityCategoryDefinitions.map((definition) => <button key={definition.id} type="button" onClick={() => updateCategory(definition.id)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${category === definition.id ? 'bg-primary text-primary-foreground' : 'border border-border bg-muted text-secondary-foreground hover:bg-card'}`}>{definition.name}</button>)}
        </div>
      </div>

      {groupedTools.length > 0 ? groupedTools.map(({ definition, tools: groupTools }) => (
        <section key={definition.id} aria-labelledby={`utility-group-${definition.id}`} className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-4"><div><h2 id={`utility-group-${definition.id}`} className="text-xl font-bold text-foreground">{definition.name}</h2><p className="mt-1 text-xs text-muted-foreground">{definition.description}</p></div><span className="text-xs text-muted-foreground">{groupTools.length} {groupTools.length === 1 ? 'tool' : 'tools'}</span></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {groupTools.map((tool) => <Link key={tool.id} to={`/free-tools/${tool.slug}`} className="group relative flex flex-col justify-between rounded-lg border border-border bg-card/90 p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-xl hover:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
              <div><div className="mb-3 flex items-center justify-between gap-3"><span className="rounded border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">{definition.name}</span><span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-400"><Cpu className="h-3 w-3" />{tool.isClientSideOnly ? 'In browser' : 'Configured service'}</span></div><h3 className="mb-2 text-base font-bold tracking-tight text-foreground group-hover:text-primary">{tool.name}</h3><p className="mb-4 line-clamp-3 text-xs leading-relaxed text-secondary-foreground">{tool.tagline}</p></div>
              <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs"><span className="mr-2 truncate text-[11px] text-muted-foreground">{tool.outputFormat.split('&')[0]}</span><span className="flex shrink-0 items-center gap-1 font-medium text-primary group-hover:translate-x-1"><span>Launch</span><ArrowRight className="h-3.5 w-3.5" /></span></div>
            </Link>)}
          </div>
        </section>
      )) : <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground"><p>No Utility Tools match that search.</p><button type="button" onClick={resetSearchParams} className="mt-3 text-primary hover:underline">Clear filters</button></div>}
    </div>
  );
};
