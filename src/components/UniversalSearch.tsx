import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter, Link } from '../router/Router';
import { universalSearch, UniversalSearchResult } from '../services/aiCatalogService';
import { Search, X, Sparkles, FolderKanban, Replace, BookOpen, MessageSquareCode, Wrench } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const UniversalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const { navigate } = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  // Global Cmd+K / Ctrl+K keyboard shortcut to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const results: UniversalSearchResult = universalSearch(query);

  // Flatten searchable results for seamless arrow-key navigation
  const flatResults = useMemo(() => {
    const list: { id: string; name: string; url: string; group: string }[] = [];
    results.aiTools.forEach((t) =>
      list.push({ id: `ai-${t.id}`, name: t.name, url: `/ai-tools/${t.slug}`, group: 'AI Tools' })
    );
    results.openSourceTools.forEach((t) =>
      list.push({ id: `os-${t.id}`, name: t.name, url: `/tools/${t.slug}`, group: 'Open Source Software' })
    );
    results.proprietaryAlternatives.forEach((a) =>
      list.push({ id: `alt-${a.id}`, name: a.name, url: `/alternatives/${a.slug}`, group: 'Proprietary Targets' })
    );
    results.guides.forEach((g) =>
      list.push({ id: `guide-${g.id}`, name: g.title, url: `/guides/${g.slug}`, group: 'Tutorials & Guides' })
    );
    results.prompts.forEach((p) =>
      list.push({ id: `prompt-${p.id}`, name: p.title, url: `/prompt-library/${p.slug}`, group: 'Prompts & Recipes' })
    );
    results.utilities.forEach((u) =>
      list.push({ id: `util-${u.id}`, name: u.name, url: `/free-tools/${u.slug}`, group: 'Browser Utilities' })
    );
    return list;
  }, [results]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Auto-scroll selected item into view during arrow-key navigation
  useEffect(() => {
    if (selectedIndex >= 0 && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    if (!isOpen && query.trim() && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (flatResults.length === 0) return;
      setSelectedIndex((prev) => (prev < flatResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (flatResults.length === 0) return;
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedResult = selectedIndex >= 0 ? flatResults[selectedIndex] : undefined;
      if (selectedResult) {
        navigate(selectedResult.url);
      } else if (query.trim()) {
        // Submit broad or unmatched searches to the AI directory instead of doing nothing.
        navigate(`/ai-tools?q=${encodeURIComponent(query.trim())}`);
      }
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };


  // Helper to get index within flatResults for an item
  let flatCounter = 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto z-40" onKeyDown={handleKeyDown}>
      {/* Search is the strongest control in the directory shell; opaque surfaces keep results legible. */}
      <div className="relative flex items-center">
        <Search className="w-5 h-5 text-muted-foreground absolute left-4 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen && Boolean(query.trim())}
          aria-autocomplete="list"
          aria-controls="universal-search-results"
          aria-activedescendant={
            selectedIndex >= 0 && flatResults[selectedIndex] ? `search-item-${selectedIndex}` : undefined
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.trim().length > 0);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          placeholder="Search free AI tools, open-source alternatives, prompts, and utilities..."
          className="w-full pl-12 pr-14 py-3.5 sm:py-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/60 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.08)] transition-all duration-200"
          aria-label="Universal software and AI discovery search"
        />
        {query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/80 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="absolute right-4 hidden sm:flex items-center gap-1 pointer-events-none text-muted-foreground select-none">
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-muted/80 border border-border/80 text-muted-foreground shadow-xs">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      {/* Grouped results stay opaque so the directory remains easy to scan. */}
      {isOpen && query.trim() && (
        <div
          id="universal-search-results"
          role="listbox"
          aria-label="Universal search suggestions"
          className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-card border border-border p-3 sm:p-4 shadow-lg shadow-black/30 max-h-[75vh] overflow-y-auto no-scrollbar z-50 flex flex-col gap-4 animate-fade-in"
        >
          {results.totalMatches === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              <p>No direct matches found for "{query}".</p>
              <div className="mt-3 flex justify-center gap-2">
                <Link
                  to={`/tools?q=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-muted/80 text-foreground text-xs hover:bg-muted"
                >
                  Search Open Source Catalog →
                </Link>
                <Link
                  to={`/ai-tools?q=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-muted/80 text-foreground text-xs hover:bg-muted"
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
                    {results.aiTools.map((tool) => {
                      const itemIndex = flatCounter++;
                      const isSelected = selectedIndex === itemIndex;
                      return (
                        <Link
                          key={tool.id}
                          ref={isSelected ? activeItemRef : undefined}
                          id={`search-item-${itemIndex}`}
                          role="option"
                          aria-selected={isSelected}
                          to={`/ai-tools/${tool.slug}`}
                          onClick={() => {
                            setIsOpen(false);
                            setSelectedIndex(-1);
                          }}
                            className={`flex items-center gap-2.5 p-2 rounded-md transition-colors ${
                            isSelected
                              ? 'bg-primary/20 text-primary border border-primary/40 ring-1 ring-primary/40'
                              : 'hover:bg-muted/70 text-foreground'
                          }`}
                        >
                          <BrandLogo
                            slug={tool.slug}
                            name={tool.name}
                            size="xs"
                            iconBgColor={tool.iconBgColor}
                            iconLetter={tool.iconLetter}
                            className="w-7 h-7 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-sm truncate">{tool.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{tool.tagline}</p>
                          </div>
                        </Link>
                      );
                    })}
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
                    {results.openSourceTools.map((tool) => {
                      const itemIndex = flatCounter++;
                      const isSelected = selectedIndex === itemIndex;
                      return (
                        <Link
                          key={tool.id}
                          ref={isSelected ? activeItemRef : undefined}
                          id={`search-item-${itemIndex}`}
                          role="option"
                          aria-selected={isSelected}
                          to={`/tools/${tool.slug}`}
                          onClick={() => {
                            setIsOpen(false);
                            setSelectedIndex(-1);
                          }}
                            className={`flex items-center gap-2.5 p-2 rounded-md transition-colors ${
                            isSelected
                              ? 'bg-primary/20 text-primary border border-primary/40 ring-1 ring-primary/40'
                              : 'hover:bg-muted/70 text-foreground'
                          }`}
                        >
                          <BrandLogo
                            slug={tool.slug}
                            name={tool.name}
                            size="xs"
                            iconBgColor={tool.iconBgColor}
                            iconLetter={tool.iconLetter}
                            className="w-7 h-7 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-sm truncate">{tool.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{tool.tagline}</p>
                          </div>
                        </Link>
                      );
                    })}
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
                    {results.proprietaryAlternatives.map((alt) => {
                      const itemIndex = flatCounter++;
                      const isSelected = selectedIndex === itemIndex;
                      return (
                        <Link
                          key={alt.id}
                          ref={isSelected ? activeItemRef : undefined}
                          id={`search-item-${itemIndex}`}
                          role="option"
                          aria-selected={isSelected}
                          to={`/alternatives/${alt.slug}`}
                          onClick={() => {
                            setIsOpen(false);
                            setSelectedIndex(-1);
                          }}
                            className={`flex items-center gap-2.5 p-2 rounded-md transition-colors ${
                            isSelected
                              ? 'bg-primary/20 text-primary border border-primary/40 ring-1 ring-primary/40'
                              : 'hover:bg-muted/70 text-foreground'
                          }`}
                        >
                          <BrandLogo
                            slug={alt.slug}
                            name={alt.name}
                            size="xs"
                            iconBgColor={alt.iconBgColor}
                            iconLetter={alt.iconLetter}
                            className="w-7 h-7 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-sm truncate">{alt.name}</p>
                            <p className="text-xs text-muted-foreground truncate">Explore open alternatives →</p>
                          </div>
                        </Link>
                      );
                    })}
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
                    {results.guides.map((g) => {
                      const itemIndex = flatCounter++;
                      const isSelected = selectedIndex === itemIndex;
                      return (
                        <Link
                          key={g.id}
                          ref={isSelected ? activeItemRef : undefined}
                          id={`search-item-${itemIndex}`}
                          role="option"
                          aria-selected={isSelected}
                          to={`/guides/${g.slug}`}
                          onClick={() => {
                            setIsOpen(false);
                            setSelectedIndex(-1);
                          }}
                          className={`p-2 rounded-md transition-colors flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-primary/20 text-primary border border-primary/40 ring-1 ring-primary/40'
                              : 'hover:bg-muted/70 text-foreground'
                          }`}
                        >
                          <span className="text-sm font-medium truncate">{g.title}</span>
                          <span className="text-[11px] text-muted-foreground shrink-0">{g.readTime}</span>
                        </Link>
                      );
                    })}
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
                    {results.prompts.map((p) => {
                      const itemIndex = flatCounter++;
                      const isSelected = selectedIndex === itemIndex;
                      return (
                        <Link
                          key={p.id}
                          ref={isSelected ? activeItemRef : undefined}
                          id={`search-item-${itemIndex}`}
                          role="option"
                          aria-selected={isSelected}
                          to={`/prompt-library/${p.slug}`}
                          onClick={() => {
                            setIsOpen(false);
                            setSelectedIndex(-1);
                          }}
                          className={`p-2 rounded-md transition-colors flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-primary/20 text-primary border border-primary/40 ring-1 ring-primary/40'
                              : 'hover:bg-muted/70 text-foreground'
                          }`}
                        >
                          <span className="text-sm font-medium truncate">{p.title}</span>
                          <span className="text-[11px] text-purple-400 shrink-0 font-mono">{p.targetModel}</span>
                        </Link>
                      );
                    })}
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
                    {results.utilities.map((u) => {
                      const itemIndex = flatCounter++;
                      const isSelected = selectedIndex === itemIndex;
                      return (
                        <Link
                          key={u.id}
                          ref={isSelected ? activeItemRef : undefined}
                          id={`search-item-${itemIndex}`}
                          role="option"
                          aria-selected={isSelected}
                          to={`/free-tools/${u.slug}`}
                          onClick={() => {
                            setIsOpen(false);
                            setSelectedIndex(-1);
                          }}
                          className={`p-2 rounded-md transition-colors flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-primary/20 text-primary border border-primary/40 ring-1 ring-primary/40'
                              : 'hover:bg-muted/70 text-foreground'
                          }`}
                        >
                          <span className="text-sm font-medium truncate">{u.name}</span>
                          <span className="text-[11px] text-muted-foreground shrink-0">Client-side 100%</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

    </div>
  );
};
