import React, { useEffect, useState } from 'react';
import { getCookiePreferences } from './CookieConsentBanner';
import { siteConfig } from '../config/siteConfig';

export interface AdSenseBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  responsive?: boolean;
  className?: string;
  showPreviewPlaceholder?: boolean;
}

/**
 * AdSenseBanner
 *
 * Prepared for Google AdSense integration while strictly adhering to Google policies:
 * 1. Disabled by default until official Google AdSense account approval.
 * 2. Does NOT output fake ca-pub IDs or execute unapproved ad scripts.
 * 3. Clearly labeled with "Advertisement" in compliance with AdSense placement standards.
 * 4. Can render an optional dormant preview frame during site audit/development.
 */
export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slot = '',
  format = 'auto',
  responsive = true,
  className = '',
  showPreviewPlaceholder = false,
}) => {
  const [adConsent, setAdConsent] = useState(false);
  useEffect(() => {
    const refreshConsent = () => setAdConsent(getCookiePreferences()?.advertising === true);
    refreshConsent();
    window.addEventListener('cookie_consent_updated', refreshConsent);
    return () => window.removeEventListener('cookie_consent_updated', refreshConsent);
  }, []);

  const validSlot = /^\d{5,}$/.test(slot);
  const isEnabled =
    siteConfig.adsense?.enabled &&
    siteConfig.adsense?.privacyReady &&
    !!siteConfig.adsense?.publisherId &&
    adConsent &&
    validSlot;

  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') return;
    const win = window as Window & { adsbygoogle?: Array<Record<string, unknown>> };
    win.adsbygoogle = win.adsbygoogle || [];
    try {
      win.adsbygoogle.push({});
    } catch {
      // Do not disrupt the page if an ad request cannot be initialized.
    }
  }, [isEnabled, slot]);

  // Do not render until the real account, consent gate, and numeric ad-unit slot are configured.
  if (isEnabled) {
    return (
      <div className={`my-8 text-center ad-container ${className}`}>
        <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block mb-1">
          Advertisement
        </span>
        <ins
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client={siteConfig.adsense.publisherId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    );
  }

  // If dormant placeholder is requested for layout testing during review:
  if (showPreviewPlaceholder) {
    return (
      <div
        className={`my-8 p-4 rounded-xl border border-dashed border-border/70 bg-card/40 text-center max-w-xl mx-auto ${className}`}
        aria-label="Advertising slot placeholder (pre-approval)"
      >
        <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block mb-1">
          Advertisement
        </span>
        <div className="py-6 px-4 text-xs text-muted-foreground flex flex-col items-center justify-center gap-1">
          <span className="font-semibold text-secondary-foreground">
            Google AdSense Placement Slot
          </span>
          <span className="text-[11px] text-muted-foreground/80">
            Dormant — Awaiting Google AdSense account verification and publisher approval.
          </span>
        </div>
      </div>
    );
  }

  // Pre-approval: do not render anything in live visitor DOM
  return null;
};
