import React, { useState } from 'react';
import { proprietaryTools } from '../data/alternatives';
import { AlternativeCard } from '../components/AlternativeCard';
import { Replace, Search } from 'lucide-react';

export const AlternativesPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredAlternatives = proprietaryTools.filter((p) => {
    const q = search.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <Replace className="w-4 h-4" />
          <span>Proprietary Replacements</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Browse Open Source Software Alternatives
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl mb-6">
          Find self-hostable and community-maintained open-source replacements for the everyday SaaS and closed-source tools you rely on.
        </p>

        {/* Quick Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proprietary software (e.g. Notion, Airtable, Firebase)..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAlternatives.map((alt) => (
          <AlternativeCard key={alt.id} alternative={alt} />
        ))}
      </div>
    </div>
  );
};
