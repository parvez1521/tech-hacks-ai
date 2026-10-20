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
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Model Release
          </span>
        );
      case 'guide':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Tutorial
          </span>
        );
      case 'tool-release':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Tool Added
          </span>
        );
      case 'platform-news':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Platform News
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3 font-mono">
          <Bell className="w-3.5 h-3.5" />
          <span>Changelog &amp; Editorial Timeline</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Latest Platform &amp; Model Updates
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Track newly cataloged foundation models, open-source releases, new guides, and browser utilities.
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {updatesData.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl border border-[#DFE7F3] bg-white hover:border-blue-400 hover:shadow-invary-blue transition-all shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                {getCategoryBadge(item.category)}
                <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.date}</span>
                </div>
              </div>

              {item.link && (
                <Link
                  to={item.link}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-xs font-semibold"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            <div className="flex items-start gap-3.5 pt-1">
              {item.toolSlug && (
                <BrandLogo
                  slug={item.toolSlug}
                  name={item.title}
                  size="md"
                  className="mt-0.5"
                />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base text-slate-900 tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
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
