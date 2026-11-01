# SwitchRoute Instagram Reel Downloader setup

The Instagram Reel Downloader uses Meta's official Instagram API with Instagram Login. It only downloads media returned for the Professional or Creator account that the visitor explicitly connects. It is not a public-profile scraper and does not access private or unrelated accounts.

## Meta app setup

1. Create or select an app in Meta for Developers.
2. Add the Instagram API product and configure Instagram Login.
3. Register this exact OAuth redirect URI: https://switchroute.in/api/instagram/callback
4. Request only the instagram_business_basic permission.
5. In Development mode, add the Instagram Professional/Creator account used for testing as an app tester and complete the invitation/consent flow.
6. Complete Meta App Review and any required business verification before enabling accounts outside the app's allowed roles.
7. The connected Instagram account must be Professional (Business or Creator). Personal/consumer accounts are not supported by this API.

## Vercel environment variables

Add these Production variables to the SwitchRoute Vercel project. Add them to Preview only when you also register the matching Preview OAuth redirect URI in Meta.

| Variable | Value |
| --- | --- |
| INSTAGRAM_APP_ID | Instagram app ID from Meta |
| INSTAGRAM_APP_SECRET | Instagram app secret from Meta |
| INSTAGRAM_SESSION_SECRET | Generate a new secret of at least 32 characters: openssl rand -base64 48 |
| SITE_URL | https://switchroute.in |
| INSTAGRAM_GRAPH_API_VERSION | Optional; defaults to v26.0 |

Never put the App Secret or session secret in client-side VITE_ variables.

After adding these values, redeploy Production. The downloader's Connect button activates automatically when all required settings are present.

## Behaviour and limits

- A visitor signs in at Instagram and grants instagram_business_basic.
- The short-lived token is exchanged for a long-lived token server-side.
- The token is encrypted with AES-256-GCM and stored in a Secure, HttpOnly, SameSite cookie. It is never written to localStorage or SwitchRoute's database.
- The backend searches the connected account's media (up to 500 records) and matches the Reel/post shortcode.
- Only posts returned by the official media endpoint for the connected account can be downloaded.
- The selected media is streamed on demand from an approved Instagram CDN host. SwitchRoute does not intentionally retain the media file.
- Lookup and download limits are currently per serverless-function instance. They are a safety baseline, not a distributed quota; replace with Redis/Upstash before high-volume use.
- Media URLs can expire, and tokens can be revoked. Users must reconnect when that happens.
- MP3 conversion is available through the existing MP4 to MP3 utility after downloading a video.

## Production checklist

- [ ] Meta app has Instagram Login configured.
- [ ] instagram_business_basic is enabled and approved for the intended audience.
- [ ] Production redirect URI matches exactly.
- [ ] All required Vercel environment variables are set.
- [ ] OAuth connect, callback, session, owned-Reel lookup, video download, carousel download, disconnect, and expired-token handling are tested with a real authorized account.
- [ ] Meta app review and user-data deletion instructions are complete before public release.
