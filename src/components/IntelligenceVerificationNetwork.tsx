import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Database,
  Lock,
  Activity,
  Sparkles,
} from 'lucide-react';

interface VerificationNode {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'syncing' | 'verified';
  metric: string;
  metricLabel: string;
  icon: React.FC<{ className?: string }>;
  tag: string;
}

export const IntelligenceVerificationNetwork: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>('node-1');

  const nodes: VerificationNode[] = [
    {
      id: 'node-1',
      title: 'Foundation Model Registry',
      category: 'Inference Benchmarks',
      status: 'verified',
      metric: '99.98%',
      metricLabel: 'Attestation Uptime',
      icon: Cpu,
      tag: 'Live Telemetry',
    },
    {
      id: 'node-2',
      title: 'Open Source Security Scan',
      category: 'License & Vulnerabilities',
      status: 'verified',
      metric: 'Zero-CVE',
      metricLabel: 'Permissive Verified',
      icon: Lock,
      tag: 'Weekly Automated',
    },
    {
      id: 'node-3',
      title: 'Local AI & Self-Hosting',
      category: 'Hardware Feasibility',
      status: 'verified',
      metric: '<16GB',
      metricLabel: 'VRAM Profiling',
      icon: Database,
      tag: 'Ollama & vLLM',
    },
    {
      id: 'node-4',
      title: 'Pricing & Free Tier Audit',
      category: 'Quota Provenance',
      status: 'active',
      metric: 'Real-Time',
      metricLabel: 'Plan Validation',
      icon: Activity,
      tag: 'Continuous Scan',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-8 p-6 sm:p-8 rounded-2xl bg-white border border-[#DFE7F3] shadow-sm relative overflow-hidden">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#DFE7F3] relative z-10">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Continuous AI Verification Mesh</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Independent Catalog Attestation Engine</span>
            <Sparkles className="w-4 h-4 text-blue-600 hidden sm:inline" />
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            Every tool, model, and open-source repository is continuously measured for safety, latency, and pricing accuracy.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin [animation-duration:12s]" />
            <span className="text-slate-700 font-medium">1,250+ Audited Assets</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Operational</span>
          </div>
        </div>
      </div>

      {/* Interactive Verification Mesh Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {nodes.map((node) => {
          const Icon = node.icon;
          const isActive = activeNode === node.id;

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setActiveNode(node.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer relative shadow-xs ${
                isActive
                  ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                  : 'bg-slate-50/60 border-slate-200 hover:border-blue-300 hover:bg-white'
              }`}
            >
              {/* Top Row: Icon & Tag */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {node.tag}
                </span>
              </div>

              {/* Title & Category */}
              <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                {node.title}
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">{node.category}</p>

              {/* Metric Card */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-blue-600">{node.metric}</span>
                <span className="text-[10px] text-slate-500">{node.metricLabel}</span>
              </div>

              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute -bottom-px left-4 right-4 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Technical Telemetry Flow Bar */}
      <div className="mt-5 pt-4 border-t border-[#DFE7F3] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 relative z-10">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <strong className="text-slate-800 font-semibold">Continuous Attestation:</strong> 24/7 Verified
          </span>
          <span className="hidden md:inline text-slate-300">•</span>
          <span className="hidden md:flex items-center gap-1.5">
            <strong className="text-slate-800 font-semibold">Provenance:</strong> Cryptographic Hash Verification
          </span>
        </div>
        <div className="text-[11px] text-slate-600 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Audited by Tech Hacks Editorial Engineering</span>
        </div>
      </div>
    </div>
  );
};
