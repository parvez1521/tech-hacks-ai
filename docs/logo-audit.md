# Tech Hacks AI logo audit

## Phase 4 source verification update (2026-10-23)

Five of the 49 active logo verification gaps were confirmed against first-party
sources and updated: AppFlowy, Cline, Firecrawl, GPT4All, and Immich. The current
audit now records 44 active gaps and 47 unresolved source records overall (down
from 49 and 52).
The other identities remain neutral fallbacks until a first-party source and
matching local asset can be verified.

| Brand | First-party source | Local asset |
| --- | --- | --- |
| AppFlowy | [Official repository logo](https://github.com/AppFlowy-IO/AppFlowy/blob/main/frontend/appflowy_flutter/assets/images/flowy_logo.svg) | `/logos/appflowy.svg` |
| Cline | [Official docs logo configuration](https://github.com/cline/cline/blob/main/docs/docs.json) | `/logos/cline.svg` |
| Firecrawl | [Press & Brand assets](https://www.firecrawl.dev/press-brand) | `/logos/official-ai/firecrawl.png` |
| GPT4All | [Official GPT4All repository logo](https://github.com/nomic-ai/gpt4all/blob/main/gpt4all-chat/icons/nomic_logo.svg) | `/logos/gpt4all.svg` |
| Immich | [Official repository design logo](https://github.com/immich-app/immich/blob/main/design/immich-logo.svg) | `/logos/immich.svg` |
| Cline | [Official docs logo configuration](https://github.com/cline/cline/blob/main/docs/docs.json) | `/logos/cline.svg` |

Audit date: 2026-10-21

## Follow-up: source corrections and fallback policy (2026-10-22)

The [prompt artwork and logo provenance audit](./prompt-artwork-audit.md) and
[`prompt-image-audit.json`](./prompt-image-audit.json) supersede earlier registry
counts in this historical report. The current registry contains 223 entries.
ChatGPT, FLUX, and Higgsfield now reference locally stored assets from direct
official sources. Google uses its Simple Icons mark; Cursor now uses the site-owner-provided cube mark, and
18 further Simple Icons source URLs were recorded after checking the local SVG
geometry against those sources. Thirty-six entries with no traceable source are
now explicitly marked as verification gaps; their local marks are not rendered,
and `BrandLogo` displays a labeled neutral initials fallback. Thirty-three of
those gaps affect active catalogue identities. A full visual review of all 223
assets remains outstanding.

## Phase 3 verification addendum (2026-10-22)

The four Adobe registry records were inspected against their actual local SVG
paths and source metadata. The generic Adobe umbrella logo was mislabeled as an
official asset even though its recorded source was the Simple Icons CDN; that
provenance is now labeled `simple-icons`. Photoshop, After Effects, and
Premiere Pro each retain their own matching Simple Icons brand mark and are not
mapped to the umbrella logo. These symbols are not Adobe-published product app
tiles. No Illustrator or Express identity exists in the active catalogue or
logo registry, so no unsupported identity was added. The monochrome SVGs are
displayed on a small white neutral tile to remain legible in dark theme without
recoloring the source artwork.

| Brand | Intended identity | Asset | Source | Container | Status |
| --- | --- | --- | --- | --- | --- |
| Adobe | Corporate umbrella mark | `/logos/adobe.svg` | [Simple Icons Adobe mark](https://github.com/simple-icons/simple-icons/blob/develop/icons/adobe.svg) | White tile, source color retained | Source recorded; reviewed as umbrella mark |
| Adobe Photoshop | Photoshop brand symbol | `/logos/adobephotoshop.svg` | [Simple Icons Photoshop mark](https://github.com/simple-icons/simple-icons/blob/develop/icons/adobephotoshop.svg) | White tile, monochrome mark retained | Source recorded; not Adobe app tile |
| Adobe After Effects | After Effects brand symbol | `/logos/adobeaftereffects.svg` | [Simple Icons After Effects mark](https://github.com/simple-icons/simple-icons/blob/develop/icons/adobeaftereffects.svg) | White tile, monochrome mark retained | Source recorded; not Adobe app tile |
| Adobe Premiere Pro | Premiere Pro brand symbol | `/logos/adobepremierepro.svg` | [Simple Icons Premiere Pro mark](https://github.com/simple-icons/simple-icons/blob/develop/icons/adobepremierepro.svg) | White tile, monochrome mark retained | Source recorded; not Adobe app tile |
| Adobe Illustrator / Express | Not present in active catalogue | — | — | Neutral monogram if added before verification | Unresolved; no mapping added |

Adobe's [branding guidelines](https://developer.adobe.com/developer-distribution/creative-cloud/docs/guides/branding_guidelines/)
and [logo permissions](https://www.adobe.com/in/legal/permissions/icons-web-logos.html)
were reviewed. This audit does not imply Adobe approval, partnership, or
authorization to use official product application icons. `BrandLogo` now marks
an asset as `source-recorded`, rather than claiming that a local image is
verified solely because it exists.

This report records the logo mappings used by the active catalogue. The
machine-readable source of truth remains `public/logo-manifest.json`; the
runtime resolver is `src/data/brandLogos.ts`. Every entry below was checked for
an exact local asset path, a non-conflicting canonical slug, and a safe runtime
fallback.

## Audit summary

Audit reconciliation against the current router data and `brandLogos` manifest
(found in `public/logo-manifest.json`) on 2026-10-22:

- The manifest contains **218** logo registry mappings. The active catalogue
  contains **104 unique identities** across open-source tools, AI tools, and
  proprietary alternatives; all 104 resolve to a registry entry.
- Of those 104 active identities, **44** have a recorded official-site or
  maintained Simple Icons source URL and **8** use workspace-provided files
  with recorded provenance metadata. These 52 have source references recorded;
  this audit did not re-research every first-party source URL.
- **52 active identities remain without a source URL**. Their local file paths
  exist, but that does not verify the brand identity or provenance. The runtime
  shows a neutral name fallback for these records until source provenance is
  recorded.
- Registry `sourceType` counts: 70 `official`, 118 `simple-icons`, 13
  `fallback`, 9 `vector`, and 8 `provided`. These are manifest labels, not a
  claim that every active identity was individually checked against its
  first-party site.
- The earlier claim of **108** unresolved/follow-up mappings was not supported
  by a current active-catalogue reconciliation. It is superseded by the
  52-active-identity figure above; inactive registry entries are not counted as
  active catalogue gaps.
- This turn made **no brand identity or provenance corrections**. The
  previously documented xAI-to-X mismatch remediation remains in place.
- Existing automated logo checks verify manifest parity, local SVG/PNG
  validity, raster signatures, path coverage, and fallback behavior. A full
  visual review/contact sheet of all 218 entries was not performed in this
  audit.

The runtime requires a non-fallback mapping to include a recorded `sourceUrl`
before rendering its asset. That safeguard prevents unresolved local artwork
from being presented as a verified mark; it does not prove the correctness of
the source URL itself.

## Corrections and safety decisions

- Removed the misleading `public/logos/png/xai.png` asset that duplicated the
  X mark.
- Replaced `public/logos/xai.svg` with a neutral unresolved marker and kept
  `xai` as an explicit fallback mapping. `BrandLogo` renders a polished name
  fallback for unresolved entries rather than guessing from a nearby slug.
- Removed punctuation-stripping alias resolution. Similar names must have an
  explicit alias in `SLUG_ALIASES`.
- Reclassified favicon-derived entries such as ChatGPT, Groq, Higgsfield,
  Ideogram, Pika, and Runway as `fallback`; they are not claimed as verified
  original logos.
- `tests/logo_audit.test.js` validates exact manifest parity, SVG and PNG
  signatures, fallback notes, duplicate asset conflicts, active catalogue
  coverage, and near-match safety.
- The canonical AI export is kept under `public/logos/official-ai/`. Thirty
  browser-inspected official-logo assets came from the ZIP export; eight
  additional files came from the workspace-provided unresolved-logo set and
  remain visibly labelled `provided` in the registry rather than being falsely
  marked as direct web downloads.

## Active catalogue mapping index

| Tool | Slug | Local asset | Status | Provenance |
| --- | --- | --- | --- | --- |
| Supabase | `supabase` | `/logos/supabase.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/supabase.svg` |
| Firecrawl | `firecrawl` | `/logos/official-ai/firecrawl.png` | verified | Official Firecrawl Press & Brand asset |
| Postiz | `postiz` | `/logos/postiz.svg` | unverified | Not recorded |
| Baserow | `baserow` | `/logos/baserow.svg` | unverified | Not recorded |
| AppFlowy | `appflowy` | `/logos/appflowy.svg` | verified | Official AppFlowy repository logo |
| Penpot | `penpot` | `/logos/penpot.svg` | unverified | Not recorded |
| n8n | `n8n` | `/logos/n8n.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/n8n.svg` |
| Plausible Analytics | `plausible` | `/logos/plausible.svg` | unverified | Not recorded |
| Meilisearch | `meilisearch` | `/logos/meilisearch.svg` | unverified | Not recorded |
| Hoppscotch | `hoppscotch` | `/logos/hoppscotch.svg` | unverified | Not recorded |
| Cal.com | `cal-com` | `/logos/cal-com.svg` | unverified | Not recorded |
| Typebot | `typebot` | `/logos/typebot.svg` | unverified | Not recorded |
| Immich | `immich` | `/logos/immich.svg` | verified | Official Immich repository design logo |
| Outline | `outline` | `/logos/outline.svg` | unverified | Not recorded |
| Novu | `novu` | `/logos/novu.svg` | unverified | Not recorded |
| Docmost | `docmost` | `/logos/docmost.svg` | unverified | Not recorded |
| Beekeeper Studio | `beekeeper-studio` | `/logos/beekeeper-studio.svg` | unverified | Not recorded |
| AFFiNE | `affine` | `/logos/affine.svg` | unverified | Not recorded |
| RustDesk | `rustdesk` | `/logos/rustdesk.svg` | unverified | Not recorded |
| Umami | `umami` | `/logos/umami.svg` | unverified | Not recorded |
| Aider | `aider` | `/logos/official-ai/aider.svg` | verified | Official web export; see `manifest.csv` |
| Cline | `cline` | `/logos/cline.svg` | verified | Official Cline docs logo configuration |
| Roo Code | `roocode` | `/logos/roocode.svg` | unverified | Not recorded |
| OpenCode | `opencode` | `/logos/opencode.svg` | unverified | Not recorded |
| Perplexica | `perplexica` | `/logos/perplexica.svg` | unverified | Not recorded |
| Khoj | `khoj` | `/logos/khoj.svg` | unverified | Not recorded |
| SearXNG | `searxng` | `/logos/searxng.svg` | unverified | Not recorded |
| Claude | `claude` | `/logos/claude.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/claude.svg` |
| ChatGPT | `chatgpt` | `/logos/chatgpt.svg` | unverified | Favicon reference; not treated as original mark |
| Perplexity AI | `perplexity` | `/logos/perplexity.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/perplexity.svg` |
| Google Gemini | `gemini` | `/logos/gemini.svg` | verified | Official product site: `https://gemini.google.com` |
| DeepSeek | `deepseek` | `/logos/official-ai/deepseek.webp` | provided | Workspace-provided asset; official page recorded in `provided-assets.csv` |
| Microsoft Copilot | `copilot` | `/logos/official-ai/copilot.png` | verified | Official web export; see `manifest.csv` |
| Mistral Le Chat | `mistral-le-chat` | `/logos/mistral-le-chat.svg` | unverified | Not recorded |
| Qwen Chat | `qwen-chat` | `/logos/official-ai/qwen-chat.svg` | verified | Official web export; see `manifest.csv` |
| Meta AI | `meta-ai` | `/logos/official-ai/meta-ai.svg` | verified | Official web export; see `manifest.csv` |
| OmniRush | `omnirush` | `/logos/official-ai/omnirush.webp` | verified | Official web export; see `manifest.csv` |
| KIE AI | `kie-ai` | `/logos/official-ai/kie-ai.webp` | verified | Official web export; see `manifest.csv` |
| Google NotebookLM | `notebooklm` | `/logos/official-ai/notebooklm.svg` | verified | Official web export; see `manifest.csv` |
| HuggingChat | `huggingchat` | `/logos/huggingchat.svg` | unverified | Not recorded |
| Groq | `groq` | `/logos/groq.svg` | unverified | Favicon reference; not treated as original mark |
| Google AI Studio | `google-ai-studio` | `/logos/official-ai/google-ai-studio.svg` | verified | Official web export; see `manifest.csv` |
| Ollama | `ollama` | `/logos/official-ai/ollama.png` | verified | Official web export; see `manifest.csv` |
| Open WebUI | `open-webui` | `/logos/official-ai/open-webui.png` | verified | Official web export; see `manifest.csv` |
| Dify.ai | `dify` | `/logos/official-ai/dify.svg` | verified | Official web export; see `manifest.csv` |
| Langflow | `langflow` | `/logos/official-ai/langflow.png` | verified | Official web export; see `manifest.csv` |
| LocalAI | `localai` | `/logos/official-ai/localai.png` | verified | Official web export; see `manifest.csv` |
| LibreChat | `librechat` | `/logos/official-ai/librechat.svg` | verified | Official web export; see `manifest.csv` |
| Jan | `jan` | `/logos/official-ai/jan.svg` | verified | Official web export; see `manifest.csv` |
| AnythingLLM | `anythingllm` | `/logos/official-ai/anythingllm.svg` | verified | Official web export; see `manifest.csv` |
| ComfyUI | `comfyui` | `/logos/official-ai/comfyui.svg` | verified | Official web export; see `manifest.csv` |
| vLLM | `vllm` | `/logos/official-ai/vllm.svg` | verified | Official web export; see `manifest.csv` |
| GPT4All | `gpt4all` | `/logos/gpt4all.svg` | verified | Official GPT4All application resource |
| llama.cpp | `llama-cpp` | `/logos/official-ai/llama-cpp.svg` | verified | Official web export; see `manifest.csv` |
| Cursor Editor | `cursor` | `/logos/cursor.svg` | verified | Site-owner-provided vector traced from the supplied Cursor cube reference (2026-10-27) |
| v0 by Vercel | `v0-vercel` | `/logos/official-ai/v0-vercel.svg` | verified | Official web export; see `manifest.csv` |
| Bolt.new | `bolt-new` | `/logos/bolt-new.svg` | unverified | Not recorded |
| Continue | `continue-dev` | `/logos/official-ai/continue-dev.svg` | verified | Official web export; see `manifest.csv` |
| Qwen 2.5 Coder | `qwen-coder` | `/logos/official-ai/qwen-coder.svg` | verified | Official web export; see `manifest.csv` |
| Replit Agent | `replit-agent` | `/logos/official-ai/replit-agent.png` | provided | Workspace-provided asset; official page recorded in `provided-assets.csv` |
| FLUX.1 by Black Forest Labs | `flux-1` | `/logos/flux-1.svg` | unverified | Not recorded |
| Stable Diffusion 3.5 | `stable-diffusion-3` | `/logos/stable-diffusion-3.svg` | unverified | Not recorded |
| Ideogram v2 | `ideogram` | `/logos/ideogram.svg` | unverified | Favicon reference; not treated as original mark |
| Recraft AI | `recraft` | `/logos/recraft.svg` | unverified | Not recorded |
| Leonardo.ai | `leonardo-ai` | `/logos/official-ai/leonardo-ai.svg` | verified | Official web export; see `manifest.csv` |
| Krea AI | `krea-ai` | `/logos/krea-ai.svg` | unverified | Not recorded |
| Midjourney v6.1 | `midjourney` | `/logos/midjourney.svg` | unverified | Not recorded |
| Runway Gen-3 Alpha | `runway` | `/logos/official-ai/runway.webp` | verified | Official web export; see `manifest.csv` |
| Luma Dream Machine | `luma-dream-machine` | `/logos/luma-dream-machine.svg` | unverified | Not recorded |
| Kling AI | `kling-ai` | `/logos/kling-ai.svg` | unverified | Not recorded |
| Pika | `pika` | `/logos/pika.svg` | unverified | Favicon reference; not treated as original mark |
| Haiper AI | `haiper` | `/logos/official-ai/haiper.jpg` | provided | Workspace-provided asset; official page recorded in `provided-assets.csv` |
| Vidu | `vidu` | `/logos/vidu.svg` | unverified | Not recorded |
| Hailuo AI (MiniMax) | `hailuo-ai` | `/logos/official-ai/hailuo-ai.webp` | verified | Official web export; see `manifest.csv` |
| Dreamina | `dreamina` | `/logos/official-ai/dreamina.webp` | provided | Workspace-provided asset; official page recorded in `provided-assets.csv` |
| PixVerse | `pixverse` | `/logos/pixverse.svg` | unverified | Not recorded |
| Wan 2.1 (Alibaba) | `wan-video` | `/logos/official-ai/wan-video.png` | verified | Official web export; see `manifest.csv` |
| LTX Video | `ltx-video` | `/logos/official-ai/ltx-video.png` | provided | Workspace-provided asset; official page recorded in `provided-assets.csv` |
| CogVideoX | `cogvideox` | `/logos/official-ai/cogvideox.svg` | verified | Official web export; see `manifest.csv` |
| Hedra | `hedra` | `/logos/official-ai/hedra.svg` | verified | Official web export; see `manifest.csv` |
| Kaiber | `kaiber` | `/logos/kaiber.svg` | unverified | Not recorded |
| Higgsfield AI | `higgsfield` | `/logos/higgsfield.svg` | unverified | Favicon reference; not treated as original mark |
| ElevenLabs | `elevenlabs` | `/logos/elevenlabs.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/elevenlabs.svg` |
| Suno | `suno` | `/logos/official-ai/suno.svg` | verified | Official web export; see `manifest.csv` |
| Udio | `udio` | `/logos/udio.svg` | unverified | Not recorded |
| Whisper by OpenAI | `whisper` | `/logos/official-ai/whisper.png` | provided | Workspace-provided asset; official page recorded in `provided-assets.csv` |
| Kokoro TTS | `kokoro-tts` | `/logos/official-ai/kokoro-tts.png` | provided | Workspace-provided asset; official page recorded in `provided-assets.csv` |
| Make | `make` | `/logos/make.svg` | unverified | Not recorded |
| Copy.ai | `copy-ai` | `/logos/official-ai/copy-ai.svg` | verified | Official web export; see `manifest.csv` |
| Meshy 3D | `meshy-3d` | `/logos/official-ai/meshy-3d.png` | provided | Workspace-provided asset; official page recorded in `provided-assets.csv` |
| Zapier Central | `zapier-central` | `/logos/zapier-central.svg` | unverified | Not recorded |
| Firebase | `firebase` | `/logos/firebase.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/firebase.svg` |
| Notion | `notion` | `/logos/notion.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/notion.svg` |
| Airtable | `airtable` | `/logos/airtable.svg` | unverified | Not recorded |
| Buffer | `buffer` | `/logos/buffer.svg` | unverified | Not recorded |
| Figma | `figma` | `/logos/figma.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/figma.svg` |
| Zapier | `zapier` | `/logos/zapier.svg` | unverified | Not recorded |
| Google Analytics | `google-analytics` | `/logos/google-analytics.svg` | unverified | Not recorded |
| Postman | `postman` | `/logos/postman.svg` | unverified | Not recorded |
| Calendly | `calendly` | `/logos/calendly.svg` | unverified | Not recorded |
| Algolia | `algolia` | `/logos/algolia.svg` | unverified | Not recorded |
| Typeform | `typeform` | `/logos/typeform.svg` | unverified | Not recorded |
| Google Photos | `google-photos` | `/logos/google-photos.svg` | unverified | Not recorded |
| Claude Code | `claude-code` | `/logos/claude-code.svg` | unverified | Not recorded |

The remaining registry entries are retained in the manifest for secondary
references, aliases, offers, and future catalog records. They are subject to
the same exact-path and signature checks even when they are not currently
visible in the main directory.

## 2026-10-21 cinematic homepage and offer-pipeline upgrade

- The homepage orbit now uses eight active catalog identities with traceable
  provenance: Claude, Perplexity, Cursor, DeepSeek, Supabase, Firebase, Figma,
  and Notion. The composition is decorative and remains pointer-transparent.
- `gemini` now records the official product site `https://gemini.google.com` as
  its provenance. The public manifest was updated in parallel with the runtime
  registry.
- `githubcopilot` and `googlegemini` are now canonical identities when those
  exact slugs are requested. The `github-copilot` and `google-gemini` aliases
  resolve to those canonical entries instead of Microsoft Copilot or the older
  unprovenanced Gemini entry.
- Offers now carry an explicit `logoSlug` and render through `BrandLogo` in
  both cards and detail pages. This corrected GitHub Copilot to
  `/logos/githubcopilot.svg`, Google Gemini offers to
  `/logos/googlegemini.svg`, and Google Cloud credits to
  `/logos/googlecloud.svg`. AWS and Azure remain neutral fallbacks until a
  traceable source URL is recorded.
- No logo was promoted solely because a local file existed. Unresolved active
  identities remain neutral and are still included in the provenance follow-up
  count above.

## 2026-10-21 correction pass: rendered-brand issues

The browser audit found three cases where the semantic registry mapping was
correct but a monochrome local SVG rendered black against a dark card:

| Tool | Canonical slug | Asset | Correction | Visual status |
| --- | --- | --- | --- | --- |
| Google Gemini | `googlegemini` | `/logos/googlegemini.svg` | Theme-aware blue presentation for the established Gemini mark | Browser-confirmed visible on dark and light offer cards |
| Google Cloud | `googlecloud` | `/logos/googlecloud.svg` | Theme-aware Google Cloud blue presentation for the established cloud mark | Browser-confirmed visible on dark and light offer cards |
| GitHub Copilot | `githubcopilot` | `/logos/githubcopilot.svg` | Theme-aware monochrome presentation so the Copilot mark remains visible on dark cards | Browser-confirmed visible on dark and light offer cards |

The visual correction is scoped to these canonical registry slugs in
`BrandLogo`/`index.css`; it does not alias one company's identity to another or
change the catalog mapping. Offer provider alt text uses the canonical logo
identity, so the Jio/Google Gemini offer does not call a Gemini-only mark a
composite provider logo.

The following dormant local assets remain intentionally neutral and were not
promoted because their identity is not independently verified in this checkout:

- `huggingchat` currently contains a Hugging Face mark and remains a neutral
  fallback rather than being aliased to `huggingface`.
- `v0-vercel` currently resembles the generic Vercel triangle and remains a
  neutral fallback rather than borrowing `vercel`.
- The six explicit favicon-derived fallbacks and the broader provenance-follow-up
  identities remain neutral as documented above.

Representative browser screenshot evidence from the audit pass was captured
under `/var/folders/qj/bhnrw20s1cnfm2dsqpxn358h0000gn/T/agent-tmp/`, including
`offer-logo-googlegemini.png`, `offer-logo-githubcopilot.png`, and
`offer-logo-googlecloud.png`. No claim of complete first-party visual
verification is made.

## Active identities still awaiting source provenance

The following 52 active identities have no `sourceUrl` recorded in the manifest.
This list reports a provenance gap, not a confirmed wrong logo. The app renders
the neutral name fallback for each until provenance is added and reviewed.

Firecrawl (`firecrawl`), Postiz (`postiz`), Baserow (`baserow`), AppFlowy (`appflowy`), Penpot (`penpot`), Plausible Analytics (`plausible`), Meilisearch (`meilisearch`), Hoppscotch (`hoppscotch`), Cal.com (`cal-com`), Typebot (`typebot`), Immich (`immich`), Outline (`outline`), Novu (`novu`), Docmost (`docmost`), Beekeeper Studio (`beekeeper-studio`), AFFiNE (`affine`), RustDesk (`rustdesk`), Umami (`umami`), Cline (`cline`), Roo Code (`roocode`), OpenCode (`opencode`), Perplexica (`perplexica`), Khoj (`khoj`), SearXNG (`searxng`), Google Gemini (`gemini`), Mistral Le Chat (`mistral-le-chat`), HuggingChat (`huggingchat`), GPT4All (`gpt4all`), Bolt.new (`bolt-new`), FLUX.1 by Black Forest Labs (`flux-1`), Stable Diffusion 3.5 (`stable-diffusion-3`), Recraft AI (`recraft`), Krea AI (`krea-ai`), Midjourney v6.1 (`midjourney`), Luma Dream Machine (`luma-dream-machine`), Kling AI (`kling-ai`), Vidu (`vidu`), PixVerse (`pixverse`), Kaiber (`kaiber`), Udio (`udio`), Make (`make`), Zapier Central (`zapier-central`), Airtable (`airtable`), Buffer (`buffer`), Zapier (`zapier`), Google Analytics (`google-analytics`), Postman (`postman`), Calendly (`calendly`), Algolia (`algolia`), Typeform (`typeform`), Google Photos (`google-photos`), Claude Code (`claude-code`).


## Phase 4 active identity review (2026-10-22)

The active home/catalogue/offer identity set used to make these sheets contained **122 identities**. Each identity below was included in a rendered light and dark contact sheet. The sheet review confirmed that local image assets loaded for mapped entries; it does not by itself establish that each mark matches its product or that its recorded URL is first-party. Logos with no recorded source URL are deliberately rendered as neutral monograms by the shared component.

The contact sheets were temporary browser artifacts and are not committed. The individual status is explicit about the limits of this visual pass. Remaining assets still require identity/source confirmation before being described as verified.

| Identity | Recorded source | Local asset | Review result | Contrast treatment | Final status |
| --- | --- | --- | --- | --- | --- |
| Supabase (supabase) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/supabase.svg) | `/logos/supabase.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Firecrawl (firecrawl) | No source URL | `/logos/firecrawl.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Postiz (postiz) | No source URL | `/logos/postiz.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Baserow (baserow) | No source URL | `/logos/baserow.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| AppFlowy (appflowy) | No source URL | `/logos/appflowy.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Penpot (penpot) | No source URL | `/logos/penpot.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| n8n (n8n) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/n8n.svg) | `/logos/n8n.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Plausible Analytics (plausible) | No source URL | `/logos/plausible.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Meilisearch (meilisearch) | No source URL | `/logos/meilisearch.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Hoppscotch (hoppscotch) | No source URL | `/logos/hoppscotch.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Cal.com (cal-com) | No source URL | `/logos/cal-com.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Typebot (typebot) | No source URL | `/logos/typebot.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Immich (immich) | No source URL | `/logos/immich.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Outline (outline) | No source URL | `/logos/outline.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Novu (novu) | No source URL | `/logos/novu.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Docmost (docmost) | No source URL | `/logos/docmost.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Beekeeper Studio (beekeeper-studio) | No source URL | `/logos/beekeeper-studio.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| AFFiNE (affine) | No source URL | `/logos/affine.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| RustDesk (rustdesk) | No source URL | `/logos/rustdesk.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Umami (umami) | No source URL | `/logos/umami.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Aider (aider) | [source recorded](https://aider.chat/assets/logo.svg) | `/logos/official-ai/aider.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Cline (cline) | No source URL | `/logos/cline.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Roo Code (roocode) | No source URL | `/logos/roocode.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| OpenCode (opencode) | No source URL | `/logos/opencode.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Perplexica (perplexica) | No source URL | `/logos/perplexica.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Khoj (khoj) | No source URL | `/logos/khoj.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| SearXNG (searxng) | No source URL | `/logos/searxng.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Claude (claude) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/claude.svg) | `/logos/claude.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| ChatGPT (chatgpt) | [source recorded](https://www.google.com/s2/favicons?domain=chatgpt.com&sz=256) | `/logos/chatgpt.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Perplexity AI (perplexity) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/perplexity.svg) | `/logos/perplexity.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Google Gemini (gemini) | No source URL | `/logos/gemini.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| DeepSeek (deepseek) | [source recorded](https://chat.deepseek.com) | `/logos/official-ai/deepseek.webp` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Microsoft Copilot (copilot) | [source recorded](https://res.cdn.office.net/officehub/images/content/images/unauth-copilotcom/copilot-mobile-logo-static-286643fc8c.png) | `/logos/official-ai/copilot.png` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Mistral Le Chat (mistral-le-chat) | No source URL | `/logos/mistral-le-chat.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Qwen Chat (qwen-chat) | [source recorded](https://assets.alicdn.com/g/qwenweb/qwen-chat-fe/0.3.20/static/images/qwen-logo.svg) | `/logos/official-ai/qwen-chat.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Meta AI (meta-ai) | [source recorded](https://www.meta.ai/images/meta-ai-orbit-logo-gradient-3d_light.svg) | `/logos/official-ai/meta-ai.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| OmniRush (omnirush) | [source recorded](https://omnirush.ai/brand/lockup-ink-240.webp) | `/logos/official-ai/omnirush.webp` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| KIE AI (kie-ai) | [source recorded](https://kie.ai/logo-icon.webp) | `/logos/official-ai/kie-ai.webp` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Google NotebookLM (notebooklm) | [source recorded](https://www.gstatic.com/tailwind/_/static/branding/v6/light_mode/notebook-logo.svg) | `/logos/official-ai/notebooklm.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| HuggingChat (huggingchat) | No source URL | `/logos/huggingchat.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Groq (groq) | [source recorded](https://www.google.com/s2/favicons?domain=groq.com&sz=256) | `/logos/groq.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Google AI Studio (google-ai-studio) | [source recorded](https://www.gstatic.com/aistudio-static/mobile/ais-logo.svg) | `/logos/official-ai/google-ai-studio.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Ollama (ollama) | [source recorded](https://ollama.com/public/ollama-nav.png) | `/logos/official-ai/ollama.png` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Open WebUI (open-webui) | [source recorded](https://openwebui.com/logo.png) | `/logos/official-ai/open-webui.png` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Dify.ai (dify) | [source recorded](https://dify.ai/assets/dify-logo.svg) | `/logos/official-ai/dify.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Langflow (langflow) | [source recorded](https://www.langflow.org/_next/static/media/logo.f6f14a6e.png) | `/logos/official-ai/langflow.png` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| LocalAI (localai) | [source recorded](https://localai.io/img/logo-full.png) | `/logos/official-ai/localai.png` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| LibreChat (librechat) | [source recorded](https://www.librechat.ai/librechat.svg) | `/logos/official-ai/librechat.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Jan (jan) | [source recorded](https://www.jan.ai/_next/static/media/logo-jan.db83c5f0.svg) | `/logos/official-ai/jan.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| AnythingLLM (anythingllm) | [source recorded](https://anythingllm.com/images/brand/logo-mark.svg) | `/logos/official-ai/anythingllm.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| ComfyUI (comfyui) | [source recorded](https://comfy.org/icons/logomark.svg) | `/logos/official-ai/comfyui.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| vLLM (vllm) | [source recorded](https://vllm.ai/vLLM-Full-Logo.svg) | `/logos/official-ai/vllm.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| GPT4All (gpt4all) | No source URL | `/logos/gpt4all.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| llama.cpp (llama-cpp) | [source recorded](https://raw.githubusercontent.com/ggml-org/llama.brand/refs/heads/master/cover/llama-cpp/cover-llama-cpp-dark.svg) | `/logos/official-ai/llama-cpp.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Cursor Editor (cursor) | Site-owner-provided reference | `/logos/cursor.svg` | Replaced the old pointer glyph with a vector trace of the supplied Cursor cube mark on 2026-10-27 | Visible in the central registry and catalog; obsolete PNG fallback removed from runtime mapping | Updated asset is loaded; source is recorded as provided |
| v0 by Vercel (v0-vercel) | [source recorded](https://v0.app/chat-static/_next/static/immutable/media/logo-v0-light.442nx-e-yl-x_.svg) | `/logos/official-ai/v0-vercel.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Bolt.new (bolt-new) | No source URL | `/logos/bolt-new.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Continue (continue-dev) | [source recorded](https://continue.dev/continue-logo-black.svg) | `/logos/official-ai/continue-dev.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Qwen 2.5 Coder (qwen-coder) | [source recorded](https://assets.alicdn.com/g/qwenweb/qwen-chat-fe/0.3.20/static/images/qwen-logo.svg) | `/logos/official-ai/qwen-coder.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Replit Agent (replit-agent) | [source recorded](https://replit.com) | `/logos/official-ai/replit-agent.png` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| FLUX.1 by Black Forest Labs (flux-1) | No source URL | `/logos/flux-1.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Stable Diffusion 3.5 (stable-diffusion-3) | No source URL | `/logos/stable-diffusion-3.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Ideogram v2 (ideogram) | [source recorded](https://www.google.com/s2/favicons?domain=ideogram.ai&sz=256) | `/logos/ideogram.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Recraft AI (recraft) | No source URL | `/logos/recraft.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Leonardo.ai (leonardo-ai) | [source recorded](https://leonardo.ai/images/leonardo_wordmark.svg?dpl=dpl_EPFEypZEFK3yS5sL2ExZbfKGkUk5) | `/logos/official-ai/leonardo-ai.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Krea AI (krea-ai) | No source URL | `/logos/krea-ai.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Midjourney v6.1 (midjourney) | No source URL | `/logos/midjourney.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Runway Gen-3 Alpha (runway) | [source recorded](https://runway.com/_next/image?url=%2Fimages%2Flogos%2Frunway-app-icon.png&w=96&q=75&dpl=dpl_GqFujUqBsMTPLWNpUwKXrpSxYmHK) | `/logos/official-ai/runway.webp` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Luma Dream Machine (luma-dream-machine) | No source URL | `/logos/luma-dream-machine.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Kling AI (kling-ai) | No source URL | `/logos/kling-ai.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Pika (pika) | [source recorded](https://www.google.com/s2/favicons?domain=pika.art&sz=256) | `/logos/pika.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Haiper AI (haiper) | [source recorded](https://haiper.ai) | `/logos/official-ai/haiper.jpg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Vidu (vidu) | No source URL | `/logos/vidu.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Hailuo AI (MiniMax) (hailuo-ai) | [source recorded](https://cdn.hailuoai.video/open-hailuo-video-web/public_assets/oversea-hailuoaixminimax-logo-white-20251203.webp) | `/logos/official-ai/hailuo-ai.webp` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Dreamina (dreamina) | [source recorded](https://dreamina.capcut.com) | `/logos/official-ai/dreamina.webp` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| PixVerse (pixverse) | No source URL | `/logos/pixverse.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Wan 2.1 (Alibaba) (wan-video) | [source recorded](https://github.com/Wan-Video/Wan2.1/raw/main/assets/logo.png) | `/logos/official-ai/wan-video.png` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| LTX Video (ltx-video) | [source recorded](https://github.com/Lightricks/LTX-Video) | `/logos/official-ai/ltx-video.png` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| CogVideoX (cogvideox) | [source recorded](https://github.com/zai-org/CogVideo/raw/main/resources/logo.svg) | `/logos/official-ai/cogvideox.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Hedra (hedra) | [source recorded](https://mkt.hedra.com/_next/static/immutable/media/header-lockup.3hs46lijq_-2r.svg) | `/logos/official-ai/hedra.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Kaiber (kaiber) | No source URL | `/logos/kaiber.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Higgsfield AI (higgsfield) | [source recorded](https://www.google.com/s2/favicons?domain=higgsfield.ai&sz=256) | `/logos/higgsfield.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| ElevenLabs (elevenlabs) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/elevenlabs.svg) | `/logos/elevenlabs.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Suno (suno) | [source recorded](https://cdn-o.suno.com/splash-page/logo-cloud/Billboard_logo.svg) | `/logos/official-ai/suno.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Udio (udio) | No source URL | `/logos/udio.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Whisper by OpenAI (whisper) | [source recorded](https://github.com/openai/whisper) | `/logos/official-ai/whisper.png` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Kokoro TTS (kokoro-tts) | [source recorded](https://huggingface.co/hexgrad/Kokoro-82M) | `/logos/official-ai/kokoro-tts.png` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Make (make) | No source URL | `/logos/make.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Copy.ai (copy-ai) | [source recorded](https://cdn.prod.website-files.com/628288c5cd3e8411b90a36a4/6797ee68ae7908e605a9a4d0_copy_logo-all-dark.svg) | `/logos/official-ai/copy-ai.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Meshy 3D (meshy-3d) | [source recorded](https://www.meshy.ai) | `/logos/official-ai/meshy-3d.png` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Zapier Central (zapier-central) | No source URL | `/logos/zapier-central.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Firebase (firebase) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/firebase.svg) | `/logos/firebase.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Notion (notion) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/notion.svg) | `/logos/notion.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Airtable (airtable) | No source URL | `/logos/airtable.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Buffer (buffer) | No source URL | `/logos/buffer.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Figma (figma) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/figma.svg) | `/logos/figma.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Zapier (zapier) | No source URL | `/logos/zapier.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Google Analytics (google-analytics) | No source URL | `/logos/google-analytics.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Postman (postman) | No source URL | `/logos/postman.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Calendly (calendly) | No source URL | `/logos/calendly.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Algolia (algolia) | No source URL | `/logos/algolia.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Typeform (typeform) | No source URL | `/logos/typeform.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Google Photos (google-photos) | No source URL | `/logos/google-photos.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Claude Code (claude-code) | No source URL | `/logos/claude-code.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Google Gemini (googlegemini) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/googlegemini.svg) | `/logos/googlegemini.svg` | Asset shown in both contact sheets; identity/source not independently reverified | White neutral tile; original artwork retained | Source recorded; visual asset loaded |
| GitHub Copilot (githubcopilot) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/githubcopilot.svg) | `/logos/githubcopilot.svg` | Asset shown in both contact sheets; identity/source not independently reverified | White neutral tile; original artwork retained | Source recorded; visual asset loaded |
| Microsoft (microsoft) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/microsoft.svg) | `/logos/microsoft.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Amazon Web Services (aws) | No source URL | `/logos/aws.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| JetBrains (jetbrains) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/jetbrains.svg) | `/logos/jetbrains.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Microsoft Azure (azure) | No source URL | `/logos/azure.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Adobe (adobe) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/adobe.svg) | `/logos/adobe.svg` | Asset shown in both contact sheets; identity/source not independently reverified | White neutral tile; original artwork retained | Source recorded; visual asset loaded |
| Google Cloud (googlecloud) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/googlecloud.svg) | `/logos/googlecloud.svg` | Asset shown in both contact sheets; identity/source not independently reverified | White neutral tile; original artwork retained | Source recorded; visual asset loaded |
| Canva (canva) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/canva.svg) | `/logos/canva.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
| Cloudflare (cloudflare) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/cloudflare.svg) | `/logos/cloudflare.svg` | Asset shown in both contact sheets; identity/source not independently reverified | White neutral tile; original artwork retained | Source recorded; visual asset loaded |
| Vercel (vercel) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/vercel.svg) | `/logos/vercel.svg` | Asset shown in both contact sheets; identity/source not independently reverified | White neutral tile; original artwork retained | Source recorded; visual asset loaded |
| OpenAI (openai) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/openai.svg) | `/logos/openai.svg` | Asset shown in both contact sheets; identity/source not independently reverified | White neutral tile; original artwork retained | Source recorded; visual asset loaded |
| Anthropic (anthropic) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/anthropic.svg) | `/logos/anthropic.svg` | Asset shown in both contact sheets; identity/source not independently reverified | White neutral tile; original artwork retained | Source recorded; visual asset loaded |
| MongoDB (mongodb) | No source URL | `/logos/fallback-mongodb.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Oracle Cloud (oracle) | No source URL | `/logos/fallback-oracle.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Neon (neon) | No source URL | `/logos/fallback-neon.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| Turso (turso) | No source URL | `/logos/fallback-turso.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |
| IBM Cloud (ibmcloud) | No source URL | `/logos/fallback-ibmcloud.svg` | Unresolved; neutral monogram fallback | Visible in light/dark sheet; no targeted change | Unresolved; fallback shown |

## Video catalog identity follow-up (2026-10-23)

The following newly added video catalog identities use neutral initials fallbacks because no traceable official logo source was confirmed. These assets are not rendered as brand marks.

| Tool | Slug | Local asset | Status | Provenance |
| --- | --- | --- | --- | --- |
| Agnes Video Generator (`agnes-video-generator`) | `agnes-video-generator` | `/logos/fallback-agnes-video-generator.svg` | unverified; neutral fallback shown | No source URL recorded |
| Automated Video Generator (`automated-video-generator`) | `automated-video-generator` | `/logos/fallback-automated-video-generator.svg` | unverified; neutral fallback shown | No source URL recorded |
| VUZA (`vuza`) | `vuza` | `/logos/fallback-vuza.svg` | unverified; neutral fallback shown | No source URL recorded |
| PurffleShorts (`purffle-shorts`) | `purffle-shorts` | `/logos/fallback-purffle-shorts.svg` | unverified; neutral fallback shown | No source URL recorded |
| Open Generative AI (`open-generative-ai`) | `open-generative-ai` | `/logos/fallback-open-generative-ai.svg` | unverified; neutral fallback shown | No source URL recorded |
| Wan 2.2 (`wan-2-2`) | `wan-2-2` | `/logos/fallback-wan-2-2.svg` | unverified; neutral fallback shown | No source URL recorded |
| LTX-2.3 (`ltx-2-3`) | `ltx-2-3` | `/logos/fallback-ltx-2-3.svg` | unverified; neutral fallback shown | No source URL recorded |
| HunyuanVideo (`hunyuanvideo`) | `hunyuanvideo` | `/logos/fallback-hunyuanvideo.svg` | unverified; neutral fallback shown | No source URL recorded |
| HunyuanVideo-I2V (`hunyuanvideo-i2v`) | `hunyuanvideo-i2v` | `/logos/fallback-hunyuanvideo-i2v.svg` | unverified; neutral fallback shown | No source URL recorded |
| Hugging Face Video Spaces (`huggingface-video-spaces`) | `huggingface-video-spaces` | `/logos/fallback-huggingface-video-spaces.svg` | unverified; neutral fallback shown | No source URL recorded |
| InVideo AI (`invideo-ai`) | `invideo-ai` | `/logos/fallback-invideo-ai.svg` | unverified; neutral fallback shown | No source URL recorded |
| Pictory (`pictory`) | `pictory` | `/logos/fallback-pictory.svg` | unverified; neutral fallback shown | No source URL recorded |
| Synthesia (`synthesia`) | `synthesia` | `/logos/fallback-synthesia.svg` | unverified; neutral fallback shown | No source URL recorded |
| Fliki (`fliki`) | `fliki` | `/logos/fallback-fliki.svg` | unverified; neutral fallback shown | No source URL recorded |
| Opus Clip (`opus-clip`) | `opus-clip` | `/logos/fallback-opus-clip.svg` | unverified; neutral fallback shown | No source URL recorded |
| Klap (`klap`) | `klap` | `/logos/fallback-klap.svg` | unverified; neutral fallback shown | No source URL recorded |

| GitHub Copilot (`github-copilot`) | Simple Icons GitHub Copilot mark | `/logos/githubcopilot.svg` | Source recorded; verified 2026-10-18 | [Simple Icons asset](https://cdn.jsdelivr.net/npm/simple-icons/icons/githubcopilot.svg); not a full wordmark |

| `github-copilot` | `/logos/githubcopilot.svg` | Simple Icons source recorded; not a full wordmark |


## Ox Alpha logo addition (2026-11-01)

| Slug | Asset | Provenance |
| --- | --- | --- |
| `ox-alpha` | `/logos/oxalpha.svg` | User-provided logo artwork recreated as a vector asset for the SwitchRoute directory. |

## Import addendum (2026-11-14)

The openalternative.co import added 782 open-source tools and 945 proprietary targets. The rows below record every active catalog identity from that import that was not already recorded in this report, generated from the canonical registry (`public/logo-manifest.json`, 1,906 entries) on 2026-11-14. Status follows the index above: `verified` means a Simple Icons or official source URL is recorded for the mark; `unverified` means no traceable source is recorded and `BrandLogo` shows its neutral initials fallback. 1707 identities are recorded here: 425 verified and 1282 unverified.

| Tool | Slug | Local asset | Status | Provenance |
| --- | --- | --- | --- | --- |
| 1Panel | `1panel` | `/logos/1panel.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/1panel.svg` |
| 1Password | `1password` | `/logos/1password.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/1password.svg` |
| 2FAS | `2fas` | `/logos/2fas.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/2fas.svg` |
| 3Commas | `3commas` | `/logos/fallback-3commas.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Abby | `abby` | `/logos/fallback-abby.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ableton Live | `ableton-live` | `/logos/fallback-ableton-live.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ACI.dev | `aci-dev` | `/logos/fallback-aci-dev.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Acquia DAM | `acquia-dam` | `/logos/fallback-acquia-dam.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ActiveCampaign | `activecampaign` | `/logos/fallback-activecampaign.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Activeloop | `activeloop` | `/logos/activeloop.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/activeloop.svg` |
| ActivePieces | `activepieces` | `/logos/fallback-activepieces.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ActivityWatch | `activitywatch` | `/logos/fallback-activitywatch.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Actual | `actual` | `/logos/fallback-actual.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AdGuard | `adguard` | `/logos/adguard.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/adguard.svg` |
| Adobe Audition | `adobe-audition` | `/logos/fallback-adobe-audition.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Adobe Commerce | `adobe-commerce` | `/logos/fallback-adobe-commerce.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Adobe Illustrator | `adobe-illustrator` | `/logos/fallback-adobe-illustrator.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Adobe Lightroom | `adobe-lightroom` | `/logos/fallback-adobe-lightroom.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Adobe XD | `adobe-xd` | `/logos/fallback-adobe-xd.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Aegis Authenticator | `aegis-authenticator` | `/logos/aegis-authenticator.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/aegisauthenticator.svg` |
| Affinity Photo | `affinity-photo` | `/logos/fallback-affinity-photo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Agent Zero | `agent-zero` | `/logos/fallback-agent-zero.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Agenta | `agenta` | `/logos/fallback-agenta.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Agno | `agno` | `/logos/fallback-agno.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ahrefs | `ahrefs` | `/logos/fallback-ahrefs.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Airbyte | `airbyte` | `/logos/airbyte.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/airbyte.svg` |
| Airplane | `airplane` | `/logos/fallback-airplane.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Akaunting | `akaunting` | `/logos/akaunting.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/akaunting.svg` |
| Akeneo | `akeneo` | `/logos/fallback-akeneo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Alacritty | `alacritty` | `/logos/alacritty.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/alacritty.svg` |
| Alarik | `alarik` | `/logos/fallback-alarik.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Alfred | `alfred` | `/logos/alfred.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/alfred.svg` |
| Alice | `alice` | `/logos/fallback-alice.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Alokai | `alokai` | `/logos/fallback-alokai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| alphai-tui | `alphai-tui` | `/logos/fallback-alphai-tui.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ALTCHA | `altcha` | `/logos/fallback-altcha.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Amazon Alexa | `amazon-alexa` | `/logos/fallback-amazon-alexa.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Amazon API Gateway | `amazon-api-gateway` | `/logos/fallback-amazon-api-gateway.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Amazon Bedrock AgentCore | `amazon-bedrock-agentcore` | `/logos/fallback-amazon-bedrock-agentcore.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Amazon CodeCatalyst | `amazon-codecatalyst` | `/logos/fallback-amazon-codecatalyst.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Amazon Neptune | `amazon-neptune` | `/logos/fallback-amazon-neptune.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Amazon Prime | `amazon-prime` | `/logos/fallback-amazon-prime.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Amazon S3 | `amazon-s3` | `/logos/fallback-amazon-s3.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Amazon SQS | `amazon-sqs` | `/logos/fallback-amazon-sqs.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Amazon Timestream | `amazon-timestream` | `/logos/fallback-amazon-timestream.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Amical | `amical` | `/logos/fallback-amical.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Amp | `amp` | `/logos/amp.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/amp.svg` |
| Amplitude | `amplitude` | `/logos/fallback-amplitude.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Anarlog | `anarlog` | `/logos/fallback-anarlog.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Anchor Browser | `anchor-browser` | `/logos/fallback-anchor-browser.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AngelList | `angellist` | `/logos/fallback-angellist.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Anki | `anki` | `/logos/anki.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/anki.svg` |
| Ansvisor | `ansvisor` | `/logos/fallback-ansvisor.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Anthias | `anthias` | `/logos/fallback-anthias.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Antigravity | `antigravity` | `/logos/fallback-antigravity.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Any.do | `any-do` | `/logos/fallback-any-do.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AnyDesk | `anydesk` | `/logos/anydesk.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/anydesk.svg` |
| Anything | `anything` | `/logos/fallback-anything.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apache Answer | `apache-answer` | `/logos/fallback-apache-answer.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apache APISIX | `apache-apisix` | `/logos/fallback-apache-apisix.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apache Druid | `apache-druid` | `/logos/apache-druid.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/apachedruid.svg` |
| Apache IoTDB | `apache-iotdb` | `/logos/fallback-apache-iotdb.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apache Pinot | `apache-pinot` | `/logos/fallback-apache-pinot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apache SkyWalking | `apache-skywalking` | `/logos/fallback-apache-skywalking.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apache Superset | `apache-superset` | `/logos/apache-superset.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/apachesuperset.svg` |
| Apideck | `apideck` | `/logos/fallback-apideck.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apidog | `apidog` | `/logos/fallback-apidog.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apify | `apify` | `/logos/fallback-apify.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apigee | `apigee` | `/logos/fallback-apigee.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AITable | `apitable` | `/logos/fallback-apitable.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apollo GraphQL | `apollo-graphql` | `/logos/apollo-graphql.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/apollographql.svg` |
| AppCleaner | `appcleaner` | `/logos/fallback-appcleaner.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Appcues | `appcues` | `/logos/fallback-appcues.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AppDynamics | `appdynamics` | `/logos/fallback-appdynamics.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Appflow | `appflow` | `/logos/fallback-appflow.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Appgate | `appgate` | `/logos/fallback-appgate.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Appian | `appian` | `/logos/appian.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/appian.svg` |
| Apple AirDrop | `apple-airdrop` | `/logos/fallback-apple-airdrop.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apple Mail | `apple-mail` | `/logos/fallback-apple-mail.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apple Maps | `apple-maps` | `/logos/fallback-apple-maps.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apple Music | `apple-music` | `/logos/apple-music.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/applemusic.svg` |
| Apple Notes | `apple-notes` | `/logos/fallback-apple-notes.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apple Photos | `apple-photos` | `/logos/fallback-apple-photos.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Applitools | `applitools` | `/logos/fallback-applitools.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Appsheet | `appsheet` | `/logos/fallback-appsheet.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AppSmith | `appsmith` | `/logos/appsmith.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/appsmith.svg` |
| Appwrite | `appwrite` | `/logos/appwrite.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/appwrite.svg` |
| Aptabase | `aptabase` | `/logos/fallback-aptabase.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Aqua Voice | `aqua-voice` | `/logos/fallback-aqua-voice.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Arc | `arc` | `/logos/arc.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/arc.svg` |
| Argos | `argos` | `/logos/argos.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/argos.svg` |
| Arize | `arize` | `/logos/fallback-arize.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Arize Phoenix | `arize-phoenix` | `/logos/fallback-arize-phoenix.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Asana | `asana` | `/logos/asana.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/asana.svg` |
| Aseprite | `aseprite` | `/logos/aseprite.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/aseprite.svg` |
| Ashby | `ashby` | `/logos/fallback-ashby.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AspenTech InfoPlus.21 | `aspentech-infoplus-21` | `/logos/fallback-aspentech-infoplus-21.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Asset Panda | `asset-panda` | `/logos/fallback-asset-panda.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Astronomer | `astronomer` | `/logos/fallback-astronomer.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Athas | `athas` | `/logos/fallback-athas.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AthenaHQ | `athenahq` | `/logos/fallback-athenahq.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Atlas Browser | `atlas` | `/logos/fallback-atlas.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Atomic CRM | `atomic-crm` | `/logos/fallback-atomic-crm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Attio | `attio` | `/logos/fallback-attio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Audacity | `audacity` | `/logos/audacity.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/audacity.svg` |
| AudioPen | `audiopen` | `/logos/fallback-audiopen.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Auth0 | `auth0` | `/logos/auth0.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/auth0.svg` |
| Authentik | `authentik` | `/logos/authentik.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/authentik.svg` |
| Authgear | `authgear` | `/logos/fallback-authgear.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Authy | `authy` | `/logos/fallback-authy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AutoGPT | `autogpt` | `/logos/fallback-autogpt.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Automatisch | `automatisch` | `/logos/fallback-automatisch.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AutoMQ | `automq` | `/logos/fallback-automq.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AutoSend | `autosend` | `/logos/fallback-autosend.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Auvik | `auvik` | `/logos/fallback-auvik.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AVEVA PI System | `aveva-pi-system` | `/logos/fallback-aveva-pi-system.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Amazon Web Services | `aws` | `/logos/aws.svg` | unverified | Verification gap: the existing local mark has no traceable source and is withheld from display. BrandLogo shows its neutral initials fallback until a verified source is recorded. |
| AWS Aurora | `aws-aurora` | `/logos/fallback-aws-aurora.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AWS Cognito | `aws-cognito` | `/logos/fallback-aws-cognito.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AWS GuardDuty | `aws-guardduty` | `/logos/fallback-aws-guardduty.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AWS Kendra | `aws-kendra` | `/logos/fallback-aws-kendra.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AWS SES | `aws-ses` | `/logos/fallback-aws-ses.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AWS Step Functions | `aws-step-functions` | `/logos/fallback-aws-step-functions.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| AxCrypt | `axcrypt` | `/logos/fallback-axcrypt.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Axiom | `axiom` | `/logos/fallback-axiom.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Azimutt | `azimutt` | `/logos/fallback-azimutt.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Azure AD | `azure-ad` | `/logos/fallback-azure-ad.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Azure Blob Storage | `azure-blob-storage` | `/logos/fallback-azure-blob-storage.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Azure Data Explorer | `azure-data-explorer` | `/logos/fallback-azure-data-explorer.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Azure Data Factory | `azure-data-factory` | `/logos/fallback-azure-data-factory.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Azure Durable Functions | `azure-durable-functions` | `/logos/fallback-azure-durable-functions.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Azure Logic Apps | `azure-logic-apps` | `/logos/fallback-azure-logic-apps.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Backblaze | `backblaze` | `/logos/backblaze.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/backblaze.svg` |
| Bagisto | `bagisto` | `/logos/fallback-bagisto.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ballerine | `ballerine` | `/logos/fallback-ballerine.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| BambooHR | `bamboohr` | `/logos/fallback-bamboohr.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Bandicam | `bandicam` | `/logos/fallback-bandicam.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Base44 | `base44` | `/logos/fallback-base44.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Basecamp | `basecamp` | `/logos/basecamp.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/basecamp.svg` |
| bb | `bb` | `/logos/bb.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/obb.svg` |
| Beam | `beam` | `/logos/fallback-beam.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Beaver Notes | `beaver-notes` | `/logos/fallback-beaver-notes.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Beehiiv | `beehiiv` | `/logos/fallback-beehiiv.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Bench | `bench` | `/logos/fallback-bench.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Bento | `bento` | `/logos/bento.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/bento.svg` |
| Bento.me | `bento-me` | `/logos/fallback-bento-me.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Better Auth | `better-auth` | `/logos/better-auth.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/betterauth.svg` |
| Betterlytics | `betterlytics` | `/logos/fallback-betterlytics.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| BetterStack | `betterstack` | `/logos/betterstack.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/betterstack.svg` |
| Bifrost | `bifrost` | `/logos/fallback-bifrost.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Bigcapital | `bigcapital` | `/logos/fallback-bigcapital.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| BigCommerce | `bigcommerce` | `/logos/bigcommerce.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/bigcommerce.svg` |
| BigQuery | `bigquery` | `/logos/fallback-bigquery.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Billion Mail | `billion-mail` | `/logos/fallback-billion-mail.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Billsby | `billsby` | `/logos/fallback-billsby.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Bing | `bing` | `/logos/fallback-bing.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Bing Maps | `bing-maps` | `/logos/fallback-bing-maps.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Bio.fm | `bio-fm` | `/logos/fallback-bio-fm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| BitBucket | `bitbucket` | `/logos/bitbucket.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/bitbucket.svg` |
| Bitly | `bitly` | `/logos/bitly.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/bitly.svg` |
| Bitwarden | `bitwarden` | `/logos/bitwarden.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/bitwarden.svg` |
| Bknd | `bknd` | `/logos/fallback-bknd.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| BlackBoard | `blackboard` | `/logos/fallback-blackboard.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Blaxel | `blaxel` | `/logos/fallback-blaxel.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| BleachBit | `bleachbit` | `/logos/fallback-bleachbit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Blinko | `blinko` | `/logos/fallback-blinko.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| BlitzRecorder | `blitzrecorder` | `/logos/fallback-blitzrecorder.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Bloomberg Terminal | `bloomberg-terminal` | `/logos/fallback-bloomberg-terminal.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Bluesky | `bluesky` | `/logos/bluesky.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/bluesky.svg` |
| BoltAI | `boltai` | `/logos/fallback-boltai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Bookmark It | `bookmark-it` | `/logos/fallback-bookmark-it.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Botpress | `botpress` | `/logos/fallback-botpress.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Box | `box` | `/logos/box.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/box.svg` |
| Boxcryptor | `boxcryptor` | `/logos/fallback-boxcryptor.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Brace.to | `brace-to` | `/logos/fallback-brace-to.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Brainscape | `brainscape` | `/logos/fallback-brainscape.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Braintrust | `braintrust` | `/logos/braintrust.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/braintrust.svg` |
| Brandfolder | `brandfolder` | `/logos/brandfolder.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/brandfolder.svg` |
| Brave | `brave` | `/logos/brave.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/brave.svg` |
| Brave Search | `brave-search` | `/logos/fallback-brave-search.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Braze | `braze` | `/logos/fallback-braze.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Breezy HR | `breezy-hr` | `/logos/fallback-breezy-hr.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Brevo | `brevo` | `/logos/brevo.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/brevo.svg` |
| Bright Data | `bright-data` | `/logos/fallback-bright-data.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Browser Operator | `browser-operator` | `/logos/fallback-browser-operator.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Browser Use | `browser-use` | `/logos/fallback-browser-use.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Browserbase | `browserbase` | `/logos/fallback-browserbase.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Bruno | `bruno` | `/logos/bruno.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/bruno.svg` |
| Bucket | `bucket` | `/logos/fallback-bucket.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Budibase | `budibase` | `/logos/budibase.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/budibase.svg` |
| Bugbot | `bugbot` | `/logos/fallback-bugbot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| BugHerd | `bugherd` | `/logos/fallback-bugherd.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| BugPin | `bugpin` | `/logos/fallback-bugpin.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Bugsink | `bugsink` | `/logos/fallback-bugsink.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Bugsnag | `bugsnag` | `/logos/fallback-bugsnag.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Builder | `builder` | `/logos/fallback-builder.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| bull-board | `bull-board` | `/logos/fallback-bull-board.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Busabase | `busabase` | `/logos/fallback-busabase.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Buttondown | `buttondown` | `/logos/fallback-buttondown.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Buzz | `buzz` | `/logos/fallback-buzz.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Bynder | `bynder` | `/logos/fallback-bynder.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ByteChef | `bytechef` | `/logos/fallback-bytechef.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| c15t | `c15t` | `/logos/fallback-c15t.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Calendesk | `calendesk` | `/logos/fallback-calendesk.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Campaign Monitor | `campaign-monitor` | `/logos/campaign-monitor.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/campaignmonitor.svg` |
| Campfire | `campfire` | `/logos/fallback-campfire.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Campsite | `campsite` | `/logos/fallback-campsite.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Camtasia | `camtasia` | `/logos/fallback-camtasia.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Canary Mail | `canary-mail` | `/logos/fallback-canary-mail.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Canny | `canny` | `/logos/fallback-canny.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Canonry | `canonry` | `/logos/fallback-canonry.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Canto | `canto` | `/logos/fallback-canto.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Canva | `canva` | `/logos/canva.svg` | verified | Official source: `cdn.jsdelivr.net/npm/simple-icons/icons/canva.svg` |
| Cap | `cap` | `/logos/fallback-cap.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Capacity | `capacity` | `/logos/fallback-capacity.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Capawesome | `capawesome` | `/logos/fallback-capawesome.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CapCut | `capcut` | `/logos/capcut.svg` | unverified | Website favicon fallback; visually review before using as a logo |
| Capd | `capd` | `/logos/fallback-capd.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Capgo | `capgo` | `/logos/fallback-capgo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cap | `capjs` | `/logos/fallback-capjs.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Capture One | `capture-one` | `/logos/fallback-capture-one.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Carbonite | `carbonite` | `/logos/fallback-carbonite.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Carrd | `carrd` | `/logos/carrd.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/carrd.svg` |
| Carta | `carta` | `/logos/fallback-carta.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CasaOS | `casaos` | `/logos/fallback-casaos.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CCleaner | `ccleaner` | `/logos/ccleaner.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/ccleaner.svg` |
| Cerbos | `cerbos` | `/logos/fallback-cerbos.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Changes.Page | `changes-page` | `/logos/fallback-changes-page.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Chanty | `chanty` | `/logos/fallback-chanty.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Chapar | `chapar` | `/logos/fallback-chapar.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Chargebee | `chargebee` | `/logos/fallback-chargebee.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Chartbrew | `chartbrew` | `/logos/fallback-chartbrew.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Chat2DB | `chat2db` | `/logos/fallback-chat2db.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Chatbase | `chatbase` | `/logos/fallback-chatbase.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ChatBot | `chatbot` | `/logos/chatbot.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/chatbot.svg` |
| ChatbotX | `chatbotx` | `/logos/fallback-chatbotx.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Chatfuel | `chatfuel` | `/logos/fallback-chatfuel.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ChatGPT Work | `chatgpt-work` | `/logos/fallback-chatgpt-work.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ChatPDF | `chatpdf` | `/logos/fallback-chatpdf.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Chatwoot | `chatwoot` | `/logos/chatwoot.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/chatwoot.svg` |
| Checkly | `checkly` | `/logos/fallback-checkly.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Checkmate | `checkmate` | `/logos/fallback-checkmate.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Checkmk | `checkmk` | `/logos/checkmk.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/checkmk.svg` |
| Cherry Studio | `cherry-studio` | `/logos/fallback-cherry-studio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Chobble Tickets | `chobble-tickets` | `/logos/fallback-chobble-tickets.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Chroma | `chroma` | `/logos/chroma.svg` | unverified | Website favicon fallback; visually review before using as a logo |
| Chromatic | `chromatic` | `/logos/chromatic.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/chromatic.svg` |
| Chronosphere | `chronosphere` | `/logos/fallback-chronosphere.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cinny | `cinny` | `/logos/cinny.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/cinny.svg` |
| Circle | `circle` | `/logos/circle.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/circle.svg` |
| CircleCI | `circleci` | `/logos/circleci.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/circleci.svg` |
| Cisco Secure Access | `cisco-secure-access` | `/logos/fallback-cisco-secure-access.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ClassroomIO | `classroomio` | `/logos/fallback-classroomio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Claude Cowork | `claude-cowork` | `/logos/fallback-claude-cowork.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Claude Duet | `claude-duet` | `/logos/fallback-claude-duet.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Claude Managed Agents | `claude-managed-agents` | `/logos/fallback-claude-managed-agents.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Clay | `clay` | `/logos/fallback-clay.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CleanMyMac | `cleanmymac` | `/logos/fallback-cleanmymac.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CleanShot | `cleanshot` | `/logos/fallback-cleanshot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ClearFlask | `clearflask` | `/logos/fallback-clearflask.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Clerk | `clerk` | `/logos/clerk.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/clerk.svg` |
| ClickHouse | `clickhouse` | `/logos/clickhouse.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/clickhouse.svg` |
| ClickUp | `clickup` | `/logos/clickup.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/clickup.svg` |
| Clockify | `clockify` | `/logos/clockify.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/clockify.svg` |
| Clockwise | `clockwise` | `/logos/fallback-clockwise.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Close | `close` | `/logos/fallback-close.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Apache Cloudberry | `cloudberry` | `/logos/fallback-cloudberry.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CloudCannon | `cloudcannon` | `/logos/cloudcannon.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/cloudcannon.svg` |
| Cloudflare Access | `cloudflare-access` | `/logos/fallback-cloudflare-access.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cloudflare AI Gateway | `cloudflare-ai-gateway` | `/logos/fallback-cloudflare-ai-gateway.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cloudflare Analytics | `cloudflare-analytics` | `/logos/fallback-cloudflare-analytics.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cloudflare R2 | `cloudflare-r2` | `/logos/fallback-cloudflare-r2.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cloudflare Tunnel | `cloudflare-tunnel` | `/logos/fallback-cloudflare-tunnel.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cloudflare Turnstile | `cloudflare-turnstile` | `/logos/fallback-cloudflare-turnstile.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cloudflare Workers | `cloudflare-workers` | `/logos/cloudflare-workers.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/cloudflareworkers.svg` |
| Cloudinary | `cloudinary` | `/logos/cloudinary.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/cloudinary.svg` |
| Cloudmark | `cloudmark` | `/logos/fallback-cloudmark.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CloudQuery | `cloudquery` | `/logos/fallback-cloudquery.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cloudron | `cloudron` | `/logos/cloudron.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/cloudron.svg` |
| CocoIndex | `cocoindex` | `/logos/fallback-cocoindex.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Coda | `coda` | `/logos/coda.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/coda.svg` |
| Code Time | `code-time` | `/logos/fallback-code-time.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CodeAnt AI | `codeant-ai` | `/logos/fallback-codeant-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CodeEdit | `codeedit` | `/logos/fallback-codeedit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Codegen | `codegen` | `/logos/fallback-codegen.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CodeGPT | `codegpt` | `/logos/fallback-codegpt.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Coder | `coder` | `/logos/coder.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/coder.svg` |
| CodeRabbit | `coderabbit` | `/logos/coderabbit.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/coderabbit.svg` |
| Codev | `codev` | `/logos/fallback-codev.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Codex | `codex` | `/logos/fallback-codex.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Codex CLI | `codex-cli` | `/logos/fallback-codex-cli.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CodeZero | `codezero` | `/logos/fallback-codezero.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Codync | `codync` | `/logos/fallback-codync.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Colanode | `colanode` | `/logos/fallback-colanode.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Collabora Online | `collabora-online` | `/logos/collabora-online.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/collaboraonline.svg` |
| CoMaps | `comaps` | `/logos/fallback-comaps.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Comet Browser | `comet` | `/logos/fallback-comet.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Comet Backup | `comet-backup` | `/logos/fallback-comet-backup.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Comma | `comma` | `/logos/comma.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/comma.svg` |
| CommerceTools | `commercetools` | `/logos/fallback-commercetools.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Comp AI | `comp` | `/logos/fallback-comp.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Compositor | `compositor` | `/logos/fallback-compositor.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Conar | `conar` | `/logos/fallback-conar.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Conductor | `conductor` | `/logos/fallback-conductor.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ConfigCat | `configcat` | `/logos/fallback-configcat.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Confluence | `confluence` | `/logos/confluence.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/confluence.svg` |
| Contentful | `contentful` | `/logos/contentful.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/contentful.svg` |
| Contentport | `contentport` | `/logos/fallback-contentport.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Context.dev | `context-dev` | `/logos/fallback-context-dev.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Continue | `continue` | `/logos/fallback-continue.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Convertigo | `convertigo` | `/logos/fallback-convertigo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kit (ConvertKit) | `convertkit` | `/logos/fallback-convertkit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Convex | `convex` | `/logos/convex.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/convex.svg` |
| Cookie Control | `cookie-control` | `/logos/fallback-cookie-control.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CookieYes | `cookieyes` | `/logos/fallback-cookieyes.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Coolify | `coolify` | `/logos/coolify.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/coolify.svg` |
| Copilot Autopilot | `copilot-autopilot` | `/logos/fallback-copilot-autopilot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Copilot Money | `copilot-money` | `/logos/fallback-copilot-money.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CopilotKit | `copilotkit` | `/logos/fallback-copilotkit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Copper | `copper` | `/logos/fallback-copper.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cora | `cora` | `/logos/cora.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/cora.svg` |
| Coralogix | `coralogix` | `/logos/fallback-coralogix.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Coroot | `coroot` | `/logos/fallback-coroot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Corpus | `corpus` | `/logos/fallback-corpus.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cossistant | `cossistant` | `/logos/fallback-cossistant.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Countly | `countly` | `/logos/fallback-countly.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Courier | `courier` | `/logos/fallback-courier.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CourseLit | `courselit` | `/logos/fallback-courselit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Coursera | `coursera` | `/logos/coursera.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/coursera.svg` |
| Coveo | `coveo` | `/logos/fallback-coveo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cozy | `cozy` | `/logos/fallback-cozy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cozystack | `cozystack` | `/logos/fallback-cozystack.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| cPanel | `cpanel` | `/logos/cpanel.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/cpanel.svg` |
| Craft | `craft` | `/logos/fallback-craft.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CrateDB | `cratedb` | `/logos/cratedb.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/cratedb.svg` |
| Crater | `crater` | `/logos/fallback-crater.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Crawl4AI | `crawl4ai` | `/logos/fallback-crawl4ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Creem | `creem` | `/logos/fallback-creem.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cribl Stream | `cribl-stream` | `/logos/fallback-cribl-stream.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Crisp | `crisp` | `/logos/fallback-crisp.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CRM | `crm` | `/logos/fallback-crm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cronitor | `cronitor` | `/logos/fallback-cronitor.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Crowdin | `crowdin` | `/logos/crowdin.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/crowdin.svg` |
| Cryptomator | `cryptomator` | `/logos/cryptomator.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/cryptomator.svg` |
| CryptPad | `cryptpad` | `/logos/cryptpad.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/cryptpad.svg` |
| Cube | `cube` | `/logos/fallback-cube.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Customer.io | `customer-io` | `/logos/fallback-customer-io.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Customermates | `customermates` | `/logos/fallback-customermates.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cvent | `cvent` | `/logos/fallback-cvent.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| CyberArk | `cyberark` | `/logos/fallback-cyberark.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Cycle | `cycle` | `/logos/fallback-cycle.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dagu | `dagu` | `/logos/fallback-dagu.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| DaisyDisk | `daisydisk` | `/logos/fallback-daisydisk.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Darktable | `darktable` | `/logos/fallback-darktable.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Darkwrite | `darkwrite` | `/logos/fallback-darkwrite.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dash0 | `dash0` | `/logos/dash0.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/dash0.svg` |
| Dashlane | `dashlane` | `/logos/dashlane.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/dashlane.svg` |
| Databend | `databend` | `/logos/fallback-databend.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Databox | `databox` | `/logos/fallback-databox.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Databuddy | `databuddy` | `/logos/fallback-databuddy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| DataDog | `datadog` | `/logos/datadog.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/datadog.svg` |
| DataFast | `datafast` | `/logos/fallback-datafast.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| DataForSEO | `dataforseo` | `/logos/fallback-dataforseo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| DataGrip | `datagrip` | `/logos/datagrip.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/datagrip.svg` |
| DaVinci Resolve | `davinci-resolve` | `/logos/davinci-resolve.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/davinciresolve.svg` |
| Daytona | `daytona` | `/logos/fallback-daytona.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| dbdiagram.io | `dbdiagram-io` | `/logos/fallback-dbdiagram-io.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| DBeaver | `dbeaver` | `/logos/dbeaver.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/dbeaver.svg` |
| dDocs | `ddocs` | `/logos/fallback-ddocs.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Decagon | `decagon` | `/logos/fallback-decagon.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Deel | `deel` | `/logos/fallback-deel.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Deepnote | `deepnote` | `/logos/deepnote.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/deepnote.svg` |
| Deezer | `deezer` | `/logos/deezer.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/deezer.svg` |
| Defguard | `defguard` | `/logos/fallback-defguard.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Delve | `delve` | `/logos/fallback-delve.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Demi AI | `demi-ai` | `/logos/fallback-demi-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| DeskTime | `desktime` | `/logos/fallback-desktime.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Deta Surf | `deta-surf` | `/logos/fallback-deta-surf.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| /dev/push | `dev-push` | `/logos/fallback-dev-push.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Devin | `devin` | `/logos/fallback-devin.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dext | `dext` | `/logos/fallback-dext.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dia Browser | `dia` | `/logos/fallback-dia.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dialzara | `dialzara` | `/logos/fallback-dialzara.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Digg | `digg` | `/logos/digg.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/digg.svg` |
| Digger | `digger` | `/logos/fallback-digger.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| DigitalOcean | `digitalocean` | `/logos/digitalocean.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/digitalocean.svg` |
| DirectAdmin | `directadmin` | `/logos/fallback-directadmin.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Discord | `discord` | `/logos/discord.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/discord.svg` |
| Discourse | `discourse` | `/logos/discourse.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/discourse.svg` |
| Dittofeed | `dittofeed` | `/logos/fallback-dittofeed.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Docker Desktop | `docker-desktop` | `/logos/fallback-docker-desktop.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Docker Swarm | `docker-swarm` | `/logos/fallback-docker-swarm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Docs | `docs` | `/logos/fallback-docs.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| DocsBot | `docsbot` | `/logos/fallback-docsbot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| DocSend | `docsend` | `/logos/fallback-docsend.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Documenso | `documenso` | `/logos/fallback-documenso.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Docuseal | `docuseal` | `/logos/fallback-docuseal.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| DocuSign | `docusign` | `/logos/fallback-docusign.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Docuware | `docuware` | `/logos/fallback-docuware.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dodo Payments | `dodo-payments` | `/logos/dodo-payments.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/dodopayments.svg` |
| Dograh | `dograh` | `/logos/fallback-dograh.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dokku | `dokku` | `/logos/fallback-dokku.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dokploy | `dokploy` | `/logos/fallback-dokploy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Donetick | `donetick` | `/logos/fallback-donetick.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Doodle | `doodle` | `/logos/fallback-doodle.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Doppler | `doppler` | `/logos/fallback-doppler.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dragon | `dragon` | `/logos/fallback-dragon.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Drata | `drata` | `/logos/fallback-drata.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| draw.io | `draw-io` | `/logos/fallback-draw-io.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| drawDB | `drawdb` | `/logos/fallback-drawdb.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| DrawSQL | `drawsql` | `/logos/fallback-drawsql.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dray | `dray` | `/logos/fallback-dray.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Drools | `drools` | `/logos/fallback-drools.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dropbox | `dropbox` | `/logos/dropbox.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/dropbox.svg` |
| Drovio | `drovio` | `/logos/fallback-drovio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Drupal | `drupal` | `/logos/drupal.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/drupal.svg` |
| dstack | `dstack` | `/logos/fallback-dstack.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dub Links | `dub-links` | `/logos/fallback-dub-links.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| DuckDuckGo | `duckduckgo` | `/logos/duckduckgo.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/duckduckgo.svg` |
| Duplicacy | `duplicacy` | `/logos/fallback-duplicacy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dust | `dust` | `/logos/fallback-dust.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| DxO PhotoLab | `dxo-photolab` | `/logos/fallback-dxo-photolab.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dyad | `dyad` | `/logos/fallback-dyad.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Dynatrace | `dynatrace` | `/logos/dynatrace.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/dynatrace.svg` |
| Dyrector | `dyrector` | `/logos/fallback-dyrector.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| E2B | `e2b` | `/logos/fallback-e2b.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Easy!Appointments | `easy-appointments` | `/logos/fallback-easy-appointments.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| EasyMonitor | `easymonitor` | `/logos/fallback-easymonitor.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ecwid | `ecwid` | `/logos/fallback-ecwid.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Eden AI | `eden-ai` | `/logos/fallback-eden-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ego lite | `ego-lite` | `/logos/fallback-ego-lite.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Eigent | `eigent` | `/logos/fallback-eigent.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ElasticSearch | `elasticsearch` | `/logos/elasticsearch.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/elasticsearch.svg` |
| Element | `element` | `/logos/element.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/element.svg` |
| Elementary Data | `elementary-data` | `/logos/fallback-elementary-data.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Elementor | `elementor` | `/logos/elementor.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/elementor.svg` |
| Elmo | `elmo` | `/logos/fallback-elmo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| eM Client | `em-client` | `/logos/fallback-em-client.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| EmailOctopus | `emailoctopus` | `/logos/fallback-emailoctopus.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Emby | `emby` | `/logos/emby.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/emby.svg` |
| Emdash | `emdash` | `/logos/fallback-emdash.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Emergent | `emergent` | `/logos/fallback-emergent.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Encore | `encore` | `/logos/fallback-encore.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Endless | `endless` | `/logos/fallback-endless.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| EndNote | `endnote` | `/logos/fallback-endnote.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Enpass | `enpass` | `/logos/enpass.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/enpass.svg` |
| Ente | `ente` | `/logos/ente.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/ente.svg` |
| env0 | `env0` | `/logos/fallback-env0.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Envoy AI Gateway | `envoy-ai-gateway` | `/logos/fallback-envoy-ai-gateway.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ERPNext | `erpnext` | `/logos/erpnext.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/erpnext.svg` |
| Erxes | `erxes` | `/logos/fallback-erxes.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Espanso | `espanso` | `/logos/fallback-espanso.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| EspoCRM | `espocrm` | `/logos/fallback-espocrm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ethora | `ethora` | `/logos/fallback-ethora.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Eventbrite | `eventbrite` | `/logos/fallback-eventbrite.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ever Gauzy | `ever-gauzy` | `/logos/fallback-ever-gauzy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ever Teams | `ever-teams` | `/logos/fallback-ever-teams.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Evernote | `evernote` | `/logos/evernote.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/evernote.svg` |
| Evidence | `evidence` | `/logos/fallback-evidence.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Exa | `exa` | `/logos/fallback-exa.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Excalidraw | `excalidraw` | `/logos/excalidraw.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/excalidraw.svg` |
| Microsoft Excel | `excel` | `/logos/fallback-excel.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ezBookkeeping | `ezbookkeeping` | `/logos/fallback-ezbookkeeping.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Facebook | `facebook` | `/logos/facebook.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/facebook.svg` |
| Factory | `factory` | `/logos/fallback-factory.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| FalkorDB | `falkordb` | `/logos/fallback-falkordb.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fastgen | `fastgen` | `/logos/fallback-fastgen.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fastmail | `fastmail` | `/logos/fallback-fastmail.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| FastSpring | `fastspring` | `/logos/fallback-fastspring.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fathom Lite | `fathom` | `/logos/fathom.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/fathom.svg` |
| Fathom Analytics | `fathom-analytics` | `/logos/fallback-fathom-analytics.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fauna | `fauna` | `/logos/fauna.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/fauna.svg` |
| Faved | `faved` | `/logos/fallback-faved.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| FeatBit | `featbit` | `/logos/fallback-featbit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Featurebase | `featurebase` | `/logos/fallback-featurebase.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| FeatureOS | `featureos` | `/logos/fallback-featureos.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Featurevisor | `featurevisor` | `/logos/fallback-featurevisor.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Feedzai | `feedzai` | `/logos/fallback-feedzai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fellow | `fellow` | `/logos/fallback-fellow.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fernand | `fernand` | `/logos/fallback-fernand.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fider | `fider` | `/logos/fallback-fider.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| FigJam | `figjam` | `/logos/fallback-figjam.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Filestash | `filestash` | `/logos/fallback-filestash.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fillout | `fillout` | `/logos/fillout.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/fillout.svg` |
| Filmora | `filmora` | `/logos/fallback-filmora.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Final Cut Pro | `final-cut-pro` | `/logos/fallback-final-cut-pro.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Financial Freedom | `financial-freedom` | `/logos/fallback-financial-freedom.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fincept Terminal | `fincept-terminal` | `/logos/fallback-fincept-terminal.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Firebase Studio | `firebase-studio` | `/logos/fallback-firebase-studio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Firecamp | `firecamp` | `/logos/fallback-firecamp.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Firefiles | `firefiles` | `/logos/fallback-firefiles.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fireflies | `fireflies` | `/logos/fallback-fireflies.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Firefly III | `firefly-iii` | `/logos/firefly-iii.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/fireflyiii.svg` |
| Firefox | `firefox` | `/logos/firefox.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/firefox.svg` |
| FireHydrant | `firehydrant` | `/logos/fallback-firehydrant.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fireworks AI | `fireworks-ai` | `/logos/fallback-fireworks-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| FireZone | `firezone` | `/logos/fallback-firezone.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fivetran | `fivetran` | `/logos/fallback-fivetran.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Flagsmith | `flagsmith` | `/logos/fallback-flagsmith.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Flarum | `flarum` | `/logos/fallback-flarum.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| FleetBase | `fleetbase` | `/logos/fallback-fleetbase.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Flexprice | `flexprice` | `/logos/fallback-flexprice.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Flickr | `flickr` | `/logos/flickr.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/flickr.svg` |
| Flipt | `flipt` | `/logos/fallback-flipt.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Floci | `floci` | `/logos/fallback-floci.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Flow | `flow` | `/logos/fallback-flow.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Flowise AI | `flowise-ai` | `/logos/fallback-flowise-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| FluidVoice | `fluidvoice` | `/logos/fallback-fluidvoice.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fluxer | `fluxer` | `/logos/fluxer.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/fluxer.svg` |
| FocuSee | `focusee` | `/logos/fallback-focusee.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| folk | `folk` | `/logos/fallback-folk.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fonoster | `fonoster` | `/logos/fallback-fonoster.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Forgecode | `forgecode` | `/logos/fallback-forgecode.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Forgejo | `forgejo` | `/logos/forgejo.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/forgejo.svg` |
| Fork | `fork` | `/logos/fallback-fork.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Formance | `formance` | `/logos/fallback-formance.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Formbricks | `formbricks` | `/logos/formbricks.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/formbricks.svg` |
| Formester | `formester` | `/logos/fallback-formester.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Formizee | `formizee` | `/logos/fallback-formizee.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fragment | `fragment` | `/logos/fallback-fragment.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Framer | `framer` | `/logos/framer.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/framer.svg` |
| Frappe Books | `frappe-books` | `/logos/fallback-frappe-books.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Frappe Builder | `frappe-builder` | `/logos/fallback-frappe-builder.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Frappe CRM | `frappe-crm` | `/logos/fallback-frappe-crm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Frappe Helpdesk | `frappe-helpdesk` | `/logos/fallback-frappe-helpdesk.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Frappe Insights | `frappe-insights` | `/logos/fallback-frappe-insights.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Freescout | `freescout` | `/logos/fallback-freescout.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Freeter | `freeter` | `/logos/fallback-freeter.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| FreshBooks | `freshbooks` | `/logos/fallback-freshbooks.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Freshchat | `freshchat` | `/logos/fallback-freshchat.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| FreshDesk | `freshdesk` | `/logos/fallback-freshdesk.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Friendly Captcha | `friendly-captcha` | `/logos/fallback-friendly-captcha.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Front | `front` | `/logos/fallback-front.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Frontdesk AI | `frontdesk-ai` | `/logos/fallback-frontdesk-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| FrontEgg | `frontegg` | `/logos/fallback-frontegg.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Frontman | `frontman` | `/logos/fallback-frontman.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fullmoon | `fullmoon` | `/logos/fallback-fullmoon.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| FullStory | `fullstory` | `/logos/fallback-fullstory.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fumadocs | `fumadocs` | `/logos/fallback-fumadocs.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Functionize | `functionize` | `/logos/fallback-functionize.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fusio | `fusio` | `/logos/fallback-fusio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Fyxer | `fyxer` | `/logos/fallback-fyxer.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Galileo | `galileo` | `/logos/fallback-galileo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Garage | `garage` | `/logos/fallback-garage.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Gather | `gather` | `/logos/fallback-gather.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Gatus | `gatus` | `/logos/fallback-gatus.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Gauge | `gauge` | `/logos/fallback-gauge.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| GDevelop | `gdevelop` | `/logos/fallback-gdevelop.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| GE Proficy Historian | `ge-proficy-historian` | `/logos/fallback-ge-proficy-historian.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Gemini Spark | `gemini-spark` | `/logos/fallback-gemini-spark.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Geozilla | `geozilla` | `/logos/fallback-geozilla.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| GetResponse | `getresponse` | `/logos/fallback-getresponse.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Getscreen.me | `getscreen-me` | `/logos/fallback-getscreen-me.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ghost | `ghost` | `/logos/ghost.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/ghost.svg` |
| Ghostfolio | `ghostfolio` | `/logos/ghostfolio.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/ghostfolio.svg` |
| Ghostty | `ghostty` | `/logos/ghostty.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/ghostty.svg` |
| Gigapipe | `gigapipe` | `/logos/fallback-gigapipe.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| GIMP | `gimp` | `/logos/gimp.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/gimp.svg` |
| Giselle | `giselle` | `/logos/fallback-giselle.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Gitbook | `gitbook` | `/logos/gitbook.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/gitbook.svg` |
| GitButler | `gitbutler` | `/logos/fallback-gitbutler.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| GitComet | `gitcomet` | `/logos/fallback-gitcomet.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Gitea | `gitea` | `/logos/gitea.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/gitea.svg` |
| GitHub | `github` | `/logos/github.svg` | verified | Official source: `cdn.jsdelivr.net/npm/simple-icons/icons/github.svg` |
| GitHub Actions | `github-actions` | `/logos/github-actions.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/githubactions.svg` |
| GitHub Codespaces | `github-codespaces` | `/logos/fallback-github-codespaces.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| GitHub Desktop | `github-desktop` | `/logos/fallback-github-desktop.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| GitHub Spark | `github-spark` | `/logos/fallback-github-spark.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| GitKraken | `gitkraken` | `/logos/gitkraken.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/gitkraken.svg` |
| GitLab | `gitlab` | `/logos/gitlab.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/gitlab.svg` |
| Gladys Assistant | `gladys-assistant` | `/logos/fallback-gladys-assistant.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Glean | `glean` | `/logos/fallback-glean.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Gleap | `gleap` | `/logos/fallback-gleap.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Glide | `glide` | `/logos/glide.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/glide.svg` |
| GlitchTip | `glitchtip` | `/logos/fallback-glitchtip.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Gmail | `gmail` | `/logos/gmail.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/gmail.svg` |
| Godot | `godot` | `/logos/fallback-godot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Gogs | `gogs` | `/logos/fallback-gogs.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Goodcall | `goodcall` | `/logos/fallback-goodcall.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Goodreads | `goodreads` | `/logos/goodreads.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/goodreads.svg` |
| Google Assistant | `google-assistant` | `/logos/google-assistant.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googleassistant.svg` |
| Google Authenticator | `google-authenticator` | `/logos/google-authenticator.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googleauthenticator.svg` |
| Google Chrome | `google-chrome` | `/logos/google-chrome.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googlechrome.svg` |
| Google Cloud | `google-cloud` | `/logos/google-cloud.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googlecloud.svg` |
| Google Cloud Bigtable | `google-cloud-bigtable` | `/logos/fallback-google-cloud-bigtable.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Google Cloud Composer | `google-cloud-composer` | `/logos/google-cloud-composer.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googlecloudcomposer.svg` |
| Google Cloud Storage | `google-cloud-storage` | `/logos/google-cloud-storage.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googlecloudstorage.svg` |
| Google Docs | `google-docs` | `/logos/google-docs.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googledocs.svg` |
| Google Drive | `google-drive` | `/logos/google-drive.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googledrive.svg` |
| Google Keep | `google-keep` | `/logos/google-keep.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googlekeep.svg` |
| Google Location Sharing | `google-location-sharing` | `/logos/fallback-google-location-sharing.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Google Maps | `google-maps` | `/logos/google-maps.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googlemaps.svg` |
| Google Meet | `google-meet` | `/logos/google-meet.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googlemeet.svg` |
| Google Search | `google-search` | `/logos/fallback-google-search.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Google Sheets | `google-sheets` | `/logos/google-sheets.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googlesheets.svg` |
| Google Tasks | `google-tasks` | `/logos/google-tasks.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googletasks.svg` |
| Google Translate | `google-translate` | `/logos/google-translate.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googletranslate.svg` |
| Google Workspace | `google-workspace` | `/logos/fallback-google-workspace.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Google Forms | `googleforms` | `/logos/googleforms.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/googleforms.svg` |
| Goose | `goose` | `/logos/fallback-goose.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Gorgias | `gorgias` | `/logos/fallback-gorgias.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| GoRules | `gorules` | `/logos/fallback-gorules.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Grafana | `grafana` | `/logos/grafana.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/grafana.svg` |
| Grafana Cloud | `grafana-cloud` | `/logos/fallback-grafana-cloud.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Grafana Loki | `grafana-loki` | `/logos/fallback-grafana-loki.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Grammarly | `grammarly` | `/logos/grammarly.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/grammarly.svg` |
| Granola | `granola` | `/logos/fallback-granola.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Graphite | `graphite` | `/logos/graphite.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/graphite.svg` |
| Gravitee | `gravitee` | `/logos/fallback-gravitee.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Greenhouse | `greenhouse` | `/logos/greenhouse.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/greenhouse.svg` |
| Greptile | `greptile` | `/logos/fallback-greptile.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| GreptimeDB | `greptimedb` | `/logos/greptimedb.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/greptimedb.svg` |
| Grepture | `grepture` | `/logos/fallback-grepture.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Grida | `grida` | `/logos/fallback-grida.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Grist | `grist` | `/logos/fallback-grist.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Grok | `grok` | `/logos/fallback-grok.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Grok Bot | `grok-bot` | `/logos/fallback-grok-bot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Grok Build | `grok-build` | `/logos/fallback-grok-build.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| GrowthBook | `growthbook` | `/logos/fallback-growthbook.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Guilded | `guilded` | `/logos/guilded.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/guilded.svg` |
| Gumroad | `gumroad` | `/logos/gumroad.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/gumroad.svg` |
| Guru | `guru` | `/logos/fallback-guru.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hackatime | `hackatime` | `/logos/fallback-hackatime.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hacker News | `hackernews` | `/logos/fallback-hackernews.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Handy | `handy` | `/logos/fallback-handy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hanko | `hanko` | `/logos/fallback-hanko.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Happy | `happy` | `/logos/fallback-happy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Harness | `harness` | `/logos/fallback-harness.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Harper | `harper` | `/logos/fallback-harper.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Harvest | `harvest` | `/logos/fallback-harvest.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Harvey | `harvey` | `/logos/fallback-harvey.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| HashiCorp Boundary | `hashicorp-boundary` | `/logos/fallback-hashicorp-boundary.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hasura | `hasura` | `/logos/hasura.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/hasura.svg` |
| Hatchet | `hatchet` | `/logos/fallback-hatchet.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hazel | `hazel` | `/logos/fallback-hazel.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| hCaptcha | `hcaptcha` | `/logos/fallback-hcaptcha.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Healthchecks | `healthchecks` | `/logos/fallback-healthchecks.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hebbia | `hebbia` | `/logos/fallback-hebbia.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Height | `height` | `/logos/fallback-height.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Helicone | `helicone` | `/logos/fallback-helicone.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Helium | `helium` | `/logos/helium.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/helium.svg` |
| HelixDB | `helixdb` | `/logos/fallback-helixdb.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| HelpDesk | `helpdesk` | `/logos/helpdesk.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/helpdesk.svg` |
| HelpScout | `helpscout` | `/logos/helpscout.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/helpscout.svg` |
| Hercules | `hercules` | `/logos/fallback-hercules.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hermes Agent | `hermes-agent` | `/logos/fallback-hermes-agent.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Heroku | `heroku` | `/logos/fallback-heroku.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hex | `hex` | `/logos/fallback-hex.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hexabot | `hexabot` | `/logos/fallback-hexabot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| HEY | `hey` | `/logos/hey.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/hey.svg` |
| HeyForm | `heyform` | `/logos/fallback-heyform.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hi.Events | `hi-events` | `/logos/fallback-hi-events.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Highlight | `highlight` | `/logos/fallback-highlight.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Highseat | `highseat` | `/logos/fallback-highseat.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| HitKeep | `hitkeep` | `/logos/fallback-hitkeep.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hive | `hive` | `/logos/hive.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/hive.svg` |
| Hiver | `hiver` | `/logos/fallback-hiver.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Home Assistant | `home-assistant` | `/logos/home-assistant.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/homeassistant.svg` |
| HomeKit | `homekit` | `/logos/fallback-homekit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Honeycomb | `honeycomb` | `/logos/fallback-honeycomb.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hoodik | `hoodik` | `/logos/fallback-hoodik.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hook0 | `hook0` | `/logos/fallback-hook0.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hookdeck | `hookdeck` | `/logos/fallback-hookdeck.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| HootSuite | `hootsuite` | `/logos/hootsuite.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/hootsuite.svg` |
| Hopp | `hopp` | `/logos/fallback-hopp.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Horilla | `horilla` | `/logos/fallback-horilla.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hotjar | `hotjar` | `/logos/hotjar.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/hotjar.svg` |
| HTTPie | `httpie` | `/logos/httpie.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/httpie.svg` |
| HubSpot | `hubspot` | `/logos/hubspot.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/hubspot.svg` |
| Huly | `huly` | `/logos/fallback-huly.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| HUMAN Security | `human-security` | `/logos/fallback-human-security.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Humanloop | `humanloop` | `/logos/fallback-humanloop.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Humblytics | `humblytics` | `/logos/fallback-humblytics.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hummingbot | `hummingbot` | `/logos/fallback-hummingbot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hypefury | `hypefury` | `/logos/fallback-hypefury.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| HyperDX | `hyperdx` | `/logos/fallback-hyperdx.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hyperswitch | `hyperswitch` | `/logos/fallback-hyperswitch.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hypertune | `hypertune` | `/logos/fallback-hypertune.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hyvor Blogs | `hyvor-blogs` | `/logos/fallback-hyvor-blogs.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hyvor Post | `hyvor-post` | `/logos/fallback-hyvor-post.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Hyvor Relay | `hyvor-relay` | `/logos/fallback-hyvor-relay.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Icinga | `icinga` | `/logos/icinga.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/icinga.svg` |
| Iconosquare | `iconosquare` | `/logos/fallback-iconosquare.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| IDrive | `idrive` | `/logos/fallback-idrive.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| IFTTT | `ifttt` | `/logos/ifttt.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/ifttt.svg` |
| ImageKit | `imagekit` | `/logos/fallback-imagekit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Imagine.dev | `imagine` | `/logos/fallback-imagine.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| imgix | `imgix` | `/logos/fallback-imgix.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| imgproxy | `imgproxy` | `/logos/fallback-imgproxy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Imgur | `imgur` | `/logos/imgur.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/imgur.svg` |
| Inbox Zero | `inboxzero` | `/logos/fallback-inboxzero.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| incident.io | `incident-io` | `/logos/fallback-incident-io.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Infisical | `infisical` | `/logos/fallback-infisical.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| InfluxDB | `influxdb` | `/logos/influxdb.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/influxdb.svg` |
| Inkscape | `inkscape` | `/logos/inkscape.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/inkscape.svg` |
| Inngest | `inngest` | `/logos/fallback-inngest.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Insightly | `insightly` | `/logos/fallback-insightly.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Insomnia | `insomnia` | `/logos/insomnia.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/insomnia.svg` |
| Instagram | `instagram` | `/logos/instagram.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/instagram.svg` |
| Instant | `instant` | `/logos/fallback-instant.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Instapage | `instapage` | `/logos/fallback-instapage.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Instapaper | `instapaper` | `/logos/instapaper.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/instapaper.svg` |
| Instatus | `instatus` | `/logos/instatus.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/instatus.svg` |
| Instinct | `instinct` | `/logos/fallback-instinct.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Intercom | `intercom` | `/logos/intercom.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/intercom.svg` |
| Invidious | `invidious` | `/logos/invidious.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/invidious.svg` |
| InVision | `invision` | `/logos/fallback-invision.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Invision Community | `invision-community` | `/logos/fallback-invision-community.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Invoice Ninja | `invoice-ninja` | `/logos/invoice-ninja.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/invoiceninja.svg` |
| IronCalc | `ironcalc` | `/logos/fallback-ironcalc.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| IronClaw | `ironclaw` | `/logos/fallback-ironclaw.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| iStat Menus | `istat-menus` | `/logos/fallback-istat-menus.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| iTerm 2 | `iterm-2` | `/logos/iterm-2.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/iterm2.svg` |
| It's a Plan | `its-a-plan` | `/logos/fallback-its-a-plan.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| itsnotes | `itsnotes` | `/logos/fallback-itsnotes.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| iubenda | `iubenda` | `/logos/fallback-iubenda.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Jace | `jace` | `/logos/fallback-jace.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Jamie AI | `jamie-ai` | `/logos/fallback-jamie-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Jarvis | `jarvis` | `/logos/fallback-jarvis.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Jean | `jean` | `/logos/fallback-jean.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Jellyfin | `jellyfin` | `/logos/jellyfin.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/jellyfin.svg` |
| Jenkins | `jenkins` | `/logos/jenkins.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/jenkins.svg` |
| JetBrains | `jetbrains` | `/logos/jetbrains.svg` | verified | Official source: `cdn.jsdelivr.net/npm/simple-icons/icons/jetbrains.svg` |
| JetPero | `jetpero` | `/logos/fallback-jetpero.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Jimdo | `jimdo` | `/logos/fallback-jimdo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Jina AI | `jina` | `/logos/fallback-jina.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Jira | `jira` | `/logos/jira.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/jira.svg` |
| Jira Service Management | `jira-service-management` | `/logos/fallback-jira-service-management.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Jitsi | `jitsi` | `/logos/jitsi.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/jitsi.svg` |
| Jitsu | `jitsu` | `/logos/fallback-jitsu.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Joplin | `joplin` | `/logos/joplin.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/joplin.svg` |
| Jotform | `jotform` | `/logos/fallback-jotform.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Jules | `jules` | `/logos/fallback-jules.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| JumpServer | `jumpserver` | `/logos/fallback-jumpserver.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Junction | `junction` | `/logos/fallback-junction.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| June | `june` | `/logos/fallback-june.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Justnote | `justnote` | `/logos/fallback-justnote.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kafka | `kafka` | `/logos/fallback-kafka.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kagi | `kagi` | `/logos/kagi.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/kagi.svg` |
| Kajabi | `kajabi` | `/logos/fallback-kajabi.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kajabi Communities | `kajabi-communities` | `/logos/fallback-kajabi-communities.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kan | `kan` | `/logos/fallback-kan.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kanba | `kanba` | `/logos/fallback-kanba.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kaneo | `kaneo` | `/logos/fallback-kaneo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kanri | `kanri` | `/logos/fallback-kanri.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kap | `kap` | `/logos/fallback-kap.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kapa.ai | `kapa-ai` | `/logos/fallback-kapa-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Karafun | `karafun` | `/logos/fallback-karafun.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Karakeep | `karakeep` | `/logos/karakeep.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/karakeep.svg` |
| Katalon | `katalon` | `/logos/fallback-katalon.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kdb+ | `kdb` | `/logos/fallback-kdb.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kdenlive | `kdenlive` | `/logos/kdenlive.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/kdenlive.svg` |
| Keap | `keap` | `/logos/fallback-keap.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Keep | `keep` | `/logos/fallback-keep.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| KeePassXC | `keepassxc` | `/logos/keepassxc.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/keepassxc.svg` |
| Keeper | `keeper` | `/logos/keeper.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/keeper.svg` |
| Keila | `keila` | `/logos/fallback-keila.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kelviq | `kelviq` | `/logos/fallback-kelviq.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kener | `kener` | `/logos/fallback-kener.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Keploy | `keploy` | `/logos/keploy.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/keploy.svg` |
| Kestra | `kestra` | `/logos/fallback-kestra.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ketch | `ketch` | `/logos/fallback-ketch.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Keycloak | `keycloak` | `/logos/keycloak.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/keycloak.svg` |
| Keyshade | `keyshade` | `/logos/fallback-keyshade.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| KeystoneJS | `keystonejs` | `/logos/fallback-keystonejs.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kilo | `kilocode` | `/logos/fallback-kilocode.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kimai | `kimai` | `/logos/fallback-kimai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kiro | `kiro` | `/logos/fallback-kiro.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kissmetrics | `kissmetrics` | `/logos/fallback-kissmetrics.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kite | `kite` | `/logos/fallback-kite.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kitty | `kitty` | `/logos/fallback-kitty.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Klaviyo | `klaviyo` | `/logos/fallback-klaviyo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Knock | `knock` | `/logos/fallback-knock.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kodi | `kodi` | `/logos/kodi.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/kodi.svg` |
| Kodus | `kodus` | `/logos/fallback-kodus.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kong | `kong` | `/logos/kong.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/kong.svg` |
| Kong AI Gateway | `kong-ai-gateway` | `/logos/fallback-kong-ai-gateway.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Korbit | `korbit` | `/logos/fallback-korbit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kortix | `kortix` | `/logos/fallback-kortix.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Koru | `koru` | `/logos/fallback-koru.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Koyfin | `koyfin` | `/logos/fallback-koyfin.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Krakend | `krakend` | `/logos/fallback-krakend.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Krayin | `krayin` | `/logos/fallback-krayin.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Kreya | `kreya` | `/logos/fallback-kreya.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Krita | `krita` | `/logos/krita.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/krita.svg` |
| Kubernetes | `kubernetes` | `/logos/kubernetes.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/kubernetes.svg` |
| Kutt | `kutt` | `/logos/fallback-kutt.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ladybird | `ladybird` | `/logos/fallback-ladybird.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Lago | `lago` | `/logos/fallback-lago.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Laminar | `laminar` | `/logos/fallback-laminar.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Landbot | `landbot` | `/logos/fallback-landbot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LangChain | `langchain` | `/logos/langchain.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/langchain.svg` |
| Langfuse | `langfuse` | `/logos/fallback-langfuse.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LangSmith | `langsmith` | `/logos/fallback-langsmith.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LanguageTool | `languagetool` | `/logos/languagetool.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/languagetool.svg` |
| Languine | `languine` | `/logos/fallback-languine.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LangWatch | `langwatch` | `/logos/fallback-langwatch.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Laranode | `laranode` | `/logos/fallback-laranode.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Last9 | `last9` | `/logos/fallback-last9.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LastPass | `lastpass` | `/logos/lastpass.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/lastpass.svg` |
| Latitude | `latitude` | `/logos/fallback-latitude.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LaunchDarkly | `launchdarkly` | `/logos/fallback-launchdarkly.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Leantime | `leantime` | `/logos/fallback-leantime.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LearnHouse | `learnhouse` | `/logos/fallback-learnhouse.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LearnWorlds | `learnworlds` | `/logos/fallback-learnworlds.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Legora | `legora` | `/logos/fallback-legora.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Lemmy | `lemmy` | `/logos/lemmy.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/lemmy.svg` |
| Lemon Squeezy | `lemon-squeezy` | `/logos/lemon-squeezy.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/lemonsqueezy.svg` |
| Leon | `leon` | `/logos/fallback-leon.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Letta | `letta` | `/logos/fallback-letta.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Lever | `lever` | `/logos/fallback-lever.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LibreOffice | `libreoffice` | `/logos/libreoffice.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/libreoffice.svg` |
| LibreTranslate | `libretranslate` | `/logos/libretranslate.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/libretranslate.svg` |
| LibreWolf | `librewolf` | `/logos/librewolf.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/librewolf.svg` |
| Life360 | `life360` | `/logos/fallback-life360.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Lightdash | `lightdash` | `/logos/fallback-lightdash.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Lightpanda | `lightpanda` | `/logos/fallback-lightpanda.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LimeSurvey | `limesurvey` | `/logos/limesurvey.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/limesurvey.svg` |
| Lindy | `lindy` | `/logos/fallback-lindy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Linear | `linear` | `/logos/linear.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/linear.svg` |
| Lingo.dev | `lingo` | `/logos/fallback-lingo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Linguist | `linguist` | `/logos/fallback-linguist.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Linkding | `linkding` | `/logos/fallback-linkding.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LinkStack | `linkstack` | `/logos/fallback-linkstack.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LinkTree | `linktree` | `/logos/linktree.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/linktree.svg` |
| Linkwarden | `linkwarden` | `/logos/fallback-linkwarden.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Linky | `linky` | `/logos/fallback-linky.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Listmonk | `listmonk` | `/logos/listmonk.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/listmonk.svg` |
| LiteLLM | `litellm` | `/logos/fallback-litellm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Literal | `literal` | `/logos/literal.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/literal.svg` |
| Litlyx | `litlyx` | `/logos/fallback-litlyx.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LittleLink | `littlelink` | `/logos/fallback-littlelink.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LiveChat | `livechat` | `/logos/livechat.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/livechat.svg` |
| LiveKit | `livekit` | `/logos/livekit.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/livekit.svg` |
| LLM Gateway | `llm-gateway` | `/logos/fallback-llm-gateway.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LM Studio | `lm-studio` | `/logos/lm-studio.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/lmstudio.svg` |
| LobbyStack | `lobbystack` | `/logos/fallback-lobbystack.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LocalSend | `localsend` | `/logos/localsend.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/localsend.svg` |
| LocalStack | `localstack` | `/logos/fallback-localstack.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LogChimp | `logchimp` | `/logos/fallback-logchimp.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Logfire | `logfire` | `/logos/fallback-logfire.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Logic Pro | `logic-pro` | `/logos/fallback-logic-pro.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LogicMonitor | `logicmonitor` | `/logos/fallback-logicmonitor.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LogRocket | `logrocket` | `/logos/fallback-logrocket.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Logseq | `logseq` | `/logos/logseq.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/logseq.svg` |
| LogSnag | `logsnag` | `/logos/fallback-logsnag.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Logstash | `logstash` | `/logos/logstash.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/logstash.svg` |
| Logto | `logto` | `/logos/fallback-logto.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Logz.io | `logz-io` | `/logos/fallback-logz-io.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Lokalise | `lokalise` | `/logos/fallback-lokalise.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Looker | `looker` | `/logos/looker.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/looker.svg` |
| Loom | `loom` | `/logos/loom.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/loom.svg` |
| Loops | `loops` | `/logos/loops.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/loops.svg` |
| LosslessCut | `losslesscut` | `/logos/fallback-losslesscut.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LostPixel | `lostpixel` | `/logos/fallback-lostpixel.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Lovable | `lovable` | `/logos/fallback-lovable.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Lua.sh | `lua-sh` | `/logos/fallback-lua-sh.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| LucidChart | `lucidchart` | `/logos/fallback-lucidchart.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Luma | `luma` | `/logos/luma.svg` | unverified | Website favicon fallback; visually review before using as a logo |
| Luminar Neo | `luminar-neo` | `/logos/fallback-luminar-neo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Lychee | `lychee` | `/logos/fallback-lychee.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Lyzr | `lyzr` | `/logos/fallback-lyzr.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| mabl | `mabl` | `/logos/fallback-mabl.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| MacKeeper | `mackeeper` | `/logos/fallback-mackeeper.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Macro Chat | `macro-chat` | `/logos/fallback-macro-chat.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Macro CRM | `macro-crm` | `/logos/fallback-macro-crm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Macro Docs | `macro-docs` | `/logos/fallback-macro-docs.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Macro Mail | `macro-mail` | `/logos/fallback-macro-mail.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Macro Tasks | `macro-tasks` | `/logos/fallback-macro-tasks.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mage | `mage` | `/logos/fallback-mage.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Magento | `magento` | `/logos/fallback-magento.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| MagicBell | `magicbell` | `/logos/fallback-magicbell.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mailbird | `mailbird` | `/logos/fallback-mailbird.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| MailCheap | `mailcheap` | `/logos/fallback-mailcheap.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mailchimp | `mailchimp` | `/logos/mailchimp.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/mailchimp.svg` |
| MailerLite | `mailerlite` | `/logos/fallback-mailerlite.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| MailerSend | `mailersend` | `/logos/fallback-mailersend.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mailgun | `mailgun` | `/logos/mailgun.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/mailgun.svg` |
| Mailspring | `mailspring` | `/logos/fallback-mailspring.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Manage | `manage` | `/logos/fallback-manage.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Manticore Search | `manticore` | `/logos/fallback-manticore.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Manus | `manus` | `/logos/fallback-manus.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Manus Cue | `manus-cue` | `/logos/fallback-manus-cue.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Manychat | `manychat` | `/logos/fallback-manychat.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Maple | `maple` | `/logos/fallback-maple.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Marble | `marble` | `/logos/fallback-marble.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Marble CMS | `marble-cms` | `/logos/fallback-marble-cms.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Markup | `markup` | `/logos/fallback-markup.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mastodon | `mastodon` | `/logos/mastodon.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/mastodon.svg` |
| Mathesar | `mathesar` | `/logos/fallback-mathesar.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Matillion | `matillion` | `/logos/matillion.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/matillion.svg` |
| Matomo | `matomo` | `/logos/matomo.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/matomo.svg` |
| Matter | `matter` | `/logos/fallback-matter.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| MausBot | `mausbot` | `/logos/fallback-mausbot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mautic | `mautic` | `/logos/mautic.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/mautic.svg` |
| Mava | `mava` | `/logos/fallback-mava.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Maxim | `maxim` | `/logos/fallback-maxim.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| MaxKB | `maxkb` | `/logos/fallback-maxkb.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Maxun | `maxun` | `/logos/fallback-maxun.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Maybe | `maybe` | `/logos/fallback-maybe.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| mCaptcha | `mcaptcha` | `/logos/fallback-mcaptcha.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| MDMA | `mdma` | `/logos/fallback-mdma.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Medium | `medium` | `/logos/medium.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/medium.svg` |
| Medusa | `medusa` | `/logos/medusa.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/medusa.svg` |
| Meetily | `meetily` | `/logos/fallback-meetily.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mega | `mega` | `/logos/mega.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/mega.svg` |
| Mem0 | `mem0` | `/logos/fallback-mem0.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Memgraph | `memgraph` | `/logos/fallback-memgraph.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Memos | `memos` | `/logos/fallback-memos.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Memrise | `memrise` | `/logos/fallback-memrise.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mendeley | `mendeley` | `/logos/mendeley.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/mendeley.svg` |
| Mendix | `mendix` | `/logos/fallback-mendix.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Merge | `merge` | `/logos/fallback-merge.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mermaid | `mermaid` | `/logos/mermaid.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/mermaid.svg` |
| Meta Muse | `meta-muse` | `/logos/fallback-meta-muse.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Meteroid | `meteroid` | `/logos/fallback-meteroid.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mezon | `mezon` | `/logos/fallback-mezon.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft 365 | `microsoft-365` | `/logos/fallback-microsoft-365.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft 365 Copilot | `microsoft-365-copilot` | `/logos/fallback-microsoft-365-copilot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft Authenticator | `microsoft-authenticator` | `/logos/fallback-microsoft-authenticator.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft Azure | `microsoft-azure` | `/logos/fallback-microsoft-azure.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft Copilot Studio | `microsoft-copilot-studio` | `/logos/fallback-microsoft-copilot-studio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft Dev Box | `microsoft-dev-box` | `/logos/fallback-microsoft-dev-box.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft Dynamics 365 | `microsoft-dynamics-365` | `/logos/fallback-microsoft-dynamics-365.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft Office | `microsoft-office` | `/logos/fallback-microsoft-office.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft OneDrive | `microsoft-onedrive` | `/logos/fallback-microsoft-onedrive.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft Outlook | `microsoft-outlook` | `/logos/fallback-microsoft-outlook.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft SharePoint | `microsoft-sharepoint` | `/logos/fallback-microsoft-sharepoint.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft Teams | `microsoft-teams` | `/logos/fallback-microsoft-teams.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft To Do | `microsoft-to-do` | `/logos/fallback-microsoft-to-do.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft Visio | `microsoft-visio` | `/logos/fallback-microsoft-visio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Microsoft Word | `microsoft-word` | `/logos/fallback-microsoft-word.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| MicroStrategy | `microstrategy` | `/logos/microstrategy.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/microstrategy.svg` |
| Midday | `midday` | `/logos/fallback-midday.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Midori Browser | `midori-browser` | `/logos/fallback-midori-browser.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mighty Networks | `mighty-networks` | `/logos/fallback-mighty-networks.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mike | `mike` | `/logos/fallback-mike.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Milvus | `milvus` | `/logos/milvus.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/milvus.svg` |
| Mimrai | `mimrai` | `/logos/fallback-mimrai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| MinIO | `minio` | `/logos/minio.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/minio.svg` |
| MiniStack | `ministack` | `/logos/fallback-ministack.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mint | `mint` | `/logos/fallback-mint.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mintlify | `mintlify` | `/logos/mintlify.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/mintlify.svg` |
| Minutes | `minutes` | `/logos/fallback-minutes.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mirakl | `mirakl` | `/logos/fallback-mirakl.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Miro | `miro` | `/logos/miro.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/miro.svg` |
| Missive | `missive` | `/logos/fallback-missive.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mixpanel | `mixpanel` | `/logos/mixpanel.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/mixpanel.svg` |
| Mixpost | `mixpost` | `/logos/fallback-mixpost.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| mlop | `mlop` | `/logos/fallback-mlop.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mockoon | `mockoon` | `/logos/fallback-mockoon.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Modal | `modal` | `/logos/modal.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/modal.svg` |
| Mode | `mode` | `/logos/fallback-mode.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Modern Treasury | `modern-treasury` | `/logos/fallback-modern-treasury.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mole | `mole` | `/logos/fallback-mole.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Momentic | `momentic` | `/logos/fallback-momentic.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Monarch Money | `monarch-money` | `/logos/fallback-monarch-money.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Monday | `monday` | `/logos/fallback-monday.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Monetr | `monetr` | `/logos/fallback-monetr.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| MongoDB | `mongodb` | `/logos/mongodb.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/mongodb.svg` |
| Monica | `monica` | `/logos/monica.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/monica.svg` |
| MonoGame | `monogame` | `/logos/monogame.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/monogame.svg` |
| Monologue | `monologue` | `/logos/fallback-monologue.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Moosend | `moosend` | `/logos/fallback-moosend.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Morphic | `morphic` | `/logos/fallback-morphic.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Msty Claw | `msty-claw` | `/logos/fallback-msty-claw.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Msty Nexus | `msty-nexus` | `/logos/fallback-msty-nexus.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Msty Studio | `msty-studio` | `/logos/fallback-msty-studio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| MuleSoft | `mulesoft` | `/logos/fallback-mulesoft.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Multica | `multica` | `/logos/fallback-multica.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Mural | `mural` | `/logos/mural.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/mural.svg` |
| Nagios | `nagios` | `/logos/fallback-nagios.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Nango | `nango` | `/logos/fallback-nango.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| nanobot | `nanobot` | `/logos/fallback-nanobot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| NanoClaw | `nanoclaw` | `/logos/fallback-nanoclaw.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Navicat | `navicat` | `/logos/fallback-navicat.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Navidrome | `navidrome` | `/logos/fallback-navidrome.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| NemoClaw | `nemoclaw` | `/logos/fallback-nemoclaw.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Neo4j | `neo4j` | `/logos/neo4j.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/neo4j.svg` |
| Neon Postgres | `neon-postgres` | `/logos/fallback-neon-postgres.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Neovim | `neovim` | `/logos/neovim.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/neovim.svg` |
| Netbird | `netbird` | `/logos/fallback-netbird.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Netdata | `netdata` | `/logos/netdata.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/netdata.svg` |
| Netflix | `netflix` | `/logos/netflix.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/netflix.svg` |
| Netlify | `netlify` | `/logos/netlify.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/netlify.svg` |
| NetSuite | `netsuite` | `/logos/fallback-netsuite.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| New Relic | `new-relic` | `/logos/new-relic.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/newrelic.svg` |
| Nextcloud | `nextcloud` | `/logos/nextcloud.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/nextcloud.svg` |
| NextDNS | `nextdns` | `/logos/nextdns.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/nextdns.svg` |
| NHost | `nhost` | `/logos/nhost.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/nhost.svg` |
| Nightingale | `nightingale` | `/logos/fallback-nightingale.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Nitric | `nitric` | `/logos/fallback-nitric.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| NocoDB | `nocodb` | `/logos/fallback-nocodb.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Nolt | `nolt` | `/logos/fallback-nolt.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Nonograph | `nonograph` | `/logos/fallback-nonograph.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Nordcraft | `nordcraft` | `/logos/fallback-nordcraft.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| NordLocker | `nordlocker` | `/logos/fallback-nordlocker.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| NordVPN | `nordvpn` | `/logos/nordvpn.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/nordvpn.svg` |
| Notesnook | `notesnook` | `/logos/notesnook.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/notesnook.svg` |
| NotificationAPI | `notificationapi` | `/logos/fallback-notificationapi.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Notifuse | `notifuse` | `/logos/fallback-notifuse.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ntfy | `ntfy` | `/logos/ntfy.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/ntfy.svg` |
| Nuclear | `nuclear` | `/logos/fallback-nuclear.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Nuclino | `nuclino` | `/logos/fallback-nuclino.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Nutanix | `nutanix` | `/logos/nutanix.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/nutanix.svg` |
| OBS Studio | `obs-studio` | `/logos/obs-studio.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/obsstudio.svg` |
| Obsidian | `obsidian` | `/logos/obsidian.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/obsidian.svg` |
| OceanBase | `oceanbase` | `/logos/oceanbase.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/oceanbase.svg` |
| OctoBot | `octobot` | `/logos/fallback-octobot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Octoparse | `octoparse` | `/logos/fallback-octoparse.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Odoo | `odoo` | `/logos/odoo.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/odoo.svg` |
| Office Online | `office-online` | `/logos/fallback-office-online.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OhDear! | `ohdear` | `/logos/ohdear.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/ohdear.svg` |
| Okta | `okta` | `/logos/okta.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/okta.svg` |
| Olares | `olares` | `/logos/fallback-olares.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Omnara | `omnara` | `/logos/fallback-omnara.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Omni | `omni` | `/logos/fallback-omni.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Omnigent | `omnigent` | `/logos/fallback-omnigent.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Omnivore | `omnivore` | `/logos/fallback-omnivore.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ON1 Photo RAW | `on1-photo-raw` | `/logos/fallback-on1-photo-raw.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OneGlanse | `oneglanse` | `/logos/fallback-oneglanse.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OneHuman | `onehuman` | `/logos/fallback-onehuman.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Oneleet | `oneleet` | `/logos/fallback-oneleet.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OneNote | `onenote` | `/logos/fallback-onenote.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OneTrust | `onetrust` | `/logos/fallback-onetrust.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OneUptime | `oneuptime` | `/logos/fallback-oneuptime.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Onlook | `onlook` | `/logos/fallback-onlook.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ONLYOFFICE Docs | `onlyoffice-docs` | `/logos/fallback-onlyoffice-docs.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Onyx | `onyx` | `/logos/fallback-onyx.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Open | `open` | `/logos/fallback-open.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Open Interpreter | `open-interpreter` | `/logos/fallback-open-interpreter.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Open Mercato | `open-mercato` | `/logos/fallback-open-mercato.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Open-Notebook | `open-notebook` | `/logos/fallback-open-notebook.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Open Wearables | `open-wearables` | `/logos/fallback-open-wearables.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenAI Dots | `openai-dots` | `/logos/fallback-openai-dots.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenBB | `openbb` | `/logos/fallback-openbb.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenBot | `openbot` | `/logos/fallback-openbot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenClaw | `openclaw` | `/logos/fallback-openclaw.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenCloud | `opencloud` | `/logos/fallback-opencloud.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenComputer | `opencomputer` | `/logos/fallback-opencomputer.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenCut | `opencut` | `/logos/fallback-opencut.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenHands | `openhands` | `/logos/fallback-openhands.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Openinary | `openinary` | `/logos/fallback-openinary.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Openlane | `openlane` | `/logos/fallback-openlane.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenLIT | `openlit` | `/logos/fallback-openlit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenLLMetry | `openllmetry` | `/logos/fallback-openllmetry.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenMeter | `openmeter` | `/logos/fallback-openmeter.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenNotas | `opennotas` | `/logos/fallback-opennotas.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenObserve | `openobserve` | `/logos/fallback-openobserve.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenPanel | `openpanel` | `/logos/fallback-openpanel.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenPanel | `openpanel-co` | `/logos/fallback-openpanel-co.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenPencil | `openpencil` | `/logos/fallback-openpencil.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenPolicy | `openpolicy` | `/logos/fallback-openpolicy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenProject | `openproject` | `/logos/openproject.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/openproject.svg` |
| OpenReplay | `openreplay` | `/logos/fallback-openreplay.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenRouter | `openrouter` | `/logos/openrouter.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/openrouter.svg` |
| OpenSearch | `opensearch` | `/logos/opensearch.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/opensearch.svg` |
| OpenSEO | `openseo` | `/logos/fallback-openseo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenSERP | `openserp` | `/logos/fallback-openserp.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenShift Dev Spaces | `openshift-dev-spaces` | `/logos/fallback-openshift-dev-spaces.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenShot | `openshot` | `/logos/fallback-openshot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenSign | `opensign` | `/logos/fallback-opensign.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenStack | `openstack` | `/logos/openstack.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/openstack.svg` |
| OpenStatus | `openstatus` | `/logos/fallback-openstatus.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenTofu | `opentofu` | `/logos/opentofu.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/opentofu.svg` |
| OpenVPN | `openvpn` | `/logos/openvpn.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/openvpn.svg` |
| OpenWebAnalytics | `openwebanalytics` | `/logos/fallback-openwebanalytics.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenWispr | `openwispr` | `/logos/fallback-openwispr.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpenWork | `openwork` | `/logos/fallback-openwork.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Opera | `opera` | `/logos/opera.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/opera.svg` |
| Operately | `operately` | `/logos/fallback-operately.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Operational | `operational` | `/logos/fallback-operational.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OpnForm | `opnform` | `/logos/fallback-opnform.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Opsgenie | `opsgenie` | `/logos/opsgenie.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/opsgenie.svg` |
| Optimizely | `optimizely` | `/logos/fallback-optimizely.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OptiSigns | `optisigns` | `/logos/fallback-optisigns.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Orama | `orama` | `/logos/fallback-orama.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Orange Logic | `orange-logic` | `/logos/fallback-orange-logic.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Orb | `orb` | `/logos/fallback-orb.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Orbit | `orbit` | `/logos/fallback-orbit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Orbital | `orbital` | `/logos/fallback-orbital.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Orca | `orca` | `/logos/fallback-orca.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Orchestrator.inc | `orchestrator-inc` | `/logos/fallback-orchestrator-inc.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ordinal | `ordinal` | `/logos/fallback-ordinal.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Organic Maps | `organic-maps` | `/logos/organic-maps.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/organicmaps.svg` |
| Orgnise | `orgnise` | `/logos/fallback-orgnise.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ory | `ory` | `/logos/ory.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/ory.svg` |
| OSMAnd | `osmand` | `/logos/osmand.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/osmand.svg` |
| Otter.ai | `otter` | `/logos/fallback-otter.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Otterly.AI | `otterly-ai` | `/logos/fallback-otterly-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ottomatik | `ottomatik` | `/logos/fallback-ottomatik.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| OutSystems | `outsystems` | `/logos/fallback-outsystems.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ownCloud | `owncloud` | `/logos/owncloud.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/owncloud.svg` |
| Paddle | `paddle` | `/logos/paddle.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/paddle.svg` |
| Padloc | `padloc` | `/logos/fallback-padloc.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Paessler PRTG | `paessler-prtg` | `/logos/fallback-paessler-prtg.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pagecloud | `pagecloud` | `/logos/fallback-pagecloud.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pagecord | `pagecord` | `/logos/fallback-pagecord.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pagerduty | `pagerduty` | `/logos/pagerduty.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/pagerduty.svg` |
| PairDrop | `pairdrop` | `/logos/fallback-pairdrop.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Palform | `palform` | `/logos/fallback-palform.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| PandaDoc | `pandadoc` | `/logos/fallback-pandadoc.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pangolin | `pangolin` | `/logos/pangolin.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/pangolin.svg` |
| Paper | `paper` | `/logos/fallback-paper.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Paperclip | `paperclip` | `/logos/fallback-paperclip.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Paperless-ngx | `paperless-ngx` | `/logos/paperless-ngx.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/paperlessngx.svg` |
| Papermark | `papermark` | `/logos/fallback-papermark.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Paperpile | `paperpile` | `/logos/fallback-paperpile.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Papra | `papra` | `/logos/fallback-papra.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Paradev | `paradev` | `/logos/fallback-paradev.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Paragon | `paragon` | `/logos/fallback-paragon.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Paragraph | `paragraph` | `/logos/fallback-paragraph.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Paralino | `paralino` | `/logos/fallback-paralino.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Parlant | `parlant` | `/logos/fallback-parlant.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Paseo | `paseo` | `/logos/fallback-paseo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Passbolt | `passbolt` | `/logos/passbolt.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/passbolt.svg` |
| Payload | `payload` | `/logos/fallback-payload.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Paymenter | `paymenter` | `/logos/fallback-paymenter.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| PayPal Braintree | `paypal-braintree` | `/logos/fallback-paypal-braintree.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| pCloud Encryption | `pcloud-encryption` | `/logos/fallback-pcloud-encryption.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pearl | `pearl` | `/logos/fallback-pearl.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| PearPass | `pearpass` | `/logos/fallback-pearpass.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Peec AI | `peec-ai` | `/logos/fallback-peec-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Peekaping | `peekaping` | `/logos/fallback-peekaping.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Peergos | `peergos` | `/logos/fallback-peergos.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| PeerTube | `peertube` | `/logos/peertube.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/peertube.svg` |
| pen.dev | `pen-dev` | `/logos/fallback-pen-dev.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Percy | `percy` | `/logos/percy.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/percy.svg` |
| Permify | `permify` | `/logos/fallback-permify.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Personal Computer | `perplexity-personal-computer` | `/logos/fallback-perplexity-personal-computer.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Phase | `phase` | `/logos/fallback-phase.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Adobe Photoshop | `photoshop` | `/logos/fallback-photoshop.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Phrase | `phrase` | `/logos/fallback-phrase.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Phrasea | `phrasea` | `/logos/fallback-phrasea.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| PhraseExpress | `phraseexpress` | `/logos/fallback-phraseexpress.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| pi | `pi` | `/logos/pi.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/pi.svg` |
| Pinboard | `pinboard` | `/logos/pinboard.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/pinboard.svg` |
| Pinecone | `pinecone` | `/logos/pinecone.svg` | unverified | Website favicon fallback; visually review before using as a logo |
| Pingdom | `pingdom` | `/logos/pingdom.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/pingdom.svg` |
| Pipedream | `pipedream` | `/logos/fallback-pipedream.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pipedrive | `pipedrive` | `/logos/fallback-pipedrive.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pipeshub | `pipeshub` | `/logos/fallback-pipeshub.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Piwigo | `piwigo` | `/logos/piwigo.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/piwigo.svg` |
| Pixelfed | `pixelfed` | `/logos/pixelfed.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/pixelfed.svg` |
| Pixelmator Pro | `pixelmator-pro` | `/logos/fallback-pixelmator-pro.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| PixiEditor | `pixieditor` | `/logos/fallback-pixieditor.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Plakar | `plakar` | `/logos/fallback-plakar.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Plaky | `plaky` | `/logos/fallback-plaky.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Plane | `plane` | `/logos/plane.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/plane.svg` |
| PlanetScale | `planetscale` | `/logos/planetscale.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/planetscale.svg` |
| Plasmic | `plasmic` | `/logos/fallback-plasmic.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Play | `play` | `/logos/fallback-play.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Plesk | `plesk` | `/logos/plesk.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/plesk.svg` |
| Plex | `plex` | `/logos/plex.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/plex.svg` |
| Plunk | `plunk` | `/logos/fallback-plunk.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pluton | `pluton` | `/logos/fallback-pluton.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pocket | `pocket` | `/logos/fallback-pocket.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pocket ID | `pocket-id` | `/logos/fallback-pocket-id.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| PocketBase | `pocketbase` | `/logos/pocketbase.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/pocketbase.svg` |
| PocketGuard | `pocketguard` | `/logos/fallback-pocketguard.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Poe | `poe` | `/logos/poe.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/poe.svg` |
| Polar | `polar` | `/logos/fallback-polar.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Polygraph | `polygraph` | `/logos/fallback-polygraph.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Porter | `porter` | `/logos/fallback-porter.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Portkey AI Gateway | `portkey-ai-gateway` | `/logos/fallback-portkey-ai-gateway.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Post Bridge | `post-bridge` | `/logos/fallback-post-bridge.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Postal | `postal` | `/logos/fallback-postal.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Postel | `postel` | `/logos/fallback-postel.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Postgraphile | `postgraphile` | `/logos/fallback-postgraphile.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Posthaven | `posthaven` | `/logos/fallback-posthaven.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| PostHog | `posthog` | `/logos/posthog.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/posthog.svg` |
| Postmark | `postmark` | `/logos/fallback-postmark.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Power Apps | `power-apps` | `/logos/fallback-power-apps.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Power BI | `power-bi` | `/logos/fallback-power-bi.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Prefect | `prefect` | `/logos/prefect.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/prefect.svg` |
| Adobe Premiere Pro | `premiere-pro` | `/logos/fallback-premiere-pro.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pretix | `pretix` | `/logos/fallback-pretix.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Prisme Analytics | `prisme-analytics` | `/logos/fallback-prisme-analytics.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Prismical | `prismical` | `/logos/fallback-prismical.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Private Captcha | `private-captcha` | `/logos/fallback-private-captcha.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pro Tools | `pro-tools` | `/logos/pro-tools.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/protools.svg` |
| Probo | `probo` | `/logos/fallback-probo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Procaptcha | `procaptcha` | `/logos/fallback-procaptcha.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ProcessWire | `processwire` | `/logos/processwire.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/processwire.svg` |
| ProductBoard | `productboard` | `/logos/fallback-productboard.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Productlane | `productlane` | `/logos/fallback-productlane.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Profound | `profound` | `/logos/fallback-profound.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ProjectDiscovery | `projectdiscovery` | `/logos/fallback-projectdiscovery.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Prometheus | `prometheus` | `/logos/prometheus.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/prometheus.svg` |
| Promptwatch | `promptwatch` | `/logos/fallback-promptwatch.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Proton Drive | `proton-drive` | `/logos/proton-drive.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/protondrive.svg` |
| Proton Lumo | `proton-lumo` | `/logos/fallback-proton-lumo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Proton Mail | `proton-mail` | `/logos/proton-mail.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/protonmail.svg` |
| Proton Pass | `proton-pass` | `/logos/fallback-proton-pass.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Proton VPN | `proton-vpn` | `/logos/proton-vpn.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/protonvpn.svg` |
| Psono | `psono` | `/logos/fallback-psono.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Publii | `publii` | `/logos/fallback-publii.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pulley | `pulley` | `/logos/fallback-pulley.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pullfrog | `pullfrog` | `/logos/fallback-pullfrog.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pulsetic | `pulsetic` | `/logos/fallback-pulsetic.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pulumi | `pulumi` | `/logos/pulumi.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/pulumi.svg` |
| Pumble | `pumble` | `/logos/fallback-pumble.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Puppet | `puppet` | `/logos/puppet.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/puppet.svg` |
| Puter | `puter` | `/logos/fallback-puter.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Pylon | `pylon` | `/logos/fallback-pylon.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| QA Wolf | `qa-wolf` | `/logos/fallback-qa-wolf.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Qdrant | `qdrant` | `/logos/qdrant.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/qdrant.svg` |
| Qlik | `qlik` | `/logos/qlik.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/qlik.svg` |
| Qoder | `qoder` | `/logos/fallback-qoder.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Qodo | `qodo` | `/logos/qodo.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/qodo.svg` |
| Quackback | `quackback` | `/logos/fallback-quackback.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Qualtrics | `qualtrics` | `/logos/qualtrics.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/qualtrics.svg` |
| Quant-UX | `quant-ux` | `/logos/fallback-quant-ux.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| QuestDB | `questdb` | `/logos/fallback-questdb.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Quickbooks | `quickbooks` | `/logos/quickbooks.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/quickbooks.svg` |
| Quickwit | `quickwit` | `/logos/fallback-quickwit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Quiet | `quiet` | `/logos/fallback-quiet.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Quizlet | `quizlet` | `/logos/quizlet.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/quizlet.svg` |
| Qwen Code | `qwen-code` | `/logos/fallback-qwen-code.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Railway | `railway` | `/logos/railway.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/railway.svg` |
| Raindrop | `raindrop` | `/logos/fallback-raindrop.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Rakazo | `rakazo` | `/logos/fallback-rakazo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Rallly | `rallly` | `/logos/fallback-rallly.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| RapidWeaver | `rapidweaver` | `/logos/fallback-rapidweaver.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Rasa | `rasa` | `/logos/rasa.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/rasa.svg` |
| RAWmakase | `rawmakase` | `/logos/fallback-rawmakase.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| RawTherapee | `rawtherapee` | `/logos/fallback-rawtherapee.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Raycast | `raycast` | `/logos/raycast.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/raycast.svg` |
| Raygun | `raygun` | `/logos/fallback-raygun.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Readeck | `readeck` | `/logos/fallback-readeck.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Readwise Reader | `readwise-reader` | `/logos/fallback-readwise-reader.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Rebrandly | `rebrandly` | `/logos/fallback-rebrandly.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| reCAPTCHA | `recaptcha` | `/logos/fallback-recaptcha.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Reception.ai | `reception-ai` | `/logos/fallback-reception-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Recurly | `recurly` | `/logos/fallback-recurly.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Red Hat Ansible | `red-hat-ansible` | `/logos/fallback-red-hat-ansible.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Red Hat OpenShift | `red-hat-openshift` | `/logos/red-hat-openshift.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/redhatopenshift.svg` |
| Redash | `redash` | `/logos/redash.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/redash.svg` |
| Reddit | `reddit` | `/logos/reddit.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/reddit.svg` |
| Redis | `redis` | `/logos/redis.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/redis.svg` |
| Redmine | `redmine` | `/logos/redmine.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/redmine.svg` |
| RedShift | `redshift` | `/logos/fallback-redshift.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Refine | `refine` | `/logos/refine.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/refine.svg` |
| Reflet | `reflet` | `/logos/fallback-reflet.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Reflex | `reflex` | `/logos/reflex.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/reflex.svg` |
| RefWorks | `refworks` | `/logos/fallback-refworks.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Relaticle | `relaticle` | `/logos/fallback-relaticle.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Relay.app | `relay-app` | `/logos/fallback-relay-app.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Relevance AI | `relevance-ai` | `/logos/fallback-relevance-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Remote | `remote` | `/logos/fallback-remote.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Render | `render` | `/logos/render.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/render.svg` |
| Replit | `replit` | `/logos/replit.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/replit.svg` |
| Requestly | `requestly` | `/logos/fallback-requestly.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Requesty | `requesty` | `/logos/fallback-requesty.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| RescueTime | `rescuetime` | `/logos/rescuetime.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/rescuetime.svg` |
| Resend | `resend` | `/logos/resend.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/resend.svg` |
| Resilio Sync | `resilio-sync` | `/logos/fallback-resilio-sync.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ResourceSpace | `resourcespace` | `/logos/fallback-resourcespace.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Respond.io | `respond-io` | `/logos/fallback-respond-io.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Retell | `retell` | `/logos/fallback-retell.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Retool | `retool` | `/logos/retool.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/retool.svg` |
| Rewind.ai | `rewind-ai` | `/logos/fallback-rewind-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Rivet | `rivet` | `/logos/fallback-rivet.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Roam Research | `roam-research` | `/logos/roam-research.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/roamresearch.svg` |
| Rocket.Chat | `rocket-chat` | `/logos/rocket-chat.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/rocketdotchat.svg` |
| Rocket Money | `rocket-money` | `/logos/fallback-rocket-money.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Rollbar | `rollbar` | `/logos/rollbar.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/rollbar.svg` |
| Roomote | `roomote` | `/logos/fallback-roomote.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Rootly | `rootly` | `/logos/fallback-rootly.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Rosie | `rosie` | `/logos/fallback-rosie.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Roundcube | `roundcube` | `/logos/roundcube.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/roundcube.svg` |
| Router | `router` | `/logos/fallback-router.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Rowy | `rowy` | `/logos/fallback-rowy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Rube | `rube` | `/logos/fallback-rube.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Rybbit | `rybbit` | `/logos/fallback-rybbit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ryot | `ryot` | `/logos/fallback-ryot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Safari | `safari` | `/logos/safari.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/safari.svg` |
| Saleor | `saleor` | `/logos/fallback-saleor.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Salesforce | `salesforce` | `/logos/fallback-salesforce.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Salesforce Commerce Cloud | `salesforce-commerce-cloud` | `/logos/fallback-salesforce-commerce-cloud.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SAMA | `sama` | `/logos/fallback-sama.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Same | `same` | `/logos/fallback-same.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sanity | `sanity` | `/logos/sanity.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/sanity.svg` |
| SAP | `sap` | `/logos/sap.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/sap.svg` |
| Savvycal | `savvycal` | `/logos/fallback-savvycal.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| s&box | `sbox` | `/logos/fallback-sbox.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Scalar | `scalar` | `/logos/scalar.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/scalar.svg` |
| Scanopy | `scanopy` | `/logos/fallback-scanopy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Scape | `scape` | `/logos/fallback-scape.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Scira | `scira` | `/logos/fallback-scira.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ScrapingBee | `scrapingbee` | `/logos/fallback-scrapingbee.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Screen Studio | `screen-studio` | `/logos/fallback-screen-studio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ScreenFlow | `screenflow` | `/logos/fallback-screenflow.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Screenity | `screenity` | `/logos/fallback-screenity.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Screenly | `screenly` | `/logos/fallback-screenly.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Scrivener | `scrivener` | `/logos/fallback-scrivener.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Scrunch | `scrunch` | `/logos/fallback-scrunch.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Scrut | `scrut` | `/logos/fallback-scrut.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SE Ranking | `se-ranking` | `/logos/fallback-se-ranking.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Seafile | `seafile` | `/logos/seafile.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/seafile.svg` |
| SearchAPI | `searchapi` | `/logos/fallback-searchapi.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SecureDocs | `securedocs` | `/logos/fallback-securedocs.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Secureframe | `secureframe` | `/logos/fallback-secureframe.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SeekStorm | `seekstorm` | `/logos/fallback-seekstorm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Segment | `segment` | `/logos/fallback-segment.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Seline | `seline` | `/logos/fallback-seline.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sellfy | `sellfy` | `/logos/sellfy.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/sellfy.svg` |
| Semaphore | `semaphore` | `/logos/fallback-semaphore.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Semrush | `semrush` | `/logos/semrush.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/semrush.svg` |
| Send Anywhere | `send-anywhere` | `/logos/fallback-send-anywhere.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sendbird | `sendbird` | `/logos/fallback-sendbird.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SendGrid | `sendgrid` | `/logos/fallback-sendgrid.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sendible | `sendible` | `/logos/fallback-sendible.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sendinblue | `sendinblue` | `/logos/fallback-sendinblue.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sendportal | `sendportal` | `/logos/fallback-sendportal.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sendy | `sendy` | `/logos/fallback-sendy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sensei | `sensei` | `/logos/fallback-sensei.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sentry | `sentry` | `/logos/sentry.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/sentry.svg` |
| Seon | `seon` | `/logos/fallback-seon.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sequin | `sequin` | `/logos/fallback-sequin.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SeriesGuide | `seriesguide` | `/logos/fallback-seriesguide.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Serif | `serif` | `/logos/fallback-serif.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SerpAPI | `serpapi` | `/logos/fallback-serpapi.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Session | `session` | `/logos/session.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/session.svg` |
| Sessions | `sessions` | `/logos/fallback-sessions.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sevalla | `sevalla` | `/logos/fallback-sevalla.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Shaper | `shaper` | `/logos/fallback-shaper.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SharePoint | `sharepoint` | `/logos/fallback-sharepoint.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Shareworks | `shareworks` | `/logos/fallback-shareworks.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ShareX | `sharex` | `/logos/sharex.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/sharex.svg` |
| Shelf | `shelf` | `/logos/fallback-shelf.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Shelve | `shelve` | `/logos/fallback-shelve.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ShipShipShip | `shipshipship` | `/logos/fallback-shipshipship.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Shipsy | `shipsy` | `/logos/fallback-shipsy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Shlink | `shlink` | `/logos/fallback-shlink.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Shopify | `shopify` | `/logos/shopify.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/shopify.svg` |
| Shopware | `shopware` | `/logos/shopware.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/shopware.svg` |
| Short.io | `shortio` | `/logos/fallback-shortio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Shortwave | `shortwave` | `/logos/fallback-shortwave.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Shotbase | `shotbase` | `/logos/fallback-shotbase.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Shotcut | `shotcut` | `/logos/fallback-shotcut.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Showly | `showly` | `/logos/fallback-showly.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sigle | `sigle` | `/logos/fallback-sigle.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Signage Space | `signage-space` | `/logos/fallback-signage-space.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Signal | `signal` | `/logos/signal.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/signal.svg` |
| SigNoz | `signoz` | `/logos/fallback-signoz.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Silex | `silex` | `/logos/fallback-silex.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Silverbullet | `silverbullet` | `/logos/fallback-silverbullet.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Simkl | `simkl` | `/logos/simkl.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/simkl.svg` |
| Simple Analytics | `simple-analytics` | `/logos/simple-analytics.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/simpleanalytics.svg` |
| SimpleBackups | `simplebackups` | `/logos/fallback-simplebackups.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Singa | `singa` | `/logos/fallback-singa.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sink | `sink` | `/logos/fallback-sink.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Site24x7 | `site24x7` | `/logos/fallback-site24x7.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SiYuan | `siyuan` | `/logos/siyuan.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/siyuan.svg` |
| Sketch | `sketch` | `/logos/sketch.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/sketch.svg` |
| Skool | `skool` | `/logos/fallback-skool.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Skype | `skype` | `/logos/fallback-skype.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Skyvern | `skyvern` | `/logos/fallback-skyvern.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Slack | `slack` | `/logos/slack.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/slack.svg` |
| SlateDB | `slatedb` | `/logos/fallback-slatedb.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Slugy | `slugy` | `/logos/fallback-slugy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Smartsheet | `smartsheet` | `/logos/fallback-smartsheet.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Smith.ai | `smith-ai` | `/logos/fallback-smith-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Smule | `smule` | `/logos/fallback-smule.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Snapify | `snapify` | `/logos/fallback-snapify.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Snowflake | `snowflake` | `/logos/snowflake.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/snowflake.svg` |
| SocialBee | `socialbee` | `/logos/fallback-socialbee.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SocialPilot | `socialpilot` | `/logos/fallback-socialpilot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Softr | `softr` | `/logos/fallback-softr.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Soketi | `soketi` | `/logos/fallback-soketi.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sol | `sol` | `/logos/fallback-sol.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SolarWinds | `solarwinds` | `/logos/fallback-solarwinds.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SolidTime | `solidtime` | `/logos/fallback-solidtime.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Solidus | `solidus` | `/logos/fallback-solidus.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Solo | `solo` | `/logos/fallback-solo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SoloTerm | `soloterm` | `/logos/fallback-soloterm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SonarQube | `sonarqube` | `/logos/fallback-sonarqube.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SoundCloud | `soundcloud` | `/logos/soundcloud.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/soundcloud.svg` |
| Spacedrive | `spacedrive` | `/logos/fallback-spacedrive.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Spacelift | `spacelift` | `/logos/fallback-spacelift.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Spanlens | `spanlens` | `/logos/fallback-spanlens.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Spark Mail | `spark-mail` | `/logos/fallback-spark-mail.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Spike API | `spike-api` | `/logos/fallback-spike-api.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Spinifex | `spinifex` | `/logos/fallback-spinifex.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Splashtop | `splashtop` | `/logos/fallback-splashtop.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Spliit | `spliit` | `/logos/fallback-spliit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Splitpro | `splitpro` | `/logos/fallback-splitpro.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Splitwise | `splitwise` | `/logos/fallback-splitwise.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Splunk | `splunk` | `/logos/splunk.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/splunk.svg` |
| Spotify | `spotify` | `/logos/spotify.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/spotify.svg` |
| Spree Commerce | `spree-commerce` | `/logos/fallback-spree-commerce.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sprinto | `sprinto` | `/logos/fallback-sprinto.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sprites | `sprites` | `/logos/fallback-sprites.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Squad | `squad` | `/logos/fallback-squad.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Squarespace | `squarespace` | `/logos/squarespace.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/squarespace.svg` |
| Stackby | `stackby` | `/logos/fallback-stackby.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Standard Notes | `standard-notes` | `/logos/fallback-standard-notes.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Startpage | `startpage` | `/logos/startpage.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/startpage.svg` |
| Statsig | `statsig` | `/logos/fallback-statsig.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Statusnook | `statusnook` | `/logos/fallback-statusnook.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Atlassian Statuspage | `statuspage` | `/logos/statuspage.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/statuspage.svg` |
| StatusScout | `statusscout` | `/logos/fallback-statusscout.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| StayFree | `stayfree` | `/logos/fallback-stayfree.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Steel | `steel` | `/logos/fallback-steel.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Stepzen | `stepzen` | `/logos/fallback-stepzen.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Stoat | `stoat` | `/logos/fallback-stoat.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Storj | `storj` | `/logos/fallback-storj.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Stormkit | `stormkit` | `/logos/fallback-stormkit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Storyblok | `storyblok` | `/logos/storyblok.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/storyblok.svg` |
| Storyden | `storyden` | `/logos/fallback-storyden.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Strapi | `strapi` | `/logos/strapi.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/strapi.svg` |
| Stream | `stream` | `/logos/fallback-stream.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Streamlit | `streamlit` | `/logos/streamlit.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/streamlit.svg` |
| Stremio | `stremio` | `/logos/stremio.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/stremio.svg` |
| Stripe | `stripe` | `/logos/stripe.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/stripe.svg` |
| Stripe Billing | `stripe-billing` | `/logos/fallback-stripe-billing.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| StrongDM | `strongdm` | `/logos/fallback-strongdm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Stytch | `stytch` | `/logos/fallback-stytch.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sublime Text | `sublime-text` | `/logos/sublime-text.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/sublimetext.svg` |
| Substack | `substack` | `/logos/substack.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/substack.svg` |
| Suite CRM | `suite-crm` | `/logos/fallback-suite-crm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sumo Logic | `sumo-logic` | `/logos/sumo-logic.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/sumologic.svg` |
| SumSub | `sumsub` | `/logos/fallback-sumsub.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Super Productivity | `super-productivity` | `/logos/fallback-super-productivity.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Superhuman Docs | `superhuman-docs` | `/logos/fallback-superhuman-docs.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Superhuman Mail | `superhuman-mail` | `/logos/fallback-superhuman-mail.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Supermemory | `supermemory` | `/logos/fallback-supermemory.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Supermetrics | `supermetrics` | `/logos/fallback-supermetrics.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Superphenix | `superphenix` | `/logos/fallback-superphenix.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SuperTokens | `supertokens` | `/logos/fallback-supertokens.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Superwhisper | `superwhisper` | `/logos/fallback-superwhisper.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Suprascribe | `suprascribe` | `/logos/fallback-suprascribe.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sure.am | `sure-am` | `/logos/fallback-sure-am.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SurfSense | `surfsense` | `/logos/fallback-surfsense.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Survicate | `survicate` | `/logos/fallback-survicate.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Svix | `svix` | `/logos/fallback-svix.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| SWE-agent | `swe-agent` | `/logos/fallback-swe-agent.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Swetrix | `swetrix` | `/logos/fallback-swetrix.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Swirl Search | `swirl` | `/logos/fallback-swirl.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Synara | `synara` | `/logos/fallback-synara.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Sync-in | `sync-in` | `/logos/fallback-sync-in.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Synology DSM | `synology-dsm` | `/logos/fallback-synology-dsm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| T3.chat | `t3-chat` | `/logos/fallback-t3-chat.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| T3 Code | `t3-code` | `/logos/fallback-t3-code.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tabby | `tabby` | `/logos/fallback-tabby.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tableau | `tableau` | `/logos/fallback-tableau.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TablePlus | `tableplus` | `/logos/fallback-tableplus.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tabnine | `tabnine` | `/logos/fallback-tabnine.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tabularis | `tabularis` | `/logos/fallback-tabularis.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tactiq | `tactiq` | `/logos/fallback-tactiq.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Taia | `taia` | `/logos/fallback-taia.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Taiga | `taiga` | `/logos/fallback-taiga.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tailscale | `tailscale` | `/logos/tailscale.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/tailscale.svg` |
| Tally | `tally` | `/logos/fallback-tally.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tana | `tana` | `/logos/fallback-tana.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tasklet | `tasklet` | `/logos/fallback-tasklet.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tavily | `tavily` | `/logos/fallback-tavily.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| tawk.to | `tawk-to` | `/logos/fallback-tawk-to.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TDengine | `tdengine` | `/logos/fallback-tdengine.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Teable | `teable` | `/logos/fallback-teable.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Teachable | `teachable` | `/logos/fallback-teachable.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TeamPass | `teampass` | `/logos/fallback-teampass.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TeamViewer | `teamviewer` | `/logos/teamviewer.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/teamviewer.svg` |
| Teamwork | `teamwork` | `/logos/fallback-teamwork.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Telegram | `telegram` | `/logos/telegram.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/telegram.svg` |
| Telegraph | `telegraph` | `/logos/telegraph.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/telegraph.svg` |
| Teleport | `teleport` | `/logos/fallback-teleport.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tella | `tella` | `/logos/fallback-tella.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Temporal | `temporal` | `/logos/temporal.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/temporal.svg` |
| Temps | `temps` | `/logos/fallback-temps.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Terminal | `terminal` | `/logos/fallback-terminal.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Termly | `termly` | `/logos/fallback-termly.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Terra API | `terra-api` | `/logos/fallback-terra-api.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Terraform | `terraform` | `/logos/terraform.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/terraform.svg` |
| Terrateam | `terrateam` | `/logos/fallback-terrateam.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TesterArmy | `testerarmy` | `/logos/fallback-testerarmy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Testfully | `testfully` | `/logos/fallback-testfully.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| testRigor | `testrigor` | `/logos/fallback-testrigor.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Testsigma | `testsigma` | `/logos/fallback-testsigma.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Text Blaze | `text-blaze` | `/logos/fallback-text-blaze.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TextExpander | `textexpander` | `/logos/fallback-textexpander.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tggl | `tggl` | `/logos/fallback-tggl.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Things | `things` | `/logos/things.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/things.svg` |
| Thinkific | `thinkific` | `/logos/fallback-thinkific.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Thoropass | `thoropass` | `/logos/fallback-thoropass.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Threads | `threads` | `/logos/threads.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/threads.svg` |
| Threema | `threema` | `/logos/threema.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/threema.svg` |
| Thunderbird for Android | `thunderbird-for-android` | `/logos/fallback-thunderbird-for-android.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tianji | `tianji` | `/logos/fallback-tianji.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ticket Tailor | `ticket-tailor` | `/logos/ticket-tailor.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/tickettailor.svg` |
| TickTick | `ticktick` | `/logos/ticktick.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/ticktick.svg` |
| Tidal | `tidal` | `/logos/tidal.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/tidal.svg` |
| TiDB | `tidb` | `/logos/tidb.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/tidb.svg` |
| Tidio | `tidio` | `/logos/fallback-tidio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TigerGraph | `tigergraph` | `/logos/fallback-tigergraph.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TikTok | `tiktok` | `/logos/tiktok.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/tiktok.svg` |
| Tiledesk | `tiledesk` | `/logos/fallback-tiledesk.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TimeCamp | `timecamp` | `/logos/fallback-timecamp.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TimescaleDb | `timescale` | `/logos/timescale.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/timescale.svg` |
| TimeScribe | `timescribe` | `/logos/fallback-timescribe.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TimeTracker | `timetracker` | `/logos/fallback-timetracker.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TinaCMS | `tinacms` | `/logos/fallback-tinacms.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tines | `tines` | `/logos/fallback-tines.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TinyURL | `tinyurl` | `/logos/fallback-tinyurl.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tirreno | `tirreno` | `/logos/fallback-tirreno.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tito | `tito` | `/logos/fallback-tito.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| tl;dv | `tl-dv` | `/logos/fallback-tl-dv.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Todoist | `todoist` | `/logos/todoist.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/todoist.svg` |
| Together AI | `together-ai` | `/logos/fallback-together-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Together Sandbox | `together-sandbox` | `/logos/fallback-together-sandbox.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Toggl | `toggl` | `/logos/toggl.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/toggl.svg` |
| Tolaria | `tolaria` | `/logos/fallback-tolaria.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tolgee | `tolgee` | `/logos/fallback-tolgee.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tonkatsu Box | `tonkatsu-box` | `/logos/fallback-tonkatsu-box.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ToolJet | `tooljet` | `/logos/fallback-tooljet.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tower | `tower` | `/logos/tower.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/tower.svg` |
| Tracecat | `tracecat` | `/logos/fallback-tracecat.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TRAE | `trae` | `/logos/trae.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/trae.svg` |
| Trakt.tv | `trakt-tv` | `/logos/fallback-trakt-tv.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Trello | `trello` | `/logos/trello.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/trello.svg` |
| Trench | `trench` | `/logos/fallback-trench.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tresorit | `tresorit` | `/logos/tresorit.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/tresorit.svg` |
| Tribe | `tribe` | `/logos/fallback-tribe.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tricentis | `tricentis` | `/logos/tricentis.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/tricentis.svg` |
| Trigger | `trigger` | `/logos/fallback-trigger.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TryPost | `trypost` | `/logos/fallback-trypost.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tuple | `tuple` | `/logos/fallback-tuple.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Turnstone | `turnstone` | `/logos/fallback-turnstone.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Turso | `turso` | `/logos/turso.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/turso.svg` |
| Tuta | `tuta` | `/logos/tuta.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/tuta.svg` |
| TV Time | `tv-time` | `/logos/tv-time.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/tvtime.svg` |
| Twake Chat | `twake-chat` | `/logos/fallback-twake-chat.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Twake Drive | `twake-drive` | `/logos/fallback-twake-drive.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Twake Mail | `twake-mail` | `/logos/fallback-twake-mail.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Twenty | `twenty` | `/logos/twenty.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/twenty.svg` |
| Twilio | `twilio` | `/logos/fallback-twilio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Twill CMS | `twill-cms` | `/logos/fallback-twill-cms.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Twingate | `twingate` | `/logos/fallback-twingate.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Twisp | `twisp` | `/logos/fallback-twisp.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Twist | `twist` | `/logos/fallback-twist.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Tyk | `tyk` | `/logos/fallback-tyk.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Typefully | `typefully` | `/logos/fallback-typefully.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Typeless | `typeless` | `/logos/fallback-typeless.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Typemill | `typemill` | `/logos/fallback-typemill.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Typepad | `typepad` | `/logos/fallback-typepad.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Typerelay | `typerelay` | `/logos/fallback-typerelay.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Typesense | `typesense` | `/logos/fallback-typesense.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| TypingMind | `typingmind` | `/logos/fallback-typingmind.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ubersuggest | `ubersuggest` | `/logos/fallback-ubersuggest.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ubicloud | `ubicloud` | `/logos/fallback-ubicloud.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Uchat | `uchat` | `/logos/fallback-uchat.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Udemy | `udemy` | `/logos/udemy.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/udemy.svg` |
| Ueli | `ueli` | `/logos/fallback-ueli.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Umbrel | `umbrel` | `/logos/umbrel.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/umbrel.svg` |
| undb | `undb` | `/logos/fallback-undb.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| UniBee | `unibee` | `/logos/fallback-unibee.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Unified | `unified` | `/logos/fallback-unified.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| UnInbox | `uninbox` | `/logos/fallback-uninbox.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Unity | `unity` | `/logos/unity.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/unity.svg` |
| Unleash | `unleash` | `/logos/fallback-unleash.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| UnoPim | `unopim` | `/logos/fallback-unopim.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Unraid | `unraid` | `/logos/unraid.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/unraid.svg` |
| Unreal Engine | `unreal-engine` | `/logos/unreal-engine.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/unrealengine.svg` |
| Upfirst | `upfirst` | `/logos/fallback-upfirst.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Upsource | `upsource` | `/logos/fallback-upsource.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Uptime Kuma | `uptime-kuma` | `/logos/uptime-kuma.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/uptimekuma.svg` |
| Uptimepage | `uptimepage` | `/logos/fallback-uptimepage.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| UptimeRobot | `uptimerobot` | `/logos/fallback-uptimerobot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Uptrace | `uptrace` | `/logos/fallback-uptrace.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Upvoty | `upvoty` | `/logos/fallback-upvoty.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Usercentrics | `usercentrics` | `/logos/fallback-usercentrics.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Userflow | `userflow` | `/logos/fallback-userflow.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| UserJot | `userjot` | `/logos/fallback-userjot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Userlist | `userlist` | `/logos/fallback-userlist.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Usersnap | `usersnap` | `/logos/fallback-usersnap.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Usertour | `usertour` | `/logos/fallback-usertour.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| UserTourKit | `usertourkit` | `/logos/fallback-usertourkit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| UserVoice | `uservoice` | `/logos/uservoice.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/uservoice.svg` |
| useSend | `usesend` | `/logos/fallback-usesend.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| v0 | `v0` | `/logos/v0.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/v0.svg` |
| Valentina Studio | `valentina-studio` | `/logos/fallback-valentina-studio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Valour | `valour` | `/logos/fallback-valour.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Vanta | `vanta` | `/logos/fallback-vanta.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Vapi | `vapi` | `/logos/fallback-vapi.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| HashiCorp Vault | `vault` | `/logos/vault.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/vault.svg` |
| Vaultwarden | `vaultwarden` | `/logos/vaultwarden.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/vaultwarden.svg` |
| vBulletin | `vbulletin` | `/logos/vbulletin.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/vbulletin.svg` |
| Vector | `vector` | `/logos/fallback-vector.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Veeam | `veeam` | `/logos/veeam.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/veeam.svg` |
| Vemetric | `vemetric` | `/logos/fallback-vemetric.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Vendure | `vendure` | `/logos/fallback-vendure.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Vercel | `vercel` | `/logos/vercel.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/vercel.svg` |
| Vercel AI Gateway | `vercel-ai-gateway` | `/logos/fallback-vercel-ai-gateway.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| VerifyWise | `verifywise` | `/logos/fallback-verifywise.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Vertabelo | `vertabelo` | `/logos/fallback-vertabelo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Vertex AI | `vertex-ai` | `/logos/fallback-vertex-ai.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Vibecode | `vibecode` | `/logos/fallback-vibecode.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| VictoriaMetrics | `victoriametrics` | `/logos/victoriametrics.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/victoriametrics.svg` |
| Viktor | `viktor` | `/logos/fallback-viktor.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Vikunja | `vikunja` | `/logos/vikunja.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/vikunja.svg` |
| Virtuozzo | `virtuozzo` | `/logos/fallback-virtuozzo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Vista Social | `vistasocial` | `/logos/fallback-vistasocial.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Visual Studio Code | `visual-studio-code` | `/logos/fallback-visual-studio-code.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| VMware | `vmware` | `/logos/vmware.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/vmware.svg` |
| Voibe | `voibe` | `/logos/fallback-voibe.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Voiceflow | `voiceflow` | `/logos/fallback-voiceflow.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| VoiceInk | `voiceink` | `/logos/fallback-voiceink.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| VoiceTypr | `voicetypr` | `/logos/fallback-voicetypr.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| VoidAuth | `voidauth` | `/logos/fallback-voidauth.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Voiden | `voiden` | `/logos/fallback-voiden.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Vrite | `vrite` | `/logos/fallback-vrite.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Vvveb CMS | `vvveb-cms` | `/logos/fallback-vvveb-cms.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Wachd | `wachd` | `/logos/fallback-wachd.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Wakapi | `wakapi` | `/logos/fallback-wakapi.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| WakaTime | `wakatime` | `/logos/wakatime.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/wakatime.svg` |
| Wallabag | `wallabag` | `/logos/wallabag.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/wallabag.svg` |
| Warp | `warp` | `/logos/warp.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/warp.svg` |
| Warpdrive | `warpdrive` | `/logos/fallback-warpdrive.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Waterfox | `waterfox` | `/logos/fallback-waterfox.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Watermelon | `watermelon` | `/logos/fallback-watermelon.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Wati | `wati` | `/logos/fallback-wati.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| WaveTerm | `waveterm` | `/logos/fallback-waveterm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Wealthfolio | `wealthfolio` | `/logos/fallback-wealthfolio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Weav | `weav` | `/logos/fallback-weav.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Weaviate | `weaviate` | `/logos/weaviate.svg` | unverified | Website favicon fallback; visually review before using as a logo |
| Webex | `webex` | `/logos/webex.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/webex.svg` |
| Webflow | `webflow` | `/logos/webflow.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/webflow.svg` |
| Webiny | `webiny` | `/logos/fallback-webiny.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Weblate | `weblate` | `/logos/weblate.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/weblate.svg` |
| WebStudio | `webstudio` | `/logos/fallback-webstudio.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Weebly | `weebly` | `/logos/fallback-weebly.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Wegic | `wegic` | `/logos/fallback-wegic.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Weglot | `weglot` | `/logos/fallback-weglot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Weights and Biases | `weights-and-biases` | `/logos/weights-and-biases.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/weightsandbiases.svg` |
| Wekan | `wekan` | `/logos/fallback-wekan.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Werbot | `werbot` | `/logos/fallback-werbot.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| WeTransfer | `wetransfer` | `/logos/wetransfer.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/wetransfer.svg` |
| WezTerm | `wezterm` | `/logos/wezterm.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/wezterm.svg` |
| WhatsApp | `whatsapp` | `/logos/whatsapp.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/whatsapp.svg` |
| Willow | `willow` | `/logos/fallback-willow.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Windmill | `windmill` | `/logos/fallback-windmill.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Windshift | `windshift` | `/logos/fallback-windshift.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Windsurf | `windsurf` | `/logos/windsurf.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/windsurf.svg` |
| Wire | `wire` | `/logos/wire.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/wire.svg` |
| WireGuard | `wireguard` | `/logos/wireguard.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/wireguard.svg` |
| Wispr Flow | `wisprflow` | `/logos/fallback-wisprflow.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Wix | `wix` | `/logos/wix.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/wix.svg` |
| Wix Stores | `wix-stores` | `/logos/fallback-wix-stores.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| WooCommerce | `woocommerce` | `/logos/woocommerce.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/woocommerce.svg` |
| Woodpecker CI | `woodpecker-ci` | `/logos/fallback-woodpecker-ci.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| WordPress | `wordpress` | `/logos/wordpress.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/wordpress.svg` |
| Workable | `workable` | `/logos/fallback-workable.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Workato | `workato` | `/logos/fallback-workato.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Workbench | `workbench` | `/logos/fallback-workbench.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Worklenz | `worklenz` | `/logos/fallback-worklenz.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| WorkOS | `workos` | `/logos/fallback-workos.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| WR.DO | `wr-do` | `/logos/fallback-wr-do.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Wraft | `wraft` | `/logos/fallback-wraft.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Wraps | `wraps` | `/logos/fallback-wraps.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Writizzy | `writizzy` | `/logos/fallback-writizzy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| WunderGraph | `wundergraph` | `/logos/fallback-wundergraph.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| X (Twitter) | `x-twitter` | `/logos/fallback-x-twitter.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Xero | `xero` | `/logos/xero.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/xero.svg` |
| XWiki | `xwiki` | `/logos/fallback-xwiki.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| xyd | `xyd` | `/logos/fallback-xyd.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Yaak | `yaak` | `/logos/yaak.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/yaak.svg` |
| YAFFA | `yaffa` | `/logos/fallback-yaffa.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Ycode | `ycode` | `/logos/fallback-ycode.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| YNAB | `ynab` | `/logos/fallback-ynab.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Yodeck | `yodeck` | `/logos/fallback-yodeck.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| YouForm | `youform` | `/logos/fallback-youform.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Your Next Store (YNS) | `yournextstore` | `/logos/fallback-yournextstore.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| YouTube | `youtube` | `/logos/youtube.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/youtube.svg` |
| YouTube Music | `youtube-music` | `/logos/youtube-music.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/youtubemusic.svg` |
| YunoHost | `yunohost` | `/logos/yunohost.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/yunohost.svg` |
| Zabbix | `zabbix` | `/logos/fallback-zabbix.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zammad | `zammad` | `/logos/fallback-zammad.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ZaneOps | `zaneops` | `/logos/fallback-zaneops.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zed | `zed` | `/logos/fallback-zed.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zellij | `zellij` | `/logos/fallback-zellij.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zen | `zen` | `/logos/fallback-zen.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zen Browser | `zen-browser` | `/logos/zen-browser.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/zenbrowser.svg` |
| Zen | `zen-privacy` | `/logos/fallback-zen-privacy.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zenblog | `zenblog` | `/logos/fallback-zenblog.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zencoder | `zencoder` | `/logos/fallback-zencoder.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zendesk | `zendesk` | `/logos/zendesk.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/zendesk.svg` |
| Zero | `zero` | `/logos/fallback-zero.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| ZeroClaw | `zeroclaw` | `/logos/fallback-zeroclaw.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zerotier | `zerotier` | `/logos/zerotier.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/zerotier.svg` |
| Ziit | `ziit` | `/logos/fallback-ziit.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zitadel | `zitadel` | `/logos/fallback-zitadel.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zo Computer | `zo-computer` | `/logos/fallback-zo-computer.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zoho | `zoho` | `/logos/zoho.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/zoho.svg` |
| Zoho Cliq | `zoho-cliq` | `/logos/fallback-zoho-cliq.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zoho Desk | `zoho-desk` | `/logos/fallback-zoho-desk.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zoho Flow | `zoho-flow` | `/logos/fallback-zoho-flow.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zoho Invoice | `zoho-invoice` | `/logos/fallback-zoho-invoice.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zoho Mail | `zoho-mail` | `/logos/fallback-zoho-mail.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zoho CRM | `zohocrm` | `/logos/fallback-zohocrm.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zola | `zola` | `/logos/zola.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/zola.svg` |
| Zonka | `zonka` | `/logos/fallback-zonka.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zoom | `zoom` | `/logos/zoom.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/zoom.svg` |
| Zotero | `zotero` | `/logos/zotero.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/zotero.svg` |
| Zulip | `zulip` | `/logos/zulip.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/zulip.svg` |
| Zuora | `zuora` | `/logos/fallback-zuora.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
| Zuplo | `zuplo` | `/logos/fallback-zuplo.svg` | unverified | Domain favicon fallback from the catalogue-listed website URL; this is not verified brand artwork. |
