import React, { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

interface PromptPreviewImageProps {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/** Renders a local preview without exposing a browser broken-image icon. */
export const PromptPreviewImage: React.FC<PromptPreviewImageProps> = ({ src, alt, className = '', priority = false }) => {
  const [failedSrc, setFailedSrc] = useState<string>();
  useEffect(() => setFailedSrc(undefined), [src]);

  if (!src || failedSrc === src) {
    return (
      <span className={`flex min-h-40 items-center justify-center gap-2 bg-slate-100 px-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300 ${className}`} role="img" aria-label={alt || 'Preview unavailable'}>
        <ImageOff size={18} aria-hidden="true" />
        <span>Preview unavailable</span>
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width="1254"
      height="1254"
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={className}
      onError={() => {
        if (import.meta.env?.DEV) console.warn(`[PromptPreviewImage] Unable to load preview: ${src}`);
        setFailedSrc(src);
      }}
    />
  );
};
