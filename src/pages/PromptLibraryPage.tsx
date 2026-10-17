import React, { useState } from 'react';
import { getAllPrompts } from '../services/aiCatalogService';
import { promptCategories } from '../data/promptsData';
import { PromptCard } from '../components/PromptCard';
import { EmptyState } from '../components/EmptyState';
import { MessageSquareCode, Search, X } from 'lucide-react';

export const PromptLibraryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const allPrompts = getAllPrompts();

  // Distinct target models in prompts
  const models = Array.from(new Set(allPrompts.map((p) => p.targetModel.split('/')[0].trim())));

  const filteredPrompts = allPrompts.filter((p) => {
    if (selectedCat && p.category !== selectedCat) return false;
    if (selectedModel && !p.targetModel.toLowerCase().includes(selectedModel.toLowerCase())) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchPrompt = p.promptText.toLowerCase().includes(q);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchPrompt || matchTags;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <MessageSquareCode className="w-4 h-4" />
          <span>Curated Prompt Recipes</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          AI Prompt Library & Creative Recipes
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl mb-6">
          High-performance prompt templates engineered for Midjourney v6, FLUX.1, Claude 3.5 Sonnet, ChatGPT o1, and Runway video models with instant one-click copy.
        </p>

        {/* Quick Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts by keyword, model, or use case..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <span className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{filteredPrompts.length}</strong> prompts
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
          <button
            type="button"
            onClick={() => setSelectedCat(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
              !selectedCat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/80 text-secondary-foreground hover:bg-muted border border-border/60'
            }`}
          >
            All Categories ({allPrompts.length})
          </button>
          {promptCategories.map((cat) => {
            const count = allPrompts.filter((p) => p.category === cat.slug).length;
            const isSelected = selectedCat === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(isSelected ? null : cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/80 text-secondary-foreground hover:bg-muted border border-border/60'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Model Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-muted-foreground font-medium shrink-0">Filter by Model:</span>
          <button
            type="button"
            onClick={() => setSelectedModel(null)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
              !selectedModel ? 'bg-muted text-foreground font-semibold border border-border' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Models
          </button>
          {models.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedModel(selectedModel === m ? null : m)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                selectedModel === m ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No prompts found matching "${search}".`}
          onReset={() => {
            setSearch('');
            setSelectedCat(null);
            setSelectedModel(null);
          }}
        />
      )}
    </div>
  );
};
