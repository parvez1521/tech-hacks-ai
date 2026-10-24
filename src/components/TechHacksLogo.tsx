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
    sm: { box: 'w-7 h-7', text: 'text-base' },
    md: { box: 'w-9 h-9', text: 'text-lg' },
    lg: { box: 'w-12 h-12', text: 'text-2xl' },
  };
  const current = sizeMap[size];
  const gradientId = `switchRoute-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      <div
        className={`${current.box} rounded-lg bg-[#0b0f19] border border-cyan-500/40 relative flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 ease-out group-hover:rotate-3 group-hover:border-cyan-400 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.35)] overflow-hidden`}
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id={`${gradientId}-line`} x1="5" y1="5" x2="27" y2="27" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="52%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <radialGradient id={`${gradientId}-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="32" height="32" rx="6" fill={`url(#${gradientId}-glow)`} />
          <path d="M6 10h18m0 0-4-4m4 4-4 4" stroke={`url(#${gradientId}-line)`} strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M26 22H8m0 0 4-4m-4 4 4 4" stroke={`url(#${gradientId}-line)`} strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="10" r="2" fill="#38bdf8" />
          <circle cx="26" cy="22" r="2" fill="#c084fc" />
        </svg>
      </div>
      {showWordmark && (
        <span className={`font-extrabold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] ${current.text} flex items-center`}>
          <span>Switch</span>
          <span className="font-black bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">Route</span>
        </span>
      )}
    </div>
  );
};
