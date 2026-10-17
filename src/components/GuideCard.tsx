import React from 'react';
import { Guide, BookmarkItem } from '../types';
import { Link } from '../router/Router';
import { BookmarkButton } from './BookmarkButton';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';

interface GuideCardProps {
  guide: Guide;
}

export const GuideCard: React.FC<GuideCardProps> = ({ guide }) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--card-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--card-y', `${e.clientY - rect.top}px`);
  };

  const bookmarkItem: BookmarkItem = {
    id: `guide-${guide.id}`,
    type: 'guide',
    slug: guide.slug,
    title: guide.title,
    subtitle: guide.summary,
    url: `/guides/${guide.slug}`,
    savedAt: new Date().toISOString(),
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col justify-between p-5 rounded-lg border border-border bg-card/90 hover:bg-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/30 min-h-[230px] focus-within:ring-2 focus-within:ring-primary/60 focus-within:border-primary/60"
    >
      {/* Decorative Interactive Spotlight Inner Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 -z-0"
        style={{
          background:
            'radial-gradient(280px circle at var(--card-x, 50%) var(--card-y, 50%), rgba(59, 130, 246, 0.12), transparent 80%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-primary/10 text-primary border border-primary/20">
            <BookOpen className="w-3 h-3" />
            <span className="capitalize">{guide.category.replace('-', ' ')}</span>
          </span>

          <BookmarkButton item={bookmarkItem} size="sm" />
        </div>

        <h3 className="font-bold text-foreground text-base tracking-tight mb-2 group-hover:text-primary transition-colors">
          <Link to={`/guides/${guide.slug}`} className="focus:outline-none focus:underline">
            {guide.title}
          </Link>
        </h3>

        <p className="text-sm text-secondary-foreground line-clamp-2 mb-3">
          {guide.summary}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {guide.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{guide.readTime}</span>
        </div>

        <Link
          to={`/guides/${guide.slug}`}
          className="inline-flex items-center gap-1 text-primary font-medium group-hover:translate-x-1 transition-transform"
        >
          <span>Read Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
