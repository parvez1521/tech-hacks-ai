import React, { useEffect, useState } from 'react';
import { siteConfig } from '../config/site.ts';
import { getCookiePreferences } from './CookieConsentBanner.tsx';

/**
 * Loads Google's official AdSense script only after an explicit owner configuration,
 * valid publisher ID, privacy-readiness switch, and the visitor's ad preference.
 * The privacy-ready switch must remain false until any required certified CMP is live.
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
    if (!siteConfig.adsense.enabled || !siteConfig.adsense.privacyReady || !adConsent || !validPublisher || !hasPlacement) return;

    if (document.querySelector('script[data-switchroute-adsense="true"]')) return;
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.switchrouteAdsense = 'true';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(publisherId);
    document.head.appendChild(script);
  }, [adConsent]);

  return null;
};
