import React, { useEffect, useMemo, useState } from 'react';
import { getAllPrompts } from '../services/aiCatalogService';
import { loadPromptFeedPrompts } from '../data/promptfeedPrompts';
import { fetchPromptCopyStats, fetchPublishedPrompts, getRecentlyViewedPrompts } from '../services/promptLibraryService';
import { getBookmarks, subscribeBookmarks } from '../services/bookmarkService';
import { promptCategories, promptProviders, type PromptCategoryDef } from '../data/promptsData';
import { PromptCard } from '../components/PromptCard';
import { EmptyState } from '../components/EmptyState';
import { Link } from '../router/Router';
import { PromptPreviewImage } from '../components/PromptPreviewImage';
import { Search, X, Sparkles, Filter, ArrowDownWideNarrow, ExternalLink, Heart } from 'lucide-react';

type PromptSort = 'featured' | 'trending' | 'recent' | 'title' | 'model';
type PromptCollection = 'all' | 'switchroute' | 'promptfeed';
const PROMPTS_PER_PAGE = 24;

export const PromptLibraryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => getBookmarks().map((item) => item.id));
  const [recentlyViewed, setRecentlyViewed] = useState(() => getRecentlyViewedPrompts());
  const [sort, setSort] = useState<PromptSort>('featured');
  const [selectedCollection, setSelectedCollection] = useState<PromptCollection>('all');
  const [page, setPage] = useState(1);
  const [feedLoadState, setFeedLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  const [allPrompts, setAllPrompts] = useState(() => getAllPrompts());
  const [databaseCategories, setDatabaseCategories] = useState<PromptCategoryDef[]>([]);

  useEffect(() => {
    let active = true;
    loadPromptFeedPrompts()
      .then((feedPrompts) => {
        if (!active) return;
        setAllPrompts((current) => {
          const merged = new Map(current.map((prompt) => [prompt.slug, prompt]));
          feedPrompts.forEach((prompt) => merged.set(prompt.slug, prompt));
          return [...merged.values()];
        });
        setFeedLoadState('ready');
      })
      .catch(() => { if (active) setFeedLoadState('error'); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    let active = true;
    fetchPublishedPrompts().then((remote) => {
      if (!active || remote.length === 0) return;
      setAllPrompts((current) => {
        const merged = new Map(current.map((prompt) => [prompt.slug, prompt]));
        remote.forEach((prompt) => merged.set(prompt.slug, { ...prompt, status: 'published' }));
        return [...merged.values()];
      });
    });
    return () => { active = false; };
  }, []);
  useEffect(() => subscribeBookmarks((items) => setFavoriteIds(items.map((item) => item.id))), []);
  useEffect(() => {
    let active = true;
    fetchPromptCopyStats().then((stats) => {
      if (!active || !stats.length) return;
      const counts = new Map(stats.map((item) => [item.slug, item.copyCount]));
      setAllPrompts((current) => current.map((prompt) => counts.has(prompt.slug) ? { ...prompt, copyCount: counts.get(prompt.slug) } : prompt));
    });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    let active = true;
    fetch('/api/prompt-categories').then((response) => response.ok ? response.json() : null).then((body) => {
      if (active && Array.isArray(body?.categories)) setDatabaseCategories(body.categories.map((category: { slug: string; name: string; description?: string }) => ({ id: category.slug, slug: category.slug, name: category.name, description: category.description || '' })));
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    allPrompts.forEach((prompt) => prompt.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
    return [...counts.entries()].filter(([tag]) => !['promptfeed', 'gpt-image-2', 'text-to-image'].includes(tag)).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 10).map(([tag]) => tag);
  }, [allPrompts]);
  const categories = useMemo(() => {
    const known = new Map([...promptCategories, ...databaseCategories].map((category) => [category.slug, category]));
    allPrompts.forEach((prompt) => {
      if (!known.has(prompt.category)) {
        const name = prompt.category.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        known.set(prompt.category, { id: prompt.category, name, slug: prompt.category, description: '' });
      }
    });
    return [...known.values()];
  }, [allPrompts, databaseCategories]);

  const filteredPrompts = useMemo(() => {
    const filtered = allPrompts.filter((p) => {
      const isPromptFeed = p.slug.startsWith('promptfeed-');
      if (selectedCollection === 'switchroute' && isPromptFeed) return false;
      if (selectedCollection === 'promptfeed' && !isPromptFeed) return false;
      if (selectedCat && p.category !== selectedCat) return false;
      if (selectedTag && !p.tags.includes(selectedTag)) return false;
      if (selectedProvider) {
        const q = selectedProvider.toLowerCase();
        if (!p.provider?.toLowerCase().includes(q) && !p.targetModel.toLowerCase().includes(q) && !p.tags.some((t) => t.toLowerCase().includes(q))) return false;
      }
      if (selectedStyle && p.visualStyle !== selectedStyle) return false;
      if (selectedAspectRatio && p.aspectRatio !== selectedAspectRatio) return false;
      if (selectedMediaType && (p.mediaType || 'image') !== selectedMediaType) return false;
      if (showFavorites && !favoriteIds.includes(`prompt-${p.id}`)) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        return [p.title, p.description, p.promptText, p.targetModel, p.provider || '', p.visualStyle || '', p.aspectRatio || '', p.authorOrSource || '', p.sourceCreator || '', p.sourceUrl || '', p.attributionUrl || '', ...(p.tags || []), ...(p.placeholders || [])]
          .some((value) => value.toLowerCase().includes(q));
      }
      return true;
    });
    if (sort === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'model') filtered.sort((a, b) => a.targetModel.localeCompare(b.targetModel) || a.title.localeCompare(b.title));
    if (sort === 'trending') filtered.sort((a, b) => (b.copyCount ?? -1) - (a.copyCount ?? -1) || a.title.localeCompare(b.title));
    if (sort === 'recent') filtered.sort((a, b) => (Date.parse(b.createdAt || '') || -1) - (Date.parse(a.createdAt || '') || -1) || a.title.localeCompare(b.title));
    if (sort === 'featured') filtered.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (b.featuredOrder ?? Number.MAX_SAFE_INTEGER) || a.title.localeCompare(b.title));
    return filtered;
  }, [allPrompts, search, selectedCat, selectedProvider, selectedTag, selectedStyle, selectedAspectRatio, selectedMediaType, showFavorites, favoriteIds, selectedCollection, sort]);

  useEffect(() => { setPage(1); }, [search, selectedCat, selectedProvider, selectedTag, selectedStyle, selectedAspectRatio, selectedMediaType, showFavorites, selectedCollection, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredPrompts.length / PROMPTS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const visiblePrompts = filteredPrompts.slice((currentPage - 1) * PROMPTS_PER_PAGE, currentPage * PROMPTS_PER_PAGE);
  const promptFeedCount = allPrompts.filter((prompt) => prompt.slug.startsWith('promptfeed-')).length;
  const switchRouteCount = allPrompts.length - promptFeedCount;

  const resetFilters = () => {
    setSearch(''); setSelectedCat(null); setSelectedProvider(null); setSelectedTag(null); setSelectedStyle(''); setSelectedAspectRatio(''); setSelectedMediaType(''); setShowFavorites(false); setSelectedCollection('all'); setSort('featured'); setPage(1);
  };

  return (
    <main className="prompt-atlas max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <section className="prompt-atlas__intro mb-8 sm:mb-10" aria-labelledby="prompt-library-title">
        <div className="prompt-atlas__heading">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-900 dark:border-teal-900 dark:bg-teal-950/60 dark:text-teal-200">
            <Heart className="w-4 h-4" aria-hidden="true" /> Ready-to-use prompts, paired with previews
          </div>
          <h1 id="prompt-library-title" className="mt-5 max-w-3xl text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">Find a prompt. Make it yours.</h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-300">Explore 48 SwitchRoute originals and 534 image-matched prompts from the MIT-licensed PromptFeed collection. Preview the result, personalize variables, and copy the full prompt in one click.</p>
        </div>
        <div className="prompt-atlas__art" aria-hidden="true">
          <img src="/prompts/generated/portrait-editorial-duo.webp" alt="" width="1536" height="1024" fetchpriority="high" decoding="async" />
          <div className="prompt-atlas__art-note"><Sparkles size={15} /> Original portrait study</div>
        </div>
      </section>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-500 dark:text-slate-400">Trending uses recorded copy actions. Recently added uses publication timestamps when available.</p><Link to="/submit-prompt" className="inline-flex items-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">Submit a prompt</Link></div>

      <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between" aria-label="Prompt collection sources">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-bold text-slate-900 dark:text-white">PromptFeed collection</h2><span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">MIT licensed</span></div>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600 dark:text-slate-300">{feedLoadState === 'loading' ? 'Loading the 534 matched image + prompt pairs…' : feedLoadState === 'error' ? 'The licensed collection could not be loaded. SwitchRoute originals are still available.' : `${promptFeedCount} image-matched prompt pairs loaded. Source attribution and license details are preserved on each prompt page.`}</p>
        </div>
        <a href="https://github.com/ClawLabsAI/awesome-verified-text-to-image-prompts" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 hover:border-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-600 dark:text-slate-100">View source &amp; license <ExternalLink size={14} aria-hidden="true" /></a>
      </section>

      <section className="prompt-atlas__controls" aria-label="Search and filter prompts">
        <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by collection">
          <span className="mr-1 text-xs font-semibold text-slate-600 dark:text-slate-300">Collection</span>
          {([
            { value: 'all', label: 'All prompts', count: allPrompts.length },
            { value: 'switchroute', label: 'SwitchRoute originals', count: switchRouteCount },
            { value: 'promptfeed', label: 'PromptFeed · MIT', count: promptFeedCount },
          ] as const).map((collection) => <button key={collection.value} type="button" aria-pressed={selectedCollection === collection.value} onClick={() => setSelectedCollection(collection.value)} className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${selectedCollection === collection.value ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'border border-slate-200 bg-white text-slate-700 hover:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}>{collection.label} <span className="ml-1 opacity-70">{collection.count}</span></button>)}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="relative block flex-1">
            <span className="sr-only">Search prompt recipes</span>
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search prompts, models, styles, or tags" className="w-full h-12 pl-10 pr-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500" />
            {search && <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500" aria-label="Clear search"><X className="w-4 h-4" /></button>}
          </label>
          <label className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <ArrowDownWideNarrow size={16} aria-hidden="true" />
            <span className="sr-only">Sort prompts</span>
            <select aria-label="Sort prompts" value={sort} onChange={(e) => setSort(e.target.value as PromptSort)} className="bg-transparent text-slate-900 dark:text-white focus-visible:outline-none">
              <option value="featured">Curated order</option><option value="trending">Most copied</option><option value="recent">Recently added</option><option value="title">Title A–Z</option><option value="model">Model</option>
            </select>
          </label>
          <p aria-live="polite" className="text-sm text-slate-500 sm:min-w-[130px] sm:text-right">{filteredPrompts.length} {filteredPrompts.length === 1 ? 'recipe' : 'recipes'}</p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-4">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Visual style<select aria-label="Filter by visual style" value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"><option value="">All styles</option>{[...new Set(allPrompts.map((prompt) => prompt.visualStyle).filter(Boolean))].sort().map((style) => <option key={style} value={style}>{style}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Aspect ratio<select aria-label="Filter by aspect ratio" value={selectedAspectRatio} onChange={(e) => setSelectedAspectRatio(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"><option value="">All ratios</option>{[...new Set(allPrompts.map((prompt) => prompt.aspectRatio).filter(Boolean))].sort().map((ratio) => <option key={ratio} value={ratio}>{ratio}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Media type<select aria-label="Filter by media type" value={selectedMediaType} onChange={(e) => setSelectedMediaType(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"><option value="">Images and video prompts</option><option value="image">Image prompts</option><option value="video">Video prompts</option></select></label>
          <button type="button" aria-pressed={showFavorites} onClick={() => setShowFavorites(!showFavorites)} className={`mt-4 h-10 rounded-lg border px-3 text-sm font-semibold sm:mt-5 ${showFavorites ? 'border-rose-400 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}>♡ Saved prompts</button>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300"><Sparkles size={14} aria-hidden="true" /> Explore by model</div>
          <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by model or provider">
            {promptProviders.map((prov) => {
              const active = (!prov.filterValue && !selectedProvider) || selectedProvider === prov.filterValue;
              return <button key={prov.id} type="button" aria-pressed={active} onClick={() => setSelectedProvider(prov.filterValue)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${active ? 'bg-teal-800 text-white dark:bg-teal-300 dark:text-slate-950' : 'border border-slate-200 bg-white text-slate-700 hover:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}>{prov.name}</button>;
            })}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300"><Filter size={14} aria-hidden="true" /> Browse a category</div>
          <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
            <button type="button" aria-pressed={!selectedCat} onClick={() => setSelectedCat(null)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${!selectedCat ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}>Everything <span className="ml-1 opacity-70">{allPrompts.length}</span></button>
            {categories.map((cat) => {
              const count = allPrompts.filter((p) => p.category === cat.slug).length;
              return <button key={cat.id} type="button" aria-pressed={selectedCat === cat.slug} onClick={() => setSelectedCat(selectedCat === cat.slug ? null : cat.slug)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${selectedCat === cat.slug ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}>{cat.name} <span className="ml-1 opacity-65">{count}</span></button>;
            })}
          </div>
        </div>

        {(!selectedCat || selectedCat === 'human-portraits') && <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter portrait subcategories"><span className="mr-1 text-xs font-semibold text-slate-600 dark:text-slate-300">Portrait collections</span>{['featured-human-portraits', 'womens-portraits', 'mens-portraits', 'couple-portraits', 'professional-headshots', 'cinematic-portraits', 'fashion-editorial', 'street-style-lifestyle', 'full-body-poses', 'character-consistency'].filter((tag) => allPrompts.some((prompt) => prompt.tags.includes(tag))).map((tag) => { const count = allPrompts.filter((prompt) => prompt.tags.includes(tag)).length; return <button key={tag} type="button" aria-pressed={selectedTag === tag} onClick={() => setSelectedTag(selectedTag === tag ? null : tag)} className={`rounded-lg px-2.5 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${selectedTag === tag ? 'bg-teal-800 text-white dark:bg-teal-300 dark:text-slate-950' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'}`}>{tag.replace(/-/g, ' ')} <span className="ml-1 opacity-70">{count}</span></button>; })}</div>}

        {popularTags.length > 0 && <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Popular tags"><span className="mr-1 text-xs font-semibold text-slate-600 dark:text-slate-300">Popular tags</span>{popularTags.map((tag) => <button key={tag} type="button" aria-pressed={selectedTag === tag} onClick={() => setSelectedTag(selectedTag === tag ? null : tag)} className={`rounded-lg px-2.5 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${selectedTag === tag ? 'bg-teal-800 text-white dark:bg-teal-300 dark:text-slate-950' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}>#{tag}</button>)}</div>}
      </section>

      <div className="mb-4 mt-8 flex items-end justify-between gap-4">
        <div><h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">Prompt gallery</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Browse matching previews, keep useful prompts saved, or copy a full prompt directly.</p></div>
        {(selectedCat || selectedProvider || selectedTag || selectedStyle || selectedAspectRatio || selectedMediaType || showFavorites || search) && <button type="button" onClick={resetFilters} className="text-xs font-semibold text-teal-800 underline underline-offset-4 dark:text-teal-300">Clear filters</button>}
      </div>

      {recentlyViewed.length > 0 && <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900" aria-label="Recently viewed prompts"><h2 className="text-sm font-bold text-slate-900 dark:text-white">Recently viewed</h2><div className="mt-3 flex gap-3 overflow-x-auto pb-1">{recentlyViewed.map((item) => <Link key={item.slug} to={`/prompt-library/${item.slug}`} className="flex w-52 shrink-0 items-center gap-3 rounded-xl border border-slate-200 p-2 hover:border-teal-500 dark:border-slate-700"><PromptPreviewImage src={item.previewImage} alt={`${item.title} preview`} className="h-14 w-14 shrink-0 rounded-lg bg-slate-100 object-cover" /><span className="line-clamp-2 text-xs font-semibold">{item.title}</span></Link>)}</div></section>}

      {filteredPrompts.length > 0 ? <>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400"><span>Showing {(currentPage - 1) * PROMPTS_PER_PAGE + 1}–{Math.min(currentPage * PROMPTS_PER_PAGE, filteredPrompts.length)} of {filteredPrompts.length} prompts</span><span>Page {currentPage} of {pageCount}</span></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{visiblePrompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} />)}</div>
        {pageCount > 1 && <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Prompt gallery pagination">
          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage <= 1} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" aria-label="Previous prompt page">Previous</button>
          <span aria-live="polite" className="min-w-[5rem] text-center text-sm font-medium text-slate-600 dark:text-slate-300">{currentPage} / {pageCount}</span>
          <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage >= pageCount} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" aria-label="Next prompt page">Next</button>
        </nav>}
      </> : <EmptyState title="No recipes match those filters." onReset={resetFilters} />}
    </main>
  );
};
