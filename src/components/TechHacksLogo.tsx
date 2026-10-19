import React from 'react';

interface TechHacksLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export const TechHacksLogo: React.FC<TechHacksLogoProps> = ({
  size = 'sm',
  showWordmark = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', icon: 28, text: 'text-base', badge: 'text-[11px] px-1.5 py-0.2' },
    md: { box: 'w-9 h-9', icon: 36, text: 'text-lg', badge: 'text-xs px-2 py-0.5' },
    lg: { box: 'w-12 h-12', icon: 48, text: 'text-2xl', badge: 'text-sm px-2.5 py-0.5' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Dynamic Vector Icon Mark */}
      <div
        className={`${current.box} rounded-md bg-[#111315] border border-cyan-500/45 relative flex items-center justify-center shrink-0 overflow-hidden transition-transform duration-200 group-hover:rotate-12 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full p-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="navBoltGrad" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <radialGradient id="navGlowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glow backdrop */}
          <rect width="32" height="32" rx="6" fill="url(#navGlowGrad)" />

          {/* Lightning Monogram */}
            <path
            d="M17.5 4.5L7 17h8l-2 10.5 12-13.5h-8.5l2-9.5z"
            fill="url(#navBoltGrad)"
             className=""
          />

          {/* AI Sparkle */}
          <path
            d="M25 4c0 1.66 1.34 3 3 3-1.66 0-3 1.34-3 3 0-1.66-1.34-3-3-3 1.66 0 3-1.34 3-3z"
            fill="#38bdf8"
          />
        </svg>
      </div>

      {/* Typography Lockup */}
      {showWordmark && (
        <span className={`font-extrabold tracking-tight text-foreground ${current.text} flex items-center`}>
          <span>Tech Hacks</span>
          <span className="ml-1.5 font-black text-cyan-300">
            AI
          </span>
        </span>
      )}
    </div>
  );
};
