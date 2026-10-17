import React from 'react';
import { BadgeCheck, Bot, Star, ArrowUpRight } from 'lucide-react';

export const VerifiedBadge: React.FC = () => (
  <span
    className="inline-flex items-center text-amber-500 cursor-help"
    title="Independently verified repository: source code, license, and repository status checked (October 2026 snapshot)"
    aria-label="Independently verified open source project"
  >
    <BadgeCheck className="w-4 h-4 fill-amber-500/20" />
  </span>
);

export const AiNativeBadge: React.FC = () => (
  <span
    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"
    title="Core functionality built on AI models or LLM agent infrastructure"
    aria-label="AI-Native software"
  >
    <Bot className="w-3 h-3" />
    <span>AI</span>
  </span>
);

export const LicenseBadge: React.FC<{ license: string }> = ({ license }) => (
  <span
    className="px-1.5 py-0.5 rounded text-xs font-mono bg-muted text-muted-foreground border border-border"
    title={`Open source license: ${license}`}
  >
    {license}
  </span>
);

export const StarTrendBadge: React.FC<{ stars: number; delta?: number }> = ({ stars, delta }) => (
  <span className="inline-flex items-center gap-1 font-mono text-xs text-foreground font-medium">
    <Star className="w-3.5 h-3.5 text-muted-foreground fill-muted-foreground/30" aria-hidden="true" />
    <span>{stars.toLocaleString()}</span>
    {delta && delta > 0 ? (
      <span
        className="inline-flex items-center text-[10px] text-emerald-400 font-sans cursor-help"
        title="Estimated 30-day star velocity (calculated from historical repository growth)"
        aria-label={`Estimated monthly velocity: plus ${delta} stars`}
      >
        ↑+{delta}
      </span>
    ) : null}
  </span>
);
