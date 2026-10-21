# Tech Hacks AI logo audit

Audit date: 2026-10-21

This report records the logo mappings used by the active catalogue. The
machine-readable source of truth remains `public/logo-manifest.json`; the
runtime resolver is `src/data/brandLogos.ts`. Every entry below was checked for
an exact local asset path, a non-conflicting canonical slug, and a safe runtime
fallback.

## Audit summary

- **218** canonical registry mappings audited.
- **104** unique active catalogue identities audited: 27 open-source tools, 65
  AI tools, and 14 proprietary alternative targets (106 records because two
  identities appear in more than one catalogue relationship).
- **14** offer records audited; they reference **12** shared provider logos.
- **35** active AI mappings have traceable official-web or maintained Simple
  Icons metadata and are marked `verified` below when the source is not a
  favicon fallback.
- **8** active AI mappings use workspace-provided logo files supplied after the
  browser export. They are marked `provided`, include SHA-256 hashes in
  `exports/official-ai-logos/provided-assets.csv`, and are not claimed as
  direct web downloads.
- **1** known mismatch was corrected: xAI no longer points to the X mark. It
  remains explicitly `unverified` and uses the component's name fallback.
- **108** registry mappings remain `unverified` or need provenance follow-up.
  They are not presented as official marks in the UI.

The runtime now requires a non-fallback entry to carry a traceable `sourceUrl`
before it renders the local asset. The active catalogue currently has 43
traceable entries (35 web/Simple Icons references and 8 explicitly labelled
workspace-provided assets), 5 explicit fallback mappings, and 17
provenance-follow-up identities. The latter use a neutral monogram until an
official source or maintained Simple Icons reference is recorded.

`verified` means the local asset has a recorded official or Simple Icons source
reference. `provided` means the workspace supplied the actual file and the
identity was visually reviewed, but the direct asset URL was not independently
verified. `unverified` means the asset has no traceable source in the current
manifest, or is derived from a favicon. `corrected` is reserved for a mapping
that was actively fixed but still needs a first-party mark; xAI is documented
as `unverified` because no trustworthy original mark is stored.

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
