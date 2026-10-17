import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { getPromptBySlug, getAllPrompts } from '../services/aiCatalogService';
import { BookmarkButton } from '../components/BookmarkButton';
import { PromptCard } from '../components/PromptCard';
import { BookmarkItem } from '../types';
import { MessageSquareCode, Copy, Check, ArrowLeft, Lightbulb, Tag, ShieldCheck } from 'lucide-react';

export const PromptDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;
  const prompt = getPromptBySlug(slug);

  const [copied, setCopied] = useState(false);

  if (!prompt) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Prompt Not Found</h1>
        <p className="text-secondary-foreground mb-6">
          We couldn't find a prompt template matching "{slug}".
        </p>
        <Link
          to="/prompt-library"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Prompt Library</span>
        </Link>
      </div>
    );
  }

  const bookmarkItem: BookmarkItem = {
    id: `prompt-${prompt.id}`,
    type: 'prompt',
    slug: prompt.slug,
    title: prompt.title,
    subtitle: prompt.description,
    url: `/prompt-library/${prompt.slug}`,
    savedAt: new Date().toISOString(),
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedPrompts = getAllPrompts()
    .filter((p) => p.id !== prompt.id && p.category === prompt.category)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link to="/prompt-library" className="hover:text-foreground">Prompt Library</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">{prompt.title}</span>
      </nav>

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-xl border border-border bg-card/80 shadow-md mb-8">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {prompt.targetModel}
            </span>
            <span className="px-2.5 py-1 rounded text-xs font-medium bg-muted text-secondary-foreground border border-border capitalize">
              {prompt.category.replace('-', ' ')}
            </span>
          </div>

          <BookmarkButton item={bookmarkItem} size="md" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-3">
          {prompt.title}
        </h1>

        <p className="text-sm text-secondary-foreground leading-relaxed mb-6">
          {prompt.description}
        </p>

        {/* Prompt Container with Copy Button */}
        <div className="relative rounded-xl bg-muted/80 border border-border p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/50 pb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-foreground">
              Prompt Instructions
            </span>
            <span className="font-mono text-[11px]">{prompt.copyCount || 1000}+ copies</span>
          </div>

          <pre className="font-mono text-sm text-foreground whitespace-pre-wrap leading-relaxed select-all selection:bg-primary/20">
            "{prompt.promptText}"
          </pre>

          <button
            type="button"
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-150 active:scale-98 cursor-pointer shadow-md ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-primary text-primary-foreground hover:bg-primary-hover'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Prompt Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Full Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pro Tips & Parameters */}
      {prompt.tips && (
        <div className="p-5 rounded-xl border border-border bg-card/60 mb-8 flex items-start gap-3 text-xs leading-relaxed">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-foreground mb-1 text-sm">Optimization Tips & Parameters</h4>
            <p className="text-secondary-foreground">{prompt.tips}</p>
          </div>
        </div>
      )}

      {/* Tags & Keywords */}
      <div className="p-5 rounded-xl border border-border bg-card/60 mb-12">
        <h4 className="font-bold text-foreground mb-3 text-xs flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-primary" />
          <span>Associated Tags & Use Cases</span>
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.map((t) => (
            <Link
              key={t}
              to={`/prompt-library?q=${t}`}
              className="px-2 py-0.5 rounded text-xs bg-muted text-secondary-foreground hover:bg-border transition-colors"
            >
              #{t}
            </Link>
          ))}
        </div>
      </div>

      {/* Related Prompts */}
      {relatedPrompts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">
              More {prompt.category.replace('-', ' ')} Prompts
            </h2>
            <Link to="/prompt-library" className="text-xs text-primary hover:underline">
              View full library →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedPrompts.map((p) => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
