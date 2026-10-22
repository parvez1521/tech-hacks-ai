import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Command, Search } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { BrandLogo } from './BrandLogo';

type DiscoveryMode = 'Coding' | 'Video' | 'Design';

const discoveryExamples: Record<DiscoveryMode, Array<{ slug: string; name: string; detail: string }>> = {
  Coding: [
    { slug: 'cursor', name: 'Cursor', detail: 'AI code editor' },
    { slug: 'bolt-new', name: 'Bolt.new', detail: 'Build web apps in your browser' },
  ],
  Video: [
    { slug: 'runway', name: 'Runway', detail: 'Generative video platform' },
    { slug: 'hailuo-ai', name: 'Hailuo AI', detail: 'Text and image to video' },
  ],
  Design: [
    { slug: 'recraft', name: 'Recraft', detail: 'Image and vector generation' },
    { slug: 'v0-vercel', name: 'v0 by Vercel', detail: 'Generate interface concepts' },
  ],
};

/** A lightweight, locally rendered preview of the directory's discovery flow. */
export const HeroSignalVisual: React.FC = () => {
  const [activeMode, setActiveMode] = useState<DiscoveryMode>('Coding');
  const [motionReady, setMotionReady] = useState(false);
  const reduceMotion = useReducedMotion();
  useEffect(() => setMotionReady(true), []);
  const MotionDiv = (motionReady ? m.div : 'div') as React.ElementType;
  const animationProps = motionReady ? {
    initial: reduceMotion ? false : { opacity: 0.7, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.45, ease: [0.2, 0.7, 0.2, 1] },
  } : {};
  const resultAnimationProps = (index: number) => motionReady ? {
    initial: reduceMotion ? false : { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.22, delay: reduceMotion ? 0 : index * 0.045 },
  } : {};
  const examples = discoveryExamples[activeMode];

  return (
      <MotionDiv
        className="discovery-interface"
        aria-label="Interactive preview of software discovery"
        {...animationProps}
      >
        <div className="discovery-interface__chrome" aria-hidden="true">
          <span /> <span /> <span />
          <div className="discovery-interface__address"><Command size={12} /> switchroute / discover</div>
        </div>

        <div className="discovery-interface__body">
          <div className="discovery-interface__topline">
            <div>
              <p className="discovery-interface__overline">The right tool is out there</p>
              <h2>Start with what you need to do.</h2>
            </div>
            <span className="discovery-interface__index">01 / 03</span>
          </div>

          <div className="discovery-interface__search" aria-label="Static sample query, not a search field">
            <Search size={16} aria-hidden="true" />
            <span><small className="block text-[9px] uppercase tracking-wider text-muted-foreground">Sample query</small>AI tools for building a website</span>
          </div>

          <div className="discovery-interface__tabs" role="tablist" aria-label="Preview discovery categories">
            {(Object.keys(discoveryExamples) as DiscoveryMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={activeMode === mode}
                onClick={() => setActiveMode(mode)}
              >
                {mode}
                {activeMode === mode && (
                  <span className="discovery-interface__tab-indicator" />
                )}
              </button>
            ))}
          </div>

          <div className="discovery-interface__results" role="tabpanel" aria-live="polite">
            {examples.map((example, index) => (
              <MotionDiv
                className={`discovery-interface__result${index === 0 ? ' is-selected' : ''}`}
                key={example.slug}
                {...resultAnimationProps(index)}
              >
                <BrandLogo slug={example.slug} name={example.name} size="md" />
                <span className="discovery-interface__result-copy">
                  <strong>{example.name}</strong>
                  <span>{example.detail}</span>
                </span>
                <span className="discovery-interface__result-action" aria-hidden="true">
                  <ArrowUpRight size={15} />
                </span>
              </MotionDiv>
            ))}
          </div>

          <div className="discovery-interface__footer">
            <span>AI tools · Open source · Utilities · Offers</span>
            <span className="discovery-interface__signal"><i /> Search the catalog</span>
          </div>
        </div>
      </MotionDiv>
  );
};
