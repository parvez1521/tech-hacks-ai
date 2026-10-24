import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Command, Search } from 'lucide-react';
import { Link } from '../router/Router';
import { getAllAiTools, isCommunityTool } from '../services/aiCatalogService';
import { BrandLogo } from './BrandLogo';

type DiscoveryMode = 'Coding' | 'Video' | 'Design';

const modeCategories: Record<DiscoveryMode, string> = {
  Coding: 'coding',
  Video: 'video',
  Design: 'image',
};

const sampleQueries: Record<DiscoveryMode, string> = {
  Coding: 'code editor',
  Video: 'text to video',
  Design: 'image generation',
};

/** A live, compact slice of the AI directory to make discovery tangible. */
export const HeroSignalVisual: React.FC = () => {
  const [activeMode, setActiveMode] = useState<DiscoveryMode>('Coding');
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const normalizedQuery = normalize(query);
    return getAllAiTools()
      .filter((tool) => !isCommunityTool(tool) && tool.category.toLowerCase() === modeCategories[activeMode])
      .filter((tool) => {
        if (!normalizedQuery) return true;
        const searchableText = [tool.name, tool.tagline, tool.description, tool.category, tool.bestFor, ...(tool.tags || []), ...(tool.features || []), ...(tool.useCases || [])]
          .filter(Boolean)
          .join(' ')
        return normalize(searchableText).includes(normalizedQuery);
      })
      .slice(0, 3);
  }, [activeMode, query]);

  const applySampleQuery = (mode: DiscoveryMode) => {
    setActiveMode(mode);
    setQuery(sampleQueries[mode]);
  };

  return (
    <div className="discovery-interface" aria-label="Explore real tools in the SwitchRoute catalog">
      <div className="discovery-interface__chrome" aria-hidden="true">
        <span /> <span /> <span />
        <div className="discovery-interface__address"><Command size={12} /> switchroute / discover</div>
      </div>

      <div className="discovery-interface__body">
        <div className="discovery-interface__topline">
          <div>
            <p className="discovery-interface__overline">Find a tool for the task</p>
            <h2>Start with what you need to do.</h2>
          </div>
          <span className="discovery-interface__index" aria-hidden="true">LIVE CATALOG</span>
        </div>

        <label className="discovery-interface__search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search {activeMode.toLowerCase()} tools</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${activeMode.toLowerCase()} tools…`}
            aria-label={`Search ${activeMode.toLowerCase()} tools`}
          />
        </label>

        <div className="discovery-interface__tabs" aria-label="Filter tools by category">
          {(Object.keys(modeCategories) as DiscoveryMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={activeMode === mode}
              onClick={() => { setActiveMode(mode); setQuery(''); }}
            >
              {mode}
              {activeMode === mode && <span className="discovery-interface__tab-indicator" aria-hidden="true" />}
            </button>
          ))}
        </div>

        <div className="discovery-interface__samples" aria-label="Try a sample search">
          <span>Try:</span>
          {(Object.keys(sampleQueries) as DiscoveryMode[]).map((mode) => (
            <button key={mode} type="button" onClick={() => applySampleQuery(mode)}>
              {sampleQueries[mode]}
            </button>
          ))}
        </div>

        <div className="discovery-interface__results" aria-live="polite" aria-relevant="additions text">
          {results.length ? results.map((tool) => (
            <Link
              className="discovery-interface__result"
              key={tool.slug}
              to={`/ai-tools/${tool.slug}`}
              aria-label={`${tool.name}: ${tool.tagline}. View tool details`}
            >
              <BrandLogo slug={tool.slug} name={tool.name} size="md" />
              <span className="discovery-interface__result-copy">
                <strong>{tool.name}</strong>
                <span>{tool.tagline}</span>
              </span>
              <span className="discovery-interface__result-action" aria-hidden="true">
                <ArrowUpRight size={15} />
              </span>
            </Link>
          )) : (
            <p className="discovery-interface__empty" role="status">
              No {activeMode.toLowerCase()} tools match “{query}”. Try another search or sample.
            </p>
          )}
        </div>

        <div className="discovery-interface__footer">
          <span>{results.length ? `Showing ${results.length} catalog ${results.length === 1 ? 'match' : 'matches'}` : 'Search the catalog'}</span>
          <Link to={`/ai-tools?category=${modeCategories[activeMode]}`}>Browse {activeMode.toLowerCase()} directory <ArrowUpRight size={13} aria-hidden="true" /></Link>
        </div>
      </div>
    </div>
  );
};
