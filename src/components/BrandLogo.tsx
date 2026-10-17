import React, { useState } from 'react';
import { getBrandLogo } from '../data/brandLogos.ts';

export type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

interface BrandLogoProps {
  slug: string;
  name: string;
  size?: BrandLogoSize;
  className?: string;
  iconBgColor?: string;
  iconLetter?: string;
  showContainer?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  slug,
  name,
  size = 'sm',
  className = '',
  iconBgColor,
  iconLetter,
  showContainer = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const logoEntry = getBrandLogo(slug);

  // Dimension helpers
  const getSizeStyles = () => {
    if (typeof size === 'number') {
      return {
        container: `w-[${size}px] h-[${size}px]`,
        img: `w-[${Math.round(size * 0.65)}px] h-[${Math.round(size * 0.65)}px]`,
        text: 'text-xs',
      };
    }

    switch (size) {
      case 'xs':
        return {
          container: 'w-6 h-6',
          img: 'w-3.5 h-3.5',
          text: 'text-[10px]',
        };
      case 'sm':
        return {
          container: 'w-8 h-8',
          img: 'w-5 h-5',
          text: 'text-xs',
        };
      case 'md':
        return {
          container: 'w-9 h-9',
          img: 'w-5.5 h-5.5',
          text: 'text-xs',
        };
      case 'lg':
        return {
          container: 'w-10 h-10',
          img: 'w-6 h-6',
          text: 'text-sm',
        };
      case 'xl':
        return {
          container: 'w-16 h-16',
          img: 'w-10 h-10',
          text: 'text-xl',
        };
      default:
        return {
          container: 'w-8 h-8',
          img: 'w-5 h-5',
          text: 'text-xs',
        };
    }
  };

  const sizeClasses = getSizeStyles();
  const fallbackBg = iconBgColor || logoEntry?.badgeBg || '#3b82f6';
  const fallbackText = iconLetter || (name ? name.slice(0, 2).toUpperCase() : '??');

  if (logoEntry && logoEntry.assetPath && !hasError) {
    if (!showContainer) {
      return (
        <img
          src={logoEntry.assetPath}
          alt=""
          aria-hidden="true"
          className={`${sizeClasses.img} object-contain transition-transform duration-300 group-hover:scale-105 ${className}`}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
        />
      );
    }

    return (
      <div
        className={`${sizeClasses.container} rounded-md flex items-center justify-center shrink-0 overflow-hidden bg-card/90 border border-border/80 shadow-sm transition-transform duration-300 group-hover:scale-105 ${className}`}
        title={`${name} logo`}
      >
        <img
          src={logoEntry.assetPath}
          alt={`${name} logo`}
          className={`${sizeClasses.img} object-contain`}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Graceful Fallback badge with consistent initials and contrast styling
  return (
    <div
      className={`${sizeClasses.container} rounded-md flex items-center justify-center font-bold ${sizeClasses.text} text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300 ${className}`}
      style={{ backgroundColor: fallbackBg }}
      title={name}
      aria-label={name}
    >
      {fallbackText}
    </div>
  );
};
