# SwitchRoute — Google AdSense setup

AdSense code is prepared, but **ad serving is disabled by default**. Code cannot guarantee approval; the site and account must be reviewed by Google.

## 1. Connect and verify the site

1. Sign in to the AdSense account that owns publisher ID `pub-7627022109232156`.
2. Add `https://switchroute.in` in **Sites** if it is not already listed.
3. In the connection step, choose **Meta tag** and confirm the exact value shown in your account matches the live `<meta name="google-adsense-account">` value in `index.html`.
4. Click **Verify**, then request a review from the Sites page when the account allows it.
5. The meta tag verifies site ownership only. It does not load ads. Ad-serving flags remain disabled until approval and privacy requirements are met.

## 2. Environment variables

After site approval and required privacy setup, set the following in Vercel → Project → Settings → Environment Variables for Production. Set Preview only for deliberate testing.

- `VITE_ADSENSE_PUBLISHER_ID`: genuine publisher ID, format `ca-pub-1234567890123456`.
- `VITE_ADSENSE_ENABLED`: `true` only after approval.
- `VITE_ADSENSE_PRIVACY_READY`: `true` only after required privacy/consent setup is actually live and tested.
- `VITE_ADSENSE_AUTO_ADS`: `true` only if Auto ads are enabled in your AdSense account.
- `VITE_ADSENSE_HOME_SLOT`: numeric ad-slot ID from an actual AdSense ad unit for manual homepage placement. Leave blank for Auto ads only.

The build validates publisher ID format when `VITE_ADSENSE_PUBLISHER_ID` is set. If that variable is unset, it preserves an existing `public/ads.txt` file rather than deleting it; this repository already has an owner-added publisher record. Do not use example IDs or turn the flags on just to make the ad component appear.

## 3. Consent and privacy

The SwitchRoute Cookie Preferences panel stores browser-level choices and is used for basic opt-in Google Analytics 4 measurement. It is **not** a Google-certified consent management platform (CMP) and does not send IAB TCF consent signals. Google requires publishers serving personalized ads in the EEA, UK, and Switzerland to use a Google-certified CMP integrated with the IAB Transparency and Consent Framework.

Before setting `VITE_ADSENSE_PRIVACY_READY=true`, configure a suitable certified CMP through AdSense Privacy & messaging or an eligible CMP provider, test regional consent behavior, and make sure the Privacy Policy describes the real production configuration. Keep this flag false until that is done.

Official guidance:
- https://support.google.com/adsense/answer/13554116?hl=en
- https://support.google.com/adsense/answer/7670013?hl=en
- https://support.google.com/adsense/answer/12171612?hl=en

## 4. Verification

After configuration and redeploy:
- Open the homepage HTML and confirm the AdSense site-verification meta tag is present.
- Open `https://switchroute.in/ads.txt` and check the seller record matches the publisher ID in AdSense. The meta tag and ads.txt serve different purposes; one does not replace the other.
- Confirm the domain is approved in AdSense before enabling any ad code or Auto ads.
- Test consent choices on desktop and mobile, including withdrawing Analytics consent after opting in.
- Keep the AdSense privacy-ready flag false until the required certified CMP and regional consent behaviour are configured and tested.

Account ownership, identity/tax/payment verification, site review, and approval must be completed inside the owner's Google account.
