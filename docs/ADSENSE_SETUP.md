# SwitchRoute — Google AdSense setup

AdSense integration is intentionally off by default. Do not enable ad serving until Google has accepted the site and the required privacy/consent setup is ready.

## 1. Apply for the site

1. Sign in to the Google AdSense account you will use for SwitchRoute.
2. Add https://switchroute.in in AdSense and follow the verification method shown in that account.
3. Keep the site useful and complete while it is reviewed: original content, clear navigation, accurate tool/offer details, working contact information, and reachable Privacy Policy, Terms, and Disclosure pages.
4. Request a review from the AdSense account only when the site is checked and eligible to request review.

## 2. Configure Vercel environment variables

After the site is approved and the required privacy setup is in place, add these in Vercel → Project → Settings → Environment Variables for Production. Add Preview variables only if you deliberately test there.

- VITE_ADSENSE_PUBLISHER_ID: the real ID shown by AdSense, in the form ca-pub-1234567890123456.
- VITE_ADSENSE_ENABLED: true only after approval and consent readiness; otherwise false or unset.
- VITE_ADSENSE_PRIVACY_READY: true only after required regional consent setup is implemented and tested; otherwise false or unset.
- VITE_ADSENSE_AUTO_ADS: true only if Auto ads are enabled in your AdSense account and you intend to use them.
- VITE_ADSENSE_HOME_SLOT: for a manual homepage ad unit, the numeric ad slot ID from that exact AdSense ad unit. Leave empty if using Auto ads only.

Publisher IDs and ad-slot IDs are public identifiers, not secrets. Never invent or copy a placeholder ID into Production.

The app requires a valid publisher ID, explicit enable flag, privacy-readiness flag, and a visitor's advertising preference before making an ad request. The manual homepage placement also requires a real numeric slot ID.

## 3. Consent and privacy requirements

The current SwitchRoute Cookie Preferences panel stores browser-level preferences; by itself it is not a Google-certified consent management platform (CMP) and does not transmit IAB TCF consent signals. Google requires publishers serving personalized ads in the EEA, UK, and Switzerland to use a Google-certified CMP integrated with the IAB Transparency and Consent Framework. Choose and configure an appropriate certified CMP in AdSense (or implement a certified provider), test its consent flow, and update the Privacy Policy to reflect the setup that is actually live before marking privacy setup ready.

Official guidance:
- Google's publisher consent requirements: https://support.google.com/adsense/answer/13554116?hl=en
- Google AdSense consent management setup: https://support.google.com/adsense/answer/7670013?hl=en

Do not set VITE_ADSENSE_PRIVACY_READY=true until the required setup is actually complete.

## 4. ads.txt

During the production build, scripts/generate-ads-txt.mjs writes /ads.txt from the real VITE_ADSENSE_PUBLISHER_ID. It emits the Google seller record in the standard form:

google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0

The publisher ID above is an example only, not SwitchRoute's account ID. The file is deliberately not published until a real publisher ID is configured. Once configured, verify https://switchroute.in/ads.txt in a browser and in AdSense's Sites page.

Official guidance: https://support.google.com/adsense/answer/12171612?hl=en

## 5. Rollout checklist

- [ ] AdSense account and site approved by Google.
- [ ] Real publisher ID copied from the account.
- [ ] Any required certified CMP and privacy notices are live and tested.
- [ ] Environment variables set for the intended deployment environment.
- [ ] A real manual ad slot ID is supplied, or Auto ads are enabled in AdSense and the env flag is set.
- [ ] Rebuild/redeploy, then verify the live page, browser console, /ads.txt, and AdSense site status.
- [ ] Review ad placements on desktop and mobile so ads do not obscure content or mimic navigation/download buttons.

Approval, account verification, tax/payment onboarding, and the final review must be completed inside the owner's Google account. Code changes cannot guarantee AdSense approval.
