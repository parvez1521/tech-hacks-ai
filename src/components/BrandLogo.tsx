import React, { useState, useEffect } from 'react';
import { getBrandLogo } from '../data/runtimeBrandLogos.ts';

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
  const logoEntry = getBrandLogo(slug);
  // Prefer traceable local assets. For entries whose only recorded source is a
  // domain favicon, use that sourced favicon rather than a generic placeholder.
  const isTrustedLogo = Boolean(logoEntry?.sourceUrl && logoEntry.sourceType !== 'fallback');
  const isDomainFaviconFallback = Boolean(
    logoEntry?.sourceType === 'fallback' && logoEntry.sourceUrl?.includes('google.com/s2/favicons')
  );
  const canRenderLogo = isTrustedLogo || isDomainFaviconFallback;
  const resolvedLogoSrc = isDomainFaviconFallback ? logoEntry?.sourceUrl : logoEntry?.assetPath;
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(
    isTrustedLogo ? logoEntry?.assetPath : undefined
  );
  const [hasError, setHasError] = useState(false);
  const logoStatus = isDomainFaviconFallback
    ? 'domain-favicon-fallback'
    : logoEntry?.sourceType === 'provided'
      ? 'provided-source-recorded'
      : 'source-recorded';

  useEffect(() => {
    if (!canRenderLogo) {
      setCurrentSrc(undefined);
    } else if (isDomainFaviconFallback) {
      setCurrentSrc(logoEntry?.sourceUrl);
    } else {
      setCurrentSrc(logoEntry?.assetPath);
    }
    setHasError(false);
  }, [slug, logoEntry?.assetPath, logoEntry?.sourceType, logoEntry?.sourceUrl, isTrustedLogo]);

  const handleImageError = () => {
    if (logoEntry?.pngAssetPath && currentSrc !== logoEntry.pngAssetPath) {
      setCurrentSrc(logoEntry.pngAssetPath);
    } else {
      if (import.meta.env?.DEV) {
        console.warn(`[BrandLogo] Unable to load logo for ${slug}: ${currentSrc || 'unknown asset'}`);
      }
      setHasError(true);
    }
  };

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
          img: 'w-6 h-6',
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
  const fallbackBg = '#334155';
  const fallbackText = iconLetter || (name ? name.slice(0, 2).toUpperCase() : '??');

  if (logoEntry && canRenderLogo && currentSrc && !hasError) {
    if (!showContainer) {
      const hasSizeOverride = /\b(w-|h-)/.test(className);
      return (
        <img
          src={currentSrc}
          alt=""
          aria-hidden="true"
          data-brand-slug={slug}
           data-logo-status={logoStatus}
           className={`${hasSizeOverride ? '' : sizeClasses.img} object-contain brand-logo-image brand-logo-image--${logoEntry.slug} transition-transform duration-300 group-hover:scale-105 ${className}`}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />
      );
    }

    return (
      <div
        className={`${sizeClasses.container} rounded-md flex items-center justify-center shrink-0 overflow-hidden bg-card border border-border/80 shadow-sm transition-transform duration-300 group-hover:scale-105 ${className}`}
        data-brand-slug={slug}
        data-logo-status={logoStatus}
      >
        <img
          src={currentSrc}
          alt={`${name} logo`}
          data-brand-slug={slug}
           data-logo-status={logoStatus}
           className={`${sizeClasses.img} object-contain brand-logo-image brand-logo-image--${logoEntry.slug}`}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />
      </div>
    );
  }

  // Explicitly label monograms as a fallback so they cannot be mistaken for brand artwork.
  return (
    <div
      className={`${sizeClasses.container} rounded-md flex items-center justify-center font-bold ${sizeClasses.text} text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300 ${className}`}
      style={{ backgroundColor: fallbackBg }}
      role="img"
      aria-label={`${name} logo unavailable; showing initials fallback`}
      data-brand-slug={slug}
      data-logo-status="intentional-neutral-fallback"
    >
      {fallbackText}
    </div>
  );
};
