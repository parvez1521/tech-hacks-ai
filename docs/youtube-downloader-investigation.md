# YouTube utility investigation

## SwitchRoute implementation

The existing `/free-tools/youtube-video-downloader` route is intentionally a **YouTube Creator Download Guide**. Its component calls `parseYoutubeUrl` in the browser and offers official YouTube Studio and Google Takeout links. It does not submit the pasted URL to SwitchRoute, fetch media metadata, return formats, create a download link, or manage jobs. The current behavior is therefore a guide/validator, not a failed extraction integration. The YouTube metadata utility is also URL validation only.

The URL helper validates HTTPS and a single 11-character video ID, then normalizes standard watch, `youtu.be`, Shorts, and embed paths to a watch URL. Existing tests cover those shapes and malformed/unsupported URLs. A playlist's `v` value is treated as one video; playlist items are not processed.

The local server API has no YouTube/media extraction adapter. `/api/transcribe` is the only relevant media backend: it accepts uploads up to 4 MB and calls an allowlisted transcription provider. MP4 conversion uses client-side FFmpeg WebAssembly for a local file. Neither path produces YouTube download options. Vercel rewrites non-API paths to the SPA; the repository has no configured extractor, job store, temporary download storage, or download-link endpoint.

## Reference observation (REA)

Using a clean, controlled Chromium session on the supplied `https://vidssave.com/index-3tz` page, the visible URL field accepted a public standard YouTube watch URL. Submitting it with the page's **Download** control triggered a request to a VidsSave-owned media-parse API; the browser observed HTTP 200. The resulting page showed the video's title and duration, plus MP4 options labeled 240p, 360p, 480p, 720p, and 1440p, and MP3 options labeled Low, 48 kbps, 128 kbps, and 256 kbps. This establishes visible UI output for one standard watch URL only; the download controls themselves were not activated and file delivery was not verified. The undocumented endpoint is deliberately not reproduced here.

Observed evidence IDs:

- `ev_c84b7a082c20f24876b505d70485f516715b73bc445f444e971ada75a6c1929f` — initial page load and DOM, controlled replay.
- `ev_e35b80a8d1ece8680ebc90a1e2d9d48e5f9b370d57fd240c3a31cc6ec40ead0a` — standard watch URL submission and network metadata; event capture was budget-limited.
- `ev_76f3c099a1de18fdb13192f6bac2beb482d8e760423cde98acb64f2f36034f2c` — standard watch URL submission with complete event coverage; visible result options and HTTP 200 parser response.

VidsSave-specific handling for `youtu.be`, Shorts, playlists, unsupported content, retries, expiry, and final file delivery was not verified. The observed browser did not retain request or response bodies, so it does not establish a stable public API contract, backend authentication requirements, or that any displayed option successfully downloads a file.

## Implementation decision and blocker

No downloader integration was added. Reusing an undocumented third-party parse endpoint would be brittle and would copy a private service interface; building an independent extractor would require a permitted provider/API contract and a server-side processing and delivery design that is not present here. Before a real downloader can be implemented, SwitchRoute needs an authorized provider interface, its credentials and terms, hosting/runtime limits and budget, and an approved policy for temporary files, expiry, request limits, and permitted content. Until then the existing route remains a clearly disclosed URL validator/creator guide and presents no fake download options.
