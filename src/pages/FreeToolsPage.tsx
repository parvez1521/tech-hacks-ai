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
        <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Wrench className="w-4 h-4" />
          <span>Client-Side Utilities</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Free Browser-Based Utilities
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl mb-6">
          Practical developer and design tools running 100% locally on your device. Zero server uploads, zero accounts, and complete privacy guaranteed.
        </p>

        {/* Security / Privacy Banner */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3 text-xs text-secondary-foreground mb-8">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
          <span>
            <strong>Zero Telemetry & Local Execution:</strong> None of your files, images, or prompt payloads are transmitted over the network. Processing occurs exclusively in your browser via HTML5 Canvas and JavaScript Web APIs.
          </span>
        </div>
      </div>

      {/* Utilities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={`/free-tools/${tool.slug}`}
            className="group relative flex flex-col justify-between p-5 rounded-lg border border-border bg-card/90 hover:bg-card hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-muted text-secondary-foreground border border-border capitalize">
                  {tool.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                  <Cpu className="w-3 h-3" />
                  <span>Client-Side</span>
                </span>
              </div>

              <h3 className="font-bold text-foreground text-base tracking-tight mb-2 group-hover:text-primary transition-colors">
                {tool.name}
              </h3>

              <p className="text-xs text-secondary-foreground line-clamp-3 mb-4 leading-relaxed">
                {tool.tagline}
              </p>
            </div>

            <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
              <span className="text-[11px] text-muted-foreground truncate mr-2">
                {tool.outputFormat.split('&')[0]}
              </span>
              <span className="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
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
