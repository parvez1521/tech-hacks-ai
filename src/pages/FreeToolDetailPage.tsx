import React from 'react';
import { useRouter, Link } from '../router/Router';
import { getFreeToolBySlug } from '../services/aiCatalogService';
import { UtilityRunner } from '../components/utilities/UtilityRunner';
import { Wrench, ShieldCheck, ArrowLeft, Cpu } from 'lucide-react';

export const FreeToolDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;
  const tool = getFreeToolBySlug(slug);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Utility Not Found</h1>
        <p className="text-secondary-foreground mb-6">
          We couldn't find a browser utility matching "{slug}".
        </p>
        <Link
          to="/free-tools"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Utilities</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
        <span className="text-slate-400">/</span>
        <Link to="/free-tools" className="hover:text-slate-900 transition-colors">Free Tools</Link>
        <span className="text-slate-400">/</span>
        <span className="text-blue-600 font-medium truncate max-w-[200px] sm:max-w-md">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card mb-8">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 capitalize">
              {tool.category}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 font-mono font-medium">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Client-Side</span>
            </span>
          </div>

          <Link
            to="/free-tools"
            className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>All Utilities</span>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {tool.name}
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {tool.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#DFE7F3] text-xs">
          <div>
            <span className="text-slate-500 block text-[11px] uppercase font-semibold">Accepted Input:</span>
            <span className="text-slate-900 font-medium">{tool.acceptedInput}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] uppercase font-semibold">Output Format:</span>
            <span className="text-slate-900 font-medium">{tool.outputFormat}</span>
          </div>
        </div>
      </div>

      {/* Interactive Tool Runner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card mb-8">
        <UtilityRunner utility={tool} />
      </div>

      {/* Privacy Guarantee Note */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 flex items-center gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong className="font-semibold text-emerald-900">Local Execution Guarantee:</strong> This utility processes data entirely within your local browser memory using Canvas / Web Workers. Your data is never uploaded to any remote server.
        </span>
      </div>
    </div>
  );
};
