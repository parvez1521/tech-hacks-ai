# Tech Hacks AI logo audit

Audit date: 2026-10-21

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
