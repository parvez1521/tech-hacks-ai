# SwitchRoute — Google AdSense setup

AdSense code is prepared, but **ad serving is disabled by default**. Code cannot guarantee approval; the site and account must be reviewed by Google.

## 1. Apply in AdSense

1. Sign in to your own Google AdSense account.
2. Add `https://switchroute.in` and follow the verification method shown in the account.
3. Keep the website complete: useful original content, accurate pricing/offer information, working Contact Us, clear navigation, and reachable Privacy, Terms and Disclosure pages.
4. Request review in AdSense when the account says the site is eligible.

## 2. Environment variables

After site approval and required privacy setup, set the following in Vercel → Project → Settings → Environment Variables for Production. Set Preview only for deliberate testing.

- `VITE_ADSENSE_PUBLISHER_ID`: genuine publisher ID, format `ca-pub-1234567890123456`.
- `VITE_ADSENSE_ENABLED`: `true` only after approval.
- `VITE_ADSENSE_PRIVACY_READY`: `true` only after required privacy/consent setup is actually live and tested.
- `VITE_ADSENSE_AUTO_ADS`: `true` only if Auto ads are enabled in your AdSense account.
- `VITE_ADSENSE_HOME_SLOT`: numeric ad-slot ID from an actual AdSense ad unit for manual homepage placement. Leave blank for Auto ads only.

The build validates publisher ID format and produces `/ads.txt` only when a genuine publisher ID is configured. Do not use example IDs or turn the flags on just to make the ad component appear.

## 3. Consent and privacy

The current SwitchRoute Cookie Preferences panel stores browser-level choices. It is **not** a Google-certified consent management platform (CMP) and does not send IAB TCF consent signals. Google requires publishers serving personalized ads in the EEA, UK, and Switzerland to use a Google-certified CMP integrated with the IAB Transparency and Consent Framework.

Before setting `VITE_ADSENSE_PRIVACY_READY=true`, configure a suitable certified CMP through AdSense Privacy & messaging or an eligible CMP provider, test regional consent behavior, and make sure the Privacy Policy describes the real production configuration. Keep this flag false until that is done.

Official guidance:
- https://support.google.com/adsense/answer/13554116?hl=en
- https://support.google.com/adsense/answer/7670013?hl=en
- https://support.google.com/adsense/answer/12171612?hl=en

## 4. Verification

After configuration and redeploy:
- Open `https://switchroute.in/ads.txt` and check the seller record matches the publisher ID in AdSense.
- Confirm the domain is approved in AdSense.
- Test on desktop and mobile, watch browser console, and check that ads never mimic buttons or downloads, obscure content, or load before the intended consent setup.
- Revisit Google AdSense Sites page to ensure site status and `ads.txt` are recognized.

Account ownership, identity/tax/payment verification, site review, and approval must be completed inside the owner's Google account.
