import React from 'react';
import { Guide, BookmarkItem } from '../types';
import { Link } from '../router/Router';
import { BookmarkButton } from './BookmarkButton';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';

interface GuideCardProps {
  guide: Guide;
}

export const GuideCard: React.FC<GuideCardProps> = ({ guide }) => {
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
      className="group relative flex flex-col justify-between p-5 rounded-2xl border border-[#DFE7F3] bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-400 hover:shadow-invary-blue min-h-[230px] shadow-xs focus-within:ring-2 focus-within:ring-blue-500/60 focus-within:border-blue-500/60"
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <BookOpen className="w-3 h-3 text-blue-600" />
            <span className="capitalize">{guide.category.replace('-', ' ')}</span>
          </span>

          <BookmarkButton item={bookmarkItem} size="sm" />
        </div>

        <h2 className="font-bold text-slate-900 text-base tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
          <Link to={`/guides/${guide.slug}`} className="focus:outline-none focus:underline">
            {guide.title}
          </Link>
        </h2>

        <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {guide.summary}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {guide.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 pt-3 border-t border-[#DFE7F3] flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{guide.readTime}</span>
        </div>

        <Link
          to={`/guides/${guide.slug}`}
          className="inline-flex items-center gap-1 text-blue-800 dark:text-blue-300 font-semibold hover:text-blue-900 dark:hover:text-blue-200 group-hover:translate-x-1 transition-transform"
        >
          <span>Read Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
