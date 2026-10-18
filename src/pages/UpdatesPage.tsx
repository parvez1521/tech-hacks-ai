import React from 'react';
import { updatesData } from '../data/updatesData';
import { Link } from '../router/Router';
import { BrandLogo } from '../components/BrandLogo';
import { Bell, Calendar, ArrowRight, Sparkles, BookOpen, Wrench, ShieldCheck } from 'lucide-react';

export const UpdatesPage: React.FC = () => {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'model-update':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Model Release
          </span>
        );
      case 'guide':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Tutorial
          </span>
        );
      case 'tool-release':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Tool Added
          </span>
        );
      case 'platform-news':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-primary/10 text-primary border border-primary/20">
            Platform News
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <Bell className="w-4 h-4" />
          <span>Changelog & Editorial Timeline</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Latest Platform & Model Updates
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl">
          Track newly cataloged foundation models, open-source releases, new guides, and browser utilities.
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {updatesData.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl border border-border bg-card/80 hover:bg-card transition-all shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                {getCategoryBadge(item.category)}
                <div className="flex items-center gap-1 text-muted-foreground font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
              </div>

              {item.link && (
                <Link
                  to={item.link}
                  className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            <div className="flex items-start gap-3 pt-1">
              {item.toolSlug && (
                <BrandLogo
                  slug={item.toolSlug}
                  name={item.title}
                  size="md"
                  className="mt-0.5"
                />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base text-foreground tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-secondary-foreground leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
