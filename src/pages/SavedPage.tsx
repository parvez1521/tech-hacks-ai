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
        return <Sparkles className="w-3.5 h-3.5 text-blue-600" />;
      case 'open-source-tool':
        return <FolderKanban className="w-3.5 h-3.5 text-emerald-600" />;
      case 'guide':
        return <BookOpen className="w-3.5 h-3.5 text-blue-600" />;
      case 'prompt':
        return <MessageSquareCode className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Bookmark className="w-3.5 h-3.5 text-slate-500" />;
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
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3 font-mono">
          <Bookmark className="w-3.5 h-3.5 fill-blue-600/20" />
          <span>Personal Library</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Saved Tools &amp; Resources
            </h1>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Locally persisted in your browser via localStorage. Zero telemetry or account requirements.
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearBookmarks}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-white text-xs text-rose-600 hover:bg-rose-50 transition-colors self-start sm:self-auto font-medium shadow-xs cursor-pointer"
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
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-[#DFE7F3]'
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
        <div className="p-12 text-center rounded-2xl bg-white border border-[#DFE7F3] max-w-md mx-auto my-8 shadow-xs">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base mb-1">No Saved Items Yet</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Click the bookmark icon on any AI tool, open-source project, guide, or prompt to access it quickly here.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/ai-tools"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-md shadow-blue-600/20"
            >
              Explore AI Tools
            </Link>
            <Link
              to="/prompt-library"
              className="px-4 py-2 rounded-xl bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 border border-slate-300 shadow-xs"
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
              className="p-4 sm:p-5 rounded-2xl border border-[#DFE7F3] bg-white hover:border-blue-400 hover:shadow-invary-blue flex items-center justify-between gap-4 transition-all shadow-xs"
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
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-inner"
                    style={{ backgroundColor: item.iconBgColor || '#2563eb' }}
                  >
                    {item.iconLetter}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200">
                    {getTypeIcon(item.type)}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      to={item.url}
                      className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors truncate"
                    >
                      {item.title}
                    </Link>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase font-mono font-medium">
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={item.url}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => removeBookmark(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
