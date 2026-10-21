# Tech Hacks AI logo audit

Audit date: 2026-10-21

## Follow-up: source corrections and fallback policy (2026-10-22)

The [prompt artwork and logo provenance audit](./prompt-artwork-audit.md) and
[`prompt-image-audit.json`](./prompt-image-audit.json) supersede earlier registry
counts in this historical report. The current registry contains 223 entries.
ChatGPT, FLUX, and Higgsfield now reference locally stored assets from direct
official sources. Google and Cursor are classified as Simple Icons marks, and
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
| Firecrawl | `firecrawl` | `/logos/firecrawl.svg` | unverified | Not recorded |
| Postiz | `postiz` | `/logos/postiz.svg` | unverified | Not recorded |
| Baserow | `baserow` | `/logos/baserow.svg` | unverified | Not recorded |
| AppFlowy | `appflowy` | `/logos/appflowy.svg` | unverified | Not recorded |
| Penpot | `penpot` | `/logos/penpot.svg` | unverified | Not recorded |
| n8n | `n8n` | `/logos/n8n.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/n8n.svg` |
| Plausible Analytics | `plausible` | `/logos/plausible.svg` | unverified | Not recorded |
| Meilisearch | `meilisearch` | `/logos/meilisearch.svg` | unverified | Not recorded |
| Hoppscotch | `hoppscotch` | `/logos/hoppscotch.svg` | unverified | Not recorded |
| Cal.com | `cal-com` | `/logos/cal-com.svg` | unverified | Not recorded |
| Typebot | `typebot` | `/logos/typebot.svg` | unverified | Not recorded |
| Immich | `immich` | `/logos/immich.svg` | unverified | Not recorded |
| Outline | `outline` | `/logos/outline.svg` | unverified | Not recorded |
| Novu | `novu` | `/logos/novu.svg` | unverified | Not recorded |
| Docmost | `docmost` | `/logos/docmost.svg` | unverified | Not recorded |
| Beekeeper Studio | `beekeeper-studio` | `/logos/beekeeper-studio.svg` | unverified | Not recorded |
| AFFiNE | `affine` | `/logos/affine.svg` | unverified | Not recorded |
| RustDesk | `rustdesk` | `/logos/rustdesk.svg` | unverified | Not recorded |
| Umami | `umami` | `/logos/umami.svg` | unverified | Not recorded |
| Aider | `aider` | `/logos/official-ai/aider.svg` | verified | Official web export; see `manifest.csv` |
| Cline | `cline` | `/logos/cline.svg` | unverified | Not recorded |
| Roo Code | `roocode` | `/logos/roocode.svg` | unverified | Not recorded |
| OpenCode | `opencode` | `/logos/opencode.svg` | unverified | Not recorded |
| Perplexica | `perplexica` | `/logos/perplexica.svg` | unverified | Not recorded |
| Khoj | `khoj` | `/logos/khoj.svg` | unverified | Not recorded |
| SearXNG | `searxng` | `/logos/searxng.svg` | unverified | Not recorded |
| Claude 3.5 Sonnet | `claude` | `/logos/claude.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/claude.svg` |
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
| GPT4All | `gpt4all` | `/logos/gpt4all.svg` | unverified | Not recorded |
| llama.cpp | `llama-cpp` | `/logos/official-ai/llama-cpp.svg` | verified | Official web export; see `manifest.csv` |
| Cursor Editor | `cursor` | `/logos/cursor.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/cursor.svg` |
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
| Claude 3.5 Sonnet (claude) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/claude.svg) | `/logos/claude.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
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
| Cursor Editor (cursor) | [source recorded](https://cdn.jsdelivr.net/npm/simple-icons/icons/cursor.svg) | `/logos/cursor.svg` | Asset shown in both contact sheets; identity/source not independently reverified | Visible in light/dark sheet; no targeted change | Source recorded; visual asset loaded |
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
