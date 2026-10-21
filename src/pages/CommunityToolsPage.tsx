import React, { useEffect, useState } from 'react';
import { Link } from '../router/Router';
import { getAllCommunityTools } from '../services/aiCatalogService';
import { AiToolCard } from '../components/AiToolCard';
import { CommunityCallout } from '../components/CommunityCallout';
import { Users, ShieldCheck } from 'lucide-react';

export const CommunityToolsPage: React.FC = () => {
  const [tools, setTools] = useState(getAllCommunityTools);

  useEffect(() => {
    const refresh = () => setTools(getAllCommunityTools());
    window.addEventListener('techhacks:catalog-updated', refresh);
    return () => window.removeEventListener('techhacks:catalog-updated', refresh);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground">Home</Link><span>/</span><span className="font-medium text-foreground">Community Tools</span>
      </nav>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2"><Users className="w-4 h-4" /><span>Community Tools</span></div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">Community Tools</h1>
        <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-secondary-foreground">Browse tools submitted by the Tech Hacks AI community and published after editorial review. This directory is separate from the curated AI catalog and open-source software catalog.</p>
      </div>
      <div className="mb-8 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-secondary-foreground"><ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" /><span><strong>Editorial boundary:</strong> Published community records are verified before appearing here. A community submission does not automatically become an AI Tools record.</span></div>
      {tools.length > 0 ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{tools.map((tool) => <AiToolCard key={tool.id} tool={tool} routePrefix="/community-tools" />)}</div> : <div className="rounded-xl border border-dashed border-border p-10 text-center"><p className="text-sm text-muted-foreground">No published community tools are available yet.</p><Link to="/submit-tool" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover">Submit a community tool</Link></div>}
      <CommunityCallout type="tool" />
    </div>
  );
};
