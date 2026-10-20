# Tech Hacks AI logo audit

Audit date: 2026-10-19

This report records the logo mappings used by the active catalogue. The
machine-readable source of truth remains `public/logo-manifest.json`; the
runtime resolver is `src/data/brandLogos.ts`. Every entry below was checked for
an exact local asset path, a non-conflicting canonical slug, and a safe runtime
fallback.

## Audit summary

- **218** canonical registry mappings audited.
- **104** active catalogue identities audited: 27 open-source tools, 65 AI
  tools, and 14 proprietary alternative targets.
- **14** offer records audited; they reference **12** shared provider logos.
- **109** mappings have traceable source metadata and are marked `verified`
  below when the source is not a favicon fallback.
- **1** known mismatch was corrected: xAI no longer points to the X mark. It
  remains explicitly `unverified` and uses the component's name fallback.
- **109** mappings remain `unverified` or need provenance follow-up. They are
  not presented as official marks in the UI.

`verified` means the local SVG has a recorded official or Simple Icons source
reference. `unverified` means the asset has no traceable source in the current
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
| Aider | `aider` | `/logos/aider.svg` | unverified | Not recorded |
| Cline | `cline` | `/logos/cline.svg` | unverified | Not recorded |
| Roo Code | `roocode` | `/logos/roocode.svg` | unverified | Not recorded |
| OpenCode | `opencode` | `/logos/opencode.svg` | unverified | Not recorded |
| Perplexica | `perplexica` | `/logos/perplexica.svg` | unverified | Not recorded |
| Khoj | `khoj` | `/logos/khoj.svg` | unverified | Not recorded |
| SearXNG | `searxng` | `/logos/searxng.svg` | unverified | Not recorded |
| Claude 3.5 Sonnet | `claude` | `/logos/claude.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/claude.svg` |
| ChatGPT | `chatgpt` | `/logos/chatgpt.svg` | unverified | Favicon reference; not treated as original mark |
| Perplexity AI | `perplexity` | `/logos/perplexity.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/perplexity.svg` |
| Google Gemini | `gemini` | `/logos/gemini.svg` | unverified | Not recorded |
| DeepSeek | `deepseek` | `/logos/deepseek.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/deepseek.svg` |
| Microsoft Copilot | `copilot` | `/logos/copilot.svg` | unverified | Not recorded |
| Mistral Le Chat | `mistral-le-chat` | `/logos/mistral-le-chat.svg` | unverified | Not recorded |
| Qwen Chat | `qwen-chat` | `/logos/qwen-chat.svg` | unverified | Not recorded |
| Meta AI | `meta-ai` | `/logos/meta-ai.svg` | unverified | Not recorded |
| OmniRush | `omnirush` | `/logos/omnirush.svg` | unverified | Not recorded |
| KIE AI | `kie-ai` | `/logos/kie-ai.svg` | unverified | Not recorded |
| Google NotebookLM | `notebooklm` | `/logos/notebooklm.svg` | unverified | Not recorded |
| HuggingChat | `huggingchat` | `/logos/huggingchat.svg` | unverified | Not recorded |
| Groq | `groq` | `/logos/groq.svg` | unverified | Favicon reference; not treated as original mark |
| Google AI Studio | `google-ai-studio` | `/logos/google-ai-studio.svg` | unverified | Not recorded |
| Ollama | `ollama` | `/logos/ollama.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/ollama.svg` |
| Open WebUI | `open-webui` | `/logos/open-webui.svg` | unverified | Not recorded |
| Dify.ai | `dify` | `/logos/dify.svg` | unverified | Not recorded |
| Langflow | `langflow` | `/logos/langflow.svg` | unverified | Not recorded |
| LocalAI | `localai` | `/logos/localai.svg` | unverified | Not recorded |
| LibreChat | `librechat` | `/logos/librechat.svg` | unverified | Not recorded |
| Jan | `jan` | `/logos/jan.svg` | unverified | Not recorded |
| AnythingLLM | `anythingllm` | `/logos/anythingllm.svg` | unverified | Not recorded |
| ComfyUI | `comfyui` | `/logos/comfyui.svg` | unverified | Not recorded |
| vLLM | `vllm` | `/logos/vllm.svg` | unverified | Not recorded |
| GPT4All | `gpt4all` | `/logos/gpt4all.svg` | unverified | Not recorded |
| llama.cpp | `llama-cpp` | `/logos/llama-cpp.svg` | unverified | Not recorded |
| Cursor Editor | `cursor` | `/logos/cursor.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/cursor.svg` |
| v0 by Vercel | `v0-vercel` | `/logos/v0-vercel.svg` | unverified | Not recorded |
| Bolt.new | `bolt-new` | `/logos/bolt-new.svg` | unverified | Not recorded |
| Continue | `continue-dev` | `/logos/continue-dev.svg` | unverified | Not recorded |
| Qwen 2.5 Coder | `qwen-coder` | `/logos/qwen-coder.svg` | unverified | Not recorded |
| Replit Agent | `replit-agent` | `/logos/replit-agent.svg` | unverified | Not recorded |
| FLUX.1 by Black Forest Labs | `flux-1` | `/logos/flux-1.svg` | unverified | Not recorded |
| Stable Diffusion 3.5 | `stable-diffusion-3` | `/logos/stable-diffusion-3.svg` | unverified | Not recorded |
| Ideogram v2 | `ideogram` | `/logos/ideogram.svg` | unverified | Favicon reference; not treated as original mark |
| Recraft AI | `recraft` | `/logos/recraft.svg` | unverified | Not recorded |
| Leonardo.ai | `leonardo-ai` | `/logos/leonardo-ai.svg` | unverified | Not recorded |
| Krea AI | `krea-ai` | `/logos/krea-ai.svg` | unverified | Not recorded |
| Midjourney v6.1 | `midjourney` | `/logos/midjourney.svg` | unverified | Not recorded |
| Runway Gen-3 Alpha | `runway` | `/logos/runway.svg` | unverified | Favicon reference; not treated as original mark |
| Luma Dream Machine | `luma-dream-machine` | `/logos/luma-dream-machine.svg` | unverified | Not recorded |
| Kling AI | `kling-ai` | `/logos/kling-ai.svg` | unverified | Not recorded |
| Pika | `pika` | `/logos/pika.svg` | unverified | Favicon reference; not treated as original mark |
| Haiper AI | `haiper` | `/logos/haiper.svg` | unverified | Not recorded |
| Vidu | `vidu` | `/logos/vidu.svg` | unverified | Not recorded |
| Hailuo AI (MiniMax) | `hailuo-ai` | `/logos/hailuo-ai.svg` | unverified | Not recorded |
| Dreamina | `dreamina` | `/logos/dreamina.svg` | unverified | Not recorded |
| PixVerse | `pixverse` | `/logos/pixverse.svg` | unverified | Not recorded |
| Wan 2.1 (Alibaba) | `wan-video` | `/logos/wan-video.svg` | unverified | Not recorded |
| LTX Video | `ltx-video` | `/logos/ltx-video.svg` | unverified | Not recorded |
| CogVideoX | `cogvideox` | `/logos/cogvideox.svg` | unverified | Not recorded |
| Hedra | `hedra` | `/logos/hedra.svg` | unverified | Not recorded |
| Kaiber | `kaiber` | `/logos/kaiber.svg` | unverified | Not recorded |
| Higgsfield AI | `higgsfield` | `/logos/higgsfield.svg` | unverified | Favicon reference; not treated as original mark |
| ElevenLabs | `elevenlabs` | `/logos/elevenlabs.svg` | verified | Simple Icons: `cdn.jsdelivr.net/npm/simple-icons/icons/elevenlabs.svg` |
| Suno | `suno` | `/logos/suno.svg` | unverified | Not recorded |
| Udio | `udio` | `/logos/udio.svg` | unverified | Not recorded |
| Whisper by OpenAI | `whisper` | `/logos/whisper.svg` | unverified | Not recorded |
| Kokoro TTS | `kokoro-tts` | `/logos/kokoro-tts.svg` | unverified | Not recorded |
| Make | `make` | `/logos/make.svg` | unverified | Not recorded |
| Copy.ai | `copy-ai` | `/logos/copy-ai.svg` | unverified | Not recorded |
| Meshy 3D | `meshy-3d` | `/logos/meshy-3d.svg` | unverified | Not recorded |
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
