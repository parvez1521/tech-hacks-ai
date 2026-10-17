import React from 'react';
import { Link } from '../router/Router';
import { Sparkles, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center max-w-4xl mx-auto px-4">
      {/* Background Gradient Bloom */}
      <div className="absolute inset-0 -top-20 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[300px] bg-primary/10 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Top Pill Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Curated Open Source Software Directory</span>
      </div>

      {/* H1 Headline */}
      <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight max-w-2xl mx-auto leading-tight sm:leading-none mb-4">
        Open Source Alternatives to Popular Software
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-secondary-foreground max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
        Over 1 million users replaced their proprietary tools with reliable open source software. Save money, prevent vendor lock-in, and own your data.
      </p>

      {/* Sponsors & Partners Ribbon */}
      <div className="pt-6 border-t border-border/50 max-w-3xl mx-auto">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4 font-medium flex items-center justify-center gap-1.5">
          <HeartHandshake className="w-3.5 h-3.5 text-primary" />
          <span>Supported by awesome open-source builders and sponsors</span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-foreground">Postiz</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-foreground">Supabase</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-foreground">Firecrawl</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-foreground">Novu</span>
          </div>
        </div>
      </div>
    </section>
  );
};
