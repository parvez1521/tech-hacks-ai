import React, { useState, useEffect } from 'react';
import { getBookmarks, removeBookmark, clearBookmarks, subscribeBookmarks } from '../services/bookmarkService';
import { BookmarkItem } from '../types';
import { Link } from '../router/Router';
import { Bookmark, Trash2, ExternalLink, ArrowRight, Sparkles, BookOpen, MessageSquareCode, FolderKanban } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

export const SavedPage: React.FC = () => {
  const [items, setItems] = useState<BookmarkItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    setItems(getBookmarks());
    const unsubscribe = subscribeBookmarks((updated) => {
      setItems(updated);
    });
    return unsubscribe;
  }, []);

  const filteredItems = items.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai-tool':
        return <Sparkles className="w-3.5 h-3.5 text-primary" />;
      case 'open-source-tool':
        return <FolderKanban className="w-3.5 h-3.5 text-emerald-400" />;
      case 'guide':
        return <BookOpen className="w-3.5 h-3.5 text-blue-400" />;
      case 'prompt':
        return <MessageSquareCode className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ai-tool':
        return 'AI Tool';
      case 'open-source-tool':
        return 'Open Source';
      case 'guide':
        return 'Guide';
      case 'prompt':
        return 'Prompt';
      default:
        return 'Saved';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <Bookmark className="w-4 h-4 fill-primary/20" />
          <span>Personal Library</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Saved Tools & Resources
            </h1>
            <p className="text-sm text-secondary-foreground mt-1">
              Locally persisted in your browser via localStorage. Zero telemetry or account requirements.
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearBookmarks}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-rose-400 hover:bg-rose-500/10 transition-colors self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        {items.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-6">
            {['all', 'ai-tool', 'open-source-tool', 'guide', 'prompt'].map((t) => {
              const count = t === 'all' ? items.length : items.filter((i) => i.type === t).length;
              if (t !== 'all' && count === 0) return null;
              const isSelected = filterType === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/80 text-secondary-foreground hover:bg-muted border border-border/60'
                  }`}
                >
                  {t === 'all' ? 'All Items' : getTypeLabel(t)} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Items List or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-card/60 border border-border max-w-md mx-auto my-8">
          <Bookmark className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="font-bold text-foreground text-base mb-1">No Saved Items Yet</h3>
          <p className="text-xs text-secondary-foreground mb-6">
            Click the bookmark icon on any AI tool, open-source project, guide, or prompt to access it quickly here.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/ai-tools"
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-sm"
            >
              Explore AI Tools
            </Link>
            <Link
              to="/prompt-library"
              className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-semibold hover:bg-border"
            >
              Browse Prompts
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-border bg-card/80 hover:bg-card flex items-center justify-between gap-4 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.slug && (item.type === 'open-source-tool' || item.type === 'ai-tool') ? (
                  <BrandLogo
                    slug={item.slug}
                    name={item.title}
                    size="sm"
                    iconBgColor={item.iconBgColor}
                    iconLetter={item.iconLetter}
                    className="w-8 h-8"
                  />
                ) : item.iconLetter ? (
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-inner"
                    style={{ backgroundColor: item.iconBgColor || '#3b82f6' }}
                  >
                    {item.iconLetter}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border">
                    {getTypeIcon(item.type)}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      to={item.url}
                      className="font-bold text-sm text-foreground hover:text-primary transition-colors truncate"
                    >
                      {item.title}
                    </Link>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50 uppercase font-mono">
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={item.url}
                  className="px-2.5 py-1 rounded bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => removeBookmark(item.id)}
                  className="p-1.5 rounded text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  aria-label={`Remove ${item.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
