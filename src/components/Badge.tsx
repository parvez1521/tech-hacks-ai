import React from 'react';
import { BadgeCheck, Bot, Star, ArrowUpRight } from 'lucide-react';

export const VerifiedBadge: React.FC = () => (
  <span
    role="img"
    className="inline-flex items-center text-blue-600 cursor-help"
    title="Independently verified repository: source code, license, and repository status checked (October 2026 snapshot)"
    aria-label="Independently verified open source project"
  >
    <BadgeCheck className="w-4 h-4 fill-blue-600/20" />
  </span>
);

export const AiNativeBadge: React.FC = () => (
  <span
    role="img"
    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200"
    title="Core functionality built on AI models or LLM agent infrastructure"
    aria-label="AI-Native software"
  >
    <Bot className="w-3 h-3 text-blue-600" />
    <span>AI</span>
  </span>
);

export const LicenseBadge: React.FC<{ license: string }> = ({ license }) => (
  <span
    className="px-2 py-0.5 rounded text-xs font-mono bg-slate-50 text-slate-700 border border-slate-200"
    title={`Open source license: ${license}`}
  >
    {license}
  </span>
);

export const StarTrendBadge: React.FC<{ stars: number; delta?: number }> = ({ stars, delta }) => (
  <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-800 font-medium">
    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" aria-hidden="true" />
    <span>{stars.toLocaleString()}</span>
    {delta && delta > 0 ? (
      <span
        role="status"
        className="inline-flex items-center text-[10px] text-emerald-600 font-sans cursor-help font-semibold"
        title="Estimated 30-day star velocity (calculated from historical repository growth)"
        aria-label={`Estimated monthly velocity: plus ${delta} stars`}
      >
        ↑+{delta}
      </span>
    ) : null}
  </span>
);
