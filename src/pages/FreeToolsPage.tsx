import React from 'react';
import { getAllFreeTools } from '../services/aiCatalogService';
import { Link } from '../router/Router';
import { Wrench, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export const FreeToolsPage: React.FC = () => {
  const tools = getAllFreeTools();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <Wrench className="w-3.5 h-3.5 text-blue-600" />
          <span>Client-Side Utilities</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Free Browser-Based Utilities
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mb-6">
          Practical developer and design tools running 100% locally on your device. Zero server uploads, zero accounts, and complete privacy guaranteed.
        </p>

        {/* Security / Privacy Banner */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center gap-3 text-xs text-blue-950 mb-8">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <span>
            <strong className="font-semibold text-blue-900">Zero Telemetry & Local Execution:</strong> None of your files, images, or prompt payloads are transmitted over the network. Processing occurs exclusively in your browser via HTML5 Canvas and JavaScript Web APIs.
          </span>
        </div>
      </div>

      {/* Utilities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={`/free-tools/${tool.slug}`}
            className="group relative flex flex-col justify-between p-5 rounded-2xl border border-[#DFE7F3] bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-invary-card-hover shadow-invary-card transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:outline-none"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                  {tool.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-mono font-medium">
                  <Cpu className="w-3 h-3 text-emerald-600" />
                  <span>Client-Side</span>
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                {tool.name}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                {tool.tagline}
              </p>
            </div>

            <div className="pt-3 border-t border-[#DFE7F3] flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 truncate mr-2 font-mono">
                {tool.outputFormat.split('&')[0]}
              </span>
              <span className="text-blue-600 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                <span>Launch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
