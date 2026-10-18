import { aiToolsData } from '../data/aiToolsData.ts';
import { toolsData } from '../data/seedData.ts';
import { proprietaryTools } from '../data/alternatives.ts';
import { guidesData } from '../data/guidesData.ts';
import type { AiTool, Tool } from '../types/index.ts';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  suggestions?: string[];
  groundedTools?: {
    name: string;
    slug: string;
    type: 'ai' | 'open-source';
    pricingSummary: string;
    websiteUrl: string;
  }[];
}

/**
 * Normalizes query string for bilingual (English & Hindi/Hinglish) pattern matching
 */
function normalizeQuery(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Core grounded catalog response generator
 */
export function generateGroundedResponse(userQuery: string): ChatMessage {
  const q = normalizeQuery(userQuery);
  const now = Date.now();

  // 1. Pika Specific Query (Pricing & Recurring Free Check)
  if (q.includes('pika')) {
    const pika = aiToolsData.find((t) => t.id === 'pika');
    const freeAlts = aiToolsData.filter(
      (t) => t.category === 'video' && (t.freeAccessType === 'recurring-free' || t.freeAccessType === 'open-source-local')
    );

    return {
      id: `bot-${now}`,
      sender: 'assistant',
      timestamp: now,
      text: `**Regarding Pika's Free Access Status:**\n\n` +
        `• **Pika** does **not** have a recurring monthly free plan. It only offers one-time starter trial credits upon account verification, and requires a paid subscription ($10/month) for continuous generation.\n\n` +
        `**Verified Free Alternatives for Video Generation:**\n` +
        `• [Kling AI](/ai-tools/kling-ai) — 66 free daily credits (~6 free videos/day)\n` +
        `• [PixVerse](/ai-tools/pixverse) — Free daily check-in credits for 10-15 generations/day\n` +
        `• [Vidu](/ai-tools/vidu) — 40 monthly recurring credits (~8 generations/month)\n` +
        `• [Dreamina](/ai-tools/dreamina) — 60 daily generation credits via CapCut\n` +
        `• [Wan 2.1](/ai-tools/wan-video) — 100% Free & Open-Weights (Apache 2.0) by Alibaba for local GPUs\n\n` +
        `Would you like instructions on running Wan 2.1 locally or maximizing Kling's daily credits?`,
      suggestions: ['Tell me about Wan 2.1', 'Compare Kling AI vs Vidu', 'Best AI image generators'],
      groundedTools: [
        { name: 'Kling AI', slug: 'kling-ai', type: 'ai', pricingSummary: '66 daily check-in credits', websiteUrl: 'https://klingai.com' },
        { name: 'Vidu', slug: 'vidu', type: 'ai', pricingSummary: '40 monthly recurring credits', websiteUrl: 'https://go.vidu.com' },
        { name: 'Wan 2.1', slug: 'wan-video', type: 'ai', pricingSummary: '100% Free Open Weights (Apache 2.0)', websiteUrl: 'https://github.com/Wan-Video/Wan2.1' },
      ],
    };
  }

  // 2. Frontier Models: GPT-6 Astra, Claude Fable 5.1 & OmniRush / KIE AI
  if (
    q.includes('gpt-6') ||
    q.includes('astra') ||
    q.includes('fable') ||
    q.includes('omnirush') ||
    q.includes('kie')
  ) {
    return {
      id: `bot-${now}`,
      sender: 'assistant',
      timestamp: now,
      text: `**Frontier Model Status & Evaluation Platforms:**\n\n` +
        `• **Claude Fable 5.1:** Marked as **Evaluation / Coming Soon** on specialized model marketplaces like [KIE AI](/ai-tools/kie-ai). Note that Anthropic's public free tier does not currently offer Fable 5.1. For frontier code and logic today, use [Claude 3.5 Sonnet](/ai-tools/claude) or [DeepSeek-R1](/ai-tools/deepseek).\n` +
        `• **GPT-6 Astra:** Previewed in experimental model playgrounds such as [KIE AI](/ai-tools/kie-ai) with starter test credits. For production tasks, [ChatGPT](/ai-tools/chatgpt) (GPT-4o) and [DeepSeek-V3](/ai-tools/deepseek) remain the verified active standards.\n` +
        `• **OmniRush:** [OmniRush](/ai-tools/omnirush) is a developer desktop & terminal platform advertising free community access to frontier model endpoints without upfront credit card requirements.\n\n` +
        `Would you like to compare Claude 3.5 Sonnet with DeepSeek-R1 or explore free frontier coding tools?`,
      suggestions: ['Claude 3.5 Sonnet vs DeepSeek-R1', 'Best free coding tools', 'Explore KIE AI'],
      groundedTools: [
        { name: 'KIE AI', slug: 'kie-ai', type: 'ai', pricingSummary: 'Model evaluation playground with starter trial credits', websiteUrl: 'https://kie.ai' },
        { name: 'OmniRush', slug: 'omnirush', type: 'ai', pricingSummary: 'Frontier developer tool without upfront cards', websiteUrl: 'https://omnirush.ai' },
        { name: 'Claude 3.5 Sonnet', slug: 'claude', type: 'ai', pricingSummary: 'Free tier with dynamic daily quota', websiteUrl: 'https://claude.ai' },
      ],
    };
  }

  // 3. Video Generation Queries (English & Hindi/Hinglish)
  if (
    q.includes('video') ||
    q.includes('animation') ||
    q.includes('motion') ||
    q.includes('kling') ||
    q.includes('vidu') ||
    q.includes('hailuo') ||
    q.includes('runway') ||
    q.includes('wan') ||
    q.includes('ltx') ||
    q.includes('cogvideo') ||
    q.includes('hedra') ||
    q.includes('photo se video') ||
    q.includes('video banana') ||
    q.includes('video generation')
  ) {
    const isHindi = q.includes('banana') || q.includes('chahiye') || q.includes('kaun sa') || q.includes('batao') || q.includes('kare');
    const intro = isHindi
      ? `**Free AI Video Generators ki verified list:**\n\nYahan top video tools hain jo daily recurring free credits ya open-source access provide karte hain:`
      : `**Top Verified Free & Freemium AI Video Generators:**\n\nHere are the top platforms categorized by their actual free access model:`;

    return {
      id: `bot-${now}`,
      sender: 'assistant',
      timestamp: now,
      text: `${intro}\n\n` +
        `**1. Daily Recurring Free Credits (No card needed):**\n` +
        `• [Kling AI](/ai-tools/kling-ai) — 66 daily check-in credits (~6 videos/day), high human motion fidelity\n` +
        `• [Hailuo AI (MiniMax)](/ai-tools/hailuo-ai) — Daily allowance for Video-01 physics & facial expressions\n` +
        `• [PixVerse](/ai-tools/pixverse) — Daily check-in points, selective motion brush, anime & realistic presets\n` +
        `• [Dreamina (CapCut)](/ai-tools/dreamina) — 60 daily credits with direct CapCut timeline export\n` +
        `• [Hedra](/ai-tools/hedra) — 5 daily free generations for expressive talking character avatars\n\n` +
        `**2. Monthly Free Allowance:**\n` +
        `• [Vidu](/ai-tools/vidu) — 40 monthly credits with high-speed U-ViT 1080p rendering\n` +
        `• [Luma Dream Machine](/ai-tools/luma-dream-machine) — 30 monthly generations for cinematic camera movement\n\n` +
        `**3. 100% Free & Open-Weights (Local GPU):**\n` +
        `• [Wan 2.1 (Alibaba)](/ai-tools/wan-video) — Apache 2.0 open weights for 1080p text/image-to-video\n` +
        `• [LTX Video (Lightricks)](/ai-tools/ltx-video) — Realtime 24fps generation for ComfyUI\n` +
        `• [CogVideoX (THUDM)](/ai-tools/cogvideox) — 3D causal VAE open weights for local GPUs\n\n` +
        `Aap kis type ki video banana chahte hain? (Text-to-video, photo animation, ya talking avatar?)`,
      suggestions: ['Talking avatars with Hedra', 'Wan 2.1 local requirements', 'Best video tool for social media'],
      groundedTools: [
        { name: 'Kling AI', slug: 'kling-ai', type: 'ai', pricingSummary: '66 daily check-in credits', websiteUrl: 'https://klingai.com' },
        { name: 'Hailuo AI', slug: 'hailuo-ai', type: 'ai', pricingSummary: 'Daily allowance (MiniMax Video-01)', websiteUrl: 'https://hailuoai.video' },
        { name: 'Wan 2.1', slug: 'wan-video', type: 'ai', pricingSummary: 'Open weights (Apache 2.0)', websiteUrl: 'https://github.com/Wan-Video/Wan2.1' },
        { name: 'Hedra', slug: 'hedra', type: 'ai', pricingSummary: '5 free avatar generations/day', websiteUrl: 'https://www.hedra.com' },
      ],
    };
  }

  // 4. LLM & Chatbot Alternatives (Claude, ChatGPT, DeepSeek, Mistral, Qwen, Meta)
  if (
    q.includes('claude') ||
    q.includes('chatgpt') ||
    q.includes('deepseek') ||
    q.includes('mistral') ||
    q.includes('qwen') ||
    q.includes('meta ai') ||
    q.includes('gemini') ||
    q.includes('chatbot') ||
    q.includes('assistant') ||
    q.includes('llm') ||
    q.includes('reasoning') ||
    q.includes('gpt')
  ) {
    const isHindi = q.includes('kaun sa') || q.includes('chahiye') || q.includes('batao') || q.includes('jaisa');
    const title = isHindi ? '**Top Free Chatbot aur LLM Alternatives:**' : '**Top Verified Chatbots & LLM Alternatives:**';

    return {
      id: `bot-${now}`,
      sender: 'assistant',
      timestamp: now,
      text: `${title}\n\n` +
        `• [Mistral Le Chat](/ai-tools/mistral-le-chat) — 100% Free web chat powered by Mistral Large 2, Pixtral multimodal vision, Codestral programming, and interactive Canvas workspace.\n` +
        `• [Qwen Chat](/ai-tools/qwen-chat) — Free access to Alibaba's flagship Qwen 2.5 Max, QwQ deep reasoning mode, Python sandbox runner, and web grounding.\n` +
        `• [DeepSeek](/ai-tools/deepseek) — Completely free web access to DeepSeek-R1 (math & logic reasoning) and DeepSeek-V3 671B MoE.\n` +
        `• [Claude 3.5 Sonnet](/ai-tools/claude) — Anthropic's flagship for coding and writing with Artifacts canvas (free daily tier).\n` +
        `• [ChatGPT](/ai-tools/chatgpt) — Unlimited GPT-4o mini and capped GPT-4o access with Bing search grounding.\n` +
        `• [Meta AI](/ai-tools/meta-ai) — Free Llama 3.3 70B assistant with instant Imagine image generation.\n` +
        `• [Google Gemini](/ai-tools/gemini) — Multimodal with 1M token context window and Google Workspace extensions.\n\n` +
        `Would you like to compare benchmark scores for coding or creative writing?`,
      suggestions: ['Mistral Le Chat features', 'DeepSeek-R1 vs Claude', 'Best free coding LLM'],
      groundedTools: [
        { name: 'Mistral Le Chat', slug: 'mistral-le-chat', type: 'ai', pricingSummary: '100% Free with Canvas & Pixtral', websiteUrl: 'https://chat.mistral.ai' },
        { name: 'Qwen Chat', slug: 'qwen-chat', type: 'ai', pricingSummary: 'Free with QwQ reasoning & sandbox', websiteUrl: 'https://chat.qwenlm.ai' },
        { name: 'DeepSeek', slug: 'deepseek', type: 'ai', pricingSummary: 'Free R1 reasoning & V3 web chat', websiteUrl: 'https://chat.deepseek.com' },
        { name: 'Claude 3.5 Sonnet', slug: 'claude', type: 'ai', pricingSummary: 'Free dynamic daily limits', websiteUrl: 'https://claude.ai' },
      ],
    };
  }

  // 5. Coding & Developer Tools
  if (
    q.includes('code') ||
    q.includes('coding') ||
    q.includes('developer') ||
    q.includes('ide') ||
    q.includes('cursor') ||
    q.includes('program') ||
    q.includes('v0')
  ) {
    const isHindi = q.includes('coding ke liye') || q.includes('likhne') || q.includes('kaun sa');
    const header = isHindi ? '**Coding ke liye Top AI Tools & Editors:**' : '**Top Verified AI Coding Tools & Editors:**';

    return {
      id: `bot-${now}`,
      sender: 'assistant',
      timestamp: now,
      text: `${header}\n\n` +
        `• [Cursor Editor](/ai-tools/cursor) — Leading AI-first fork of VS Code with Composer multi-file editing and 2-week Pro trial + slow tier.\n` +
        `• [OmniRush](/ai-tools/omnirush) — Desktop developer workspace offering direct free community access to frontier models without credit cards.\n` +
        `• [v0 by Vercel](/ai-tools/v0-vercel) — Generates production React, Tailwind CSS, and shadcn/ui components from natural language (free tier includes 200 monthly credits).\n` +
        `• [Claude 3.5 Sonnet](/ai-tools/claude) — Ranked #1 in SWE-bench coding benchmarks with live Artifacts preview.\n` +
        `• [DeepSeek-R1](/ai-tools/deepseek) — State-of-the-art algorithmic programming and debugging with transparent chain-of-thought.\n\n` +
        `Would you like recommendations for frontend UI scaffolding, backend BaaS, or local code completion?`,
      suggestions: ['Cursor vs OmniRush', 'React UI with v0', 'Self-hostable backend tools'],
      groundedTools: [
        { name: 'Cursor Editor', slug: 'cursor', type: 'ai', pricingSummary: 'Free hobby tier + 50 slow requests', websiteUrl: 'https://cursor.com' },
        { name: 'OmniRush', slug: 'omnirush', type: 'ai', pricingSummary: 'Frontier model developer environment', websiteUrl: 'https://omnirush.ai' },
        { name: 'v0 by Vercel', slug: 'v0-vercel', type: 'ai', pricingSummary: '200 monthly free generation credits', websiteUrl: 'https://v0.dev' },
      ],
    };
  }

  // 6. Open-Source Alternatives to Proprietary Software
  const matchedProp = proprietaryTools.find(
    (p) => q.includes(p.name.toLowerCase()) || q.includes(p.slug.toLowerCase())
  );

  if (matchedProp || q.includes('notion') || q.includes('firebase') || q.includes('figma') || q.includes('airtable') || q.includes('open source')) {
    const target = matchedProp || proprietaryTools.find((p) => p.slug === 'notion')!;
    const alts = toolsData.filter((t) => t.alternativesTo.includes(target.slug)).slice(0, 4);

    return {
      id: `bot-${now}`,
      sender: 'assistant',
      timestamp: now,
      text: `**Open-Source Alternatives to ${target.name}:**\n\n` +
        `If you are looking to replace ${target.name} with self-hostable, private open-source software, here are top picks:\n\n` +
        alts.map((a) => `• [${a.name}](/tools/${a.slug}) — ${a.tagline} (${a.stars.toLocaleString()} GitHub stars, ${a.license})`).join('\n') +
        `\n\nExplore full comparison on [${target.name} Alternatives](/alternatives/${target.slug}).`,
      suggestions: [`View all ${target.name} alternatives`, 'How to self-host with Docker', 'Firebase alternatives'],
      groundedTools: alts.map((a) => ({
        name: a.name,
        slug: a.slug,
        type: 'open-source',
        pricingSummary: `${a.license} (Self-Hostable)`,
        websiteUrl: a.websiteUrl,
      })),
    };
  }

  // 7. Image Generation & Art
  if (
    q.includes('image') ||
    q.includes('photo') ||
    q.includes('art') ||
    q.includes('flux') ||
    q.includes('midjourney') ||
    q.includes('stable diffusion')
  ) {
    return {
      id: `bot-${now}`,
      sender: 'assistant',
      timestamp: now,
      text: `**Top Verified AI Image Generation Platforms:**\n\n` +
        `• [FLUX.1 by Black Forest Labs](/ai-tools/flux-1) — State-of-the-art 12B transformer with open Apache 2.0 weights (Schnell), incredible typography, and photorealism.\n` +
        `• [Stable Diffusion 3.5](/ai-tools/stable-diffusion-3) — Stability AI MMDiT open-weight model family for research and commercial creators.\n` +
        `• [Meta AI](/ai-tools/meta-ai) — 100% Free instant image generation using Meta Imagine.\n` +
        `• [Recraft](/ai-tools/recraft) — Specialized vector SVG and 3D icon generation with brand color palettes (50 daily credits).\n` +
        `• [Midjourney v6.1](/ai-tools/midjourney) — Gold standard benchmark for cinematic composition (paid subscription required).\n\n` +
        `Would you like to run FLUX locally or generate images free in your browser?`,
      suggestions: ['How to run FLUX.1 locally', 'Free image generation without login', 'Recraft vector icons'],
      groundedTools: [
        { name: 'FLUX.1', slug: 'flux-1', type: 'ai', pricingSummary: '100% Free Open Weights (Apache 2.0)', websiteUrl: 'https://blackforestlabs.ai' },
        { name: 'Meta AI', slug: 'meta-ai', type: 'ai', pricingSummary: 'Free Imagine generations', websiteUrl: 'https://www.meta.ai' },
        { name: 'Recraft', slug: 'recraft', type: 'ai', pricingSummary: '50 daily generation credits', websiteUrl: 'https://www.recraft.ai' },
      ],
    };
  }

  // 8. Voice & Music
  if (
    q.includes('voice') ||
    q.includes('speech') ||
    q.includes('audio') ||
    q.includes('music') ||
    q.includes('song') ||
    q.includes('suno') ||
    q.includes('elevenlabs')
  ) {
    return {
      id: `bot-${now}`,
      sender: 'assistant',
      timestamp: now,
      text: `**Top Verified Voice & Music AI Tools:**\n\n` +
        `• [ElevenLabs](/ai-tools/elevenlabs) — Benchmark realistic text-to-speech with 10,000 free monthly characters and emotional cadence control.\n` +
        `• [Suno](/ai-tools/suno) — Full song composition (vocals, lyrics & instruments) with 50 free daily credits (~10 songs/day).\n` +
        `• [Udio](/ai-tools/udio) — High-fidelity music studio with track extensions and stem isolation.\n` +
        `• [PlayHT](/ai-tools/play-ht) — Voice cloning and conversational AI speech with 12,500 free trial characters.\n\n` +
        `Would you like to generate voiceovers for videos or original background music?`,
      suggestions: ['ElevenLabs voice cloning guide', 'Generate songs with Suno', 'Best audio tools'],
      groundedTools: [
        { name: 'ElevenLabs', slug: 'elevenlabs', type: 'ai', pricingSummary: '10,000 free monthly characters', websiteUrl: 'https://elevenlabs.io' },
        { name: 'Suno', slug: 'suno', type: 'ai', pricingSummary: '50 free daily credits (10 songs)', websiteUrl: 'https://suno.com' },
      ],
    };
  }

  // 9. Greeting / General Inquiries (English & Hindi/Hinglish)
  const isGreeting = q === 'hi' || q === 'hello' || q === 'hey' || q.includes('namaste') || q.includes('kaise ho') || q.includes('kya kar sakte');
  const greetingText = isGreeting
    ? `**Namaste! Welcome to Tech Hacks AI Assistant.** 👋\n\n` +
      `Main aapki software discovery aur free AI tools dhundhne me madad kar sakta hoon.\n\n` +
      `You can ask me anything about:\n` +
      `• **AI Video Generators** (Kling, Vidu, Hailuo, Wan 2.1, Pika)\n` +
      `• **Chatbot & LLM Alternatives** (Mistral, Qwen, DeepSeek, Claude, ChatGPT)\n` +
      `• **Frontier Models & Platforms** (Claude Fable 5.1 status, GPT-6 Astra, OmniRush, KIE AI)\n` +
      `• **Open-Source Replacements** for Notion, Firebase, Figma, Airtable\n` +
      `• **AI Coding Tools** (Cursor, v0, OmniRush)\n\n` +
      `Aapko kis category me tool chahiye? Click a suggestion below or type your question!`
    : `**Tech Hacks AI Discovery Assistant:**\n\n` +
      `I couldn't find a direct match for "${userQuery}", but here is how I can help:\n\n` +
      `• Search our directory of **40+ verified AI platforms** across video, image, code, and chat.\n` +
      `• Explore **100% Free & Open-Source** software replacements for popular proprietary services.\n` +
      `• Guide you through our interactive [Help Me Pick](/pick) recommendation wizard.\n\n` +
      `Try asking: *"Best free AI video generators"*, *"Claude 3.5 Sonnet alternatives"*, or *"Coding ke liye best free tool"*.`;

  return {
    id: `bot-${now}`,
    sender: 'assistant',
    timestamp: now,
    text: greetingText,
    suggestions: [
      'Best free AI video generators',
      'Claude 3.5 Sonnet alternatives',
      'Does Pika have a free plan?',
      'Open-source Notion replacement',
    ],
  };
}
