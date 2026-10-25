import React, { useEffect, useState } from 'react';
import { siteConfig } from '../config/site.ts';
import { getCookiePreferences } from './CookieConsentBanner.tsx';

/**
 * Loads the official AdSense client only after an explicit opt-in, valid publisher ID,
 * valid privacy-readiness flag, and either Auto ads or a real manually configured slot.
 *
 * VITE_ADSENSE_PRIVACY_READY must not be enabled until the required regional consent
 * management setup has been deployed and the site is approved in AdSense.
 */
export const AdSenseRuntime: React.FC = () => {
  const [adConsent, setAdConsent] = useState(false);

  useEffect(() => {
    const refreshConsent = () => setAdConsent(getCookiePreferences()?.advertising === true);
    refreshConsent();
    window.addEventListener('cookie_consent_updated', refreshConsent);
    return () => window.removeEventListener('cookie_consent_updated', refreshConsent);
  }, []);

  useEffect(() => {
    const publisherId = siteConfig.adsense.publisherId;
    const validPublisher = /^ca-pub-\d{16}$/.test(publisherId);
    const validHomeSlot = /^\d{5,}$/.test(siteConfig.adsense.slots.homepage);
    const hasPlacement = siteConfig.adsense.autoAds || validHomeSlot;

    if (!siteConfig.adsense.enabled || !siteConfig.adsense.privacyReady || !adConsent || !validPublisher || !hasPlacement) {
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-switchroute-adsense="true"]');
    if (existing) return;

    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.switchrouteAdsense = 'true';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(publisherId);
    document.head.appendChild(script);
  }, [adConsent]);

  return null;
};
