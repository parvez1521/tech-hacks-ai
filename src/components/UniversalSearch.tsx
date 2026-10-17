import React, { useState, useRef, useEffect } from 'react';
import { useRouter, Link } from '../router/Router';
import { universalSearch, UniversalSearchResult } from '../services/aiCatalogService';
import { Search, X, Sparkles, FolderKanban, Replace, BookOpen, MessageSquareCode, Wrench, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const UniversalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { navigate } = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const results: UniversalSearchResult = universalSearch(query);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const intentChips = [
    { label: '🎬 Make AI videos', to: '/ai-tools?category=video' },
    { label: '🎨 Create images', to: '/ai-tools?category=image' },
    { label: '✍️ Find writing tools', to: '/ai-tools?category=writing' },
    { label: '💻 Build an app', to: '/tools?category=developer-tools' },
    { label: '⚡ Automate work', to: '/tools?category=developer-tools' },
    { label: '🎁 Free AI tools', to: '/free-ai-sites' },
    { label: '🔄 Replace proprietary SaaS', to: '/alternatives' },
    { label: '✨ Discover prompts', to: '/prompt-library' },
  ];

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto z-40" onKeyDown={handleKeyDown}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="w-5 h-5 text-muted-foreground absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.trim().length > 0);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          placeholder="Search 1,000+ AI tools, open source alternatives, guides, prompts, or utilities..."
          className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-xl bg-card/95 border border-border/80 text-foreground placeholder:text-muted-foreground text-sm sm:text-base shadow-lg shadow-black/20 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition-all duration-200"
          aria-label="Universal software and AI discovery search"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Grouped Search Results Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-card/95 backdrop-blur-xl border border-border p-4 shadow-2xl shadow-black/50 max-h-[75vh] overflow-y-auto no-scrollbar z-50 flex flex-col gap-4 animate-fade-in">
          {results.totalMatches === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              <p>No direct matches found for "{query}".</p>
              <div className="mt-3 flex justify-center gap-2">
                <Link
                  to={`/tools?q=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-md bg-muted text-foreground text-xs hover:bg-border"
                >
                  Search Open Source Catalog →
                </Link>
                <Link
                  to={`/ai-tools?q=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-md bg-muted text-foreground text-xs hover:bg-border"
                >
                  Search AI Directory →
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* AI Tools Matches */}
              {results.aiTools.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Tools</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.aiTools.map((tool) => (
                      <Link
                        key={tool.id}
                        to={`/ai-tools/${tool.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/70 transition-colors"
                      >
                        <BrandLogo
                          slug={tool.slug}
                          name={tool.name}
                          size="xs"
                          iconBgColor={tool.iconBgColor}
                          iconLetter={tool.iconLetter}
                          className="w-7 h-7"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">{tool.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{tool.tagline}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Open Source Tools Matches */}
              {results.openSourceTools.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                    <FolderKanban className="w-3.5 h-3.5" />
                    <span>Open Source Software</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.openSourceTools.map((tool) => (
                      <Link
                        key={tool.id}
                        to={`/tools/${tool.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/70 transition-colors"
                      >
                        <BrandLogo
                          slug={tool.slug}
                          name={tool.name}
                          size="xs"
                          iconBgColor={tool.iconBgColor}
                          iconLetter={tool.iconLetter}
                          className="w-7 h-7"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">{tool.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{tool.tagline}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Proprietary Alternatives Matches */}
              {results.proprietaryAlternatives.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                    <Replace className="w-3.5 h-3.5" />
                    <span>Proprietary Targets to Replace</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.proprietaryAlternatives.map((alt) => (
                      <Link
                        key={alt.id}
                        to={`/alternatives/${alt.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/70 transition-colors"
                      >
                        <BrandLogo
                          slug={alt.slug}
                          name={alt.name}
                          size="xs"
                          iconBgColor={alt.iconBgColor}
                          iconLetter={alt.iconLetter}
                          className="w-7 h-7"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">{alt.name}</p>
                          <p className="text-xs text-muted-foreground truncate">Explore open alternatives →</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Guides Matches */}
              {results.guides.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Tutorials & Guides</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {results.guides.map((g) => (
                      <Link
                        key={g.id}
                        to={`/guides/${g.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg hover:bg-muted/70 transition-colors flex items-center justify-between gap-2"
                      >
                        <span className="text-sm font-medium text-foreground truncate">{g.title}</span>
                        <span className="text-[11px] text-muted-foreground shrink-0">{g.readTime}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompts Matches */}
              {results.prompts.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
                    <MessageSquareCode className="w-3.5 h-3.5" />
                    <span>Prompts & Recipes</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {results.prompts.map((p) => (
                      <Link
                        key={p.id}
                        to={`/prompt-library/${p.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg hover:bg-muted/70 transition-colors flex items-center justify-between gap-2"
                      >
                        <span className="text-sm font-medium text-foreground truncate">{p.title}</span>
                        <span className="text-[11px] text-purple-400 shrink-0 font-mono">{p.targetModel}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Utilities Matches */}
              {results.utilities.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Browser Utilities</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {results.utilities.map((u) => (
                      <Link
                        key={u.id}
                        to={`/free-tools/${u.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg hover:bg-muted/70 transition-colors flex items-center justify-between gap-2"
                      >
                        <span className="text-sm font-medium text-foreground truncate">{u.name}</span>
                        <span className="text-[11px] text-muted-foreground shrink-0">Client-side 100%</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Quick Intent Chips */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {intentChips.map((chip) => (
          <Link
            key={chip.label}
            to={chip.to}
            className="px-3 py-1 rounded-full text-xs font-medium bg-card/80 border border-border/70 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-150 shadow-sm"
          >
            {chip.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
