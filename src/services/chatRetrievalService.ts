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

  // 1. Jio Gemini Offer / Reliance Jio Bundle Query
  if (
    q.includes('jio') ||
    q.includes('jio gemini') ||
    q.includes('jio google') ||
    q.includes('jio 5g') ||
    q.includes('jio offer')
  ) {
    const isHindi = q.includes('kaise') || q.includes('kare') || q.includes('milega') || q.includes('kya hai');
    const intro = isHindi
      ? `**Reliance Jio + Google One AI Premium (Gemini Advanced) Offer:**\n\nJio ke True 5G users ko takreeban 18 months tak Google One AI Premium (Gemini Advanced) complimentary milta hai.`
      : `**Reliance Jio + Google One AI Premium (Gemini Advanced) Offer Details:**\n\nEligible Reliance Jio 5G users in India can receive up to 18 months of complimentary Google One AI Premium (worth ₹1,950/month).`;

    return {
      id: `bot-${now}`,
      sender: 'assistant',
      timestamp: now,
      text: `${intro}\n\n` +
        `**What is included:**\n` +
        `• **Gemini Advanced:** Access to Google's frontier 1.5 Pro multimodal reasoning model\n` +
        `• **2TB Cloud Storage:** Shared across Google Drive, Gmail, and Google Photos\n` +
        `• **Google Workspace AI:** Gemini integrated into Docs, Sheets, and Gmail\n\n` +
        `**Eligibility Criteria:**\n` +
        `• Active Reliance Jio prepaid or postpaid mobile subscription in India on eligible True 5G unlimited plans (e.g., ₹349+ 28-day plan or quarterly/annual tiers) with a 5G compatible device.\n\n` +
        `**Step-by-Step Claim Process:**\n` +
        `1. Ensure an active recharge of ₹349 or higher on your Jio number.\n` +
        `2. Open the **MyJio App** on your smartphone connected to the Jio network.\n` +
        `3. Look for the **Google Gemini / Google One AI Offer** banner on the home screen or under Coupons/Rewards.\n` +
        `4. Link your primary Google Account and complete the Google Play zero-dollar verification to activate.\n\n` +
        `**Renewal Terms & Caution:**\n` +
        `• Complimentary access is strictly linked to continuous qualifying Jio 5G recharges. If your recharge lapses, access suspends. After the offer period ends, it renews at standard Google One monthly rates unless cancelled.\n\n` +
        `👉 View full details and claim links on our [Jio Google Gemini Deal Page](/offers/jio-google-gemini-offer).`,
      suggestions: [
        'How to verify student status for Gemini',
        'GitHub Student Developer Pack',
        'Explore All AI Deals',
      ],
      groundedTools: [
        { name: 'Google Gemini', slug: 'gemini', type: 'ai', pricingSummary: '18 Months Free via Jio True 5G', websiteUrl: 'https://gemini.google.com' },
      ],
    };
  }

  // 2. Student AI Plans & Educational Discounts
  if (
    q.includes('student') ||
    q.includes('college') ||
    q.includes('university') ||
    q.includes('sheerid') ||
    q.includes('campus') ||
    q.includes('education discount')
  ) {
    return {
      id: `bot-${now}`,
      sender: 'assistant',
      timestamp: now,
      text: `**Verified Student AI Perks & Developer Packages:**\n\n` +
        `If you are an enrolled college or university student with an academic email (.edu or campus domain), you can access significant verified AI discounts and free subscriptions:\n\n` +
        `• [GitHub Student Developer Pack](/offers/github-student-pack-copilot) — **100% Free GitHub Copilot Individual**, free GitHub Pro, JetBrains suite, and $100+ cloud credits.\n` +
        `• [Google Gemini Student Plan (India)](/offers/google-gemini-student-offer-india) — Subsidized and complimentary access to Gemini Advanced & 2TB Drive storage via SheerID verification.\n` +
        `• [Perplexity Education Pro](/offers/perplexity-education-pro) — Discounted Pro Search with multi-model switching (Claude 3.5 Sonnet, GPT-4o) for verified students and faculty.\n` +
        `• [JetBrains Student Pack](/offers/jetbrains-student-pack) — Free professional IDE suite (IntelliJ, PyCharm, WebStorm) for active students.\n` +
        `• [Notion for Education](/offers/notion-for-education) — Free Notion Plus tier with unlimited file uploads for students and teachers.\n\n` +
        `👉 Explore all verified student packages and claim links on our [AI Deals & Student Benefits Directory](/offers).`,
      suggestions: [
        'GitHub Copilot Student activation',
        'Perplexity Education Pro requirements',
        'Reliance Jio Gemini 18mo offer',
      ],
      groundedTools: [
        { name: 'GitHub Copilot', slug: 'copilot', type: 'ai', pricingSummary: '100% Free for Students', websiteUrl: 'https://education.github.com/pack' },
        { name: 'Perplexity', slug: 'perplexity', type: 'ai', pricingSummary: 'Academic Discount available', websiteUrl: 'https://www.perplexity.ai/pro' },
      ],
    };
  }

  // 3. Coupons, Promo Codes & Discounts
  if (
    q.includes('coupon') ||
    q.includes('promo code') ||
    q.includes('discount code') ||
    q.includes('voucher') ||
    q.includes('promo')
  ) {
    return {
      id: `bot-${now}`,
      sender: 'assistant',
      timestamp: now,
      text: `**Verified AI Deals & Partner Benefits (No Fake Codes):**\n\n` +
        `Tech Hacks AI independently verifies official institutional discounts, carrier partnerships, and cloud credit programs. We **never** list expired or fabricated coupon codes.\n\n` +
        `**Top Active Verified Offers Today:**\n` +
        `• [Reliance Jio + Google Gemini](/offers/jio-google-gemini-offer) — 18 Months free Google One AI Premium (Gemini Advanced + 2TB storage) for Jio 5G users.\n` +
        `• [GitHub Student Developer Pack](/offers/github-student-pack-copilot) — Free GitHub Copilot Individual for students.\n` +
        `• [Google AI Student Plan India](/offers/google-gemini-student-offer-india) — Gemini Advanced student discount.\n` +
        `• [Microsoft for Startups Founders Hub](/offers/microsoft-founders-hub-credits) — Up to $150k in Azure cloud & OpenAI credits for early-stage builders.\n` +
        `• [AWS Activate](/offers/aws-activate-ai-startups) — $1,000+ in AWS Bedrock & compute credits for bootstrapped startups.\n\n` +
        `👉 Browse all terms and claim instructions on our [AI Deals Directory](/offers).`,
      suggestions: [
        'Jio Gemini 18-month deal details',
        'Free GitHub Copilot for students',
        'Startup cloud credits',
      ],
    };
  }

  // 4. Claude Code Alternatives
  if (
    q.includes('claude code') ||
    (q.includes('claude') && (q.includes('cli') || q.includes('terminal') || q.includes('agent'))) ||
    q.includes('aider') ||
    q.includes('cline') ||
    q.includes('roocode') ||
    q.includes('opencode')
  ) {
    return {
      id: `bot-${now}`,
      sender: 'assistant',
      timestamp: now,
      text: `**Top Open-Source Alternatives to Claude Code (Agentic CLI & Coding):**\n\n` +
        `Claude Code is Anthropic's agentic command-line assistant. If you want open-source, multi-model, or local alternatives with zero vendor lock-in, here are the top tools:\n\n` +
        `• [Aider](/tools/aider) — The leading AI pair programming CLI. Edits files in git repos, creates automated commits, and supports Claude 3.5 Sonnet, DeepSeek-R1, and local Ollama models.\n` +
        `• [Cline](/tools/cline) — Autonomous coding agent for VS Code. Can create/edit files, run terminal commands, execute browser tests with Playwright, and inspect errors.\n` +
        `• [Roo Code](/tools/roocode) — Autonomous coding extension with custom modes (Architect, Code, Ask) and multi-model API support.\n` +
        `• [OpenCode](/tools/opencode) — Modern open-source terminal coding assistant built with Go/Node.\n\n` +
        `👉 View the full breakdown and comparison on [Claude Code Alternatives](/alternatives/claude-code).`,
      suggestions: [
        'How to setup Aider with DeepSeek-R1',
        'Cline vs Roo Code',
        'Cursor Editor alternatives',
      ],
      groundedTools: [
        { name: 'Aider', slug: 'aider', type: 'open-source', pricingSummary: 'Apache 2.0 (Terminal CLI)', websiteUrl: 'https://aider.chat' },
        { name: 'Cline', slug: 'cline', type: 'open-source', pricingSummary: 'Apache 2.0 (VS Code Agent)', websiteUrl: 'https://cline.bot' },
        { name: 'Roo Code', slug: 'roocode', type: 'open-source', pricingSummary: 'Apache 2.0 (Multi-mode Agent)', websiteUrl: 'https://github.com/RooVetGit/Roo-Code' },
        { name: 'OpenCode', slug: 'opencode', type: 'open-source', pricingSummary: 'MIT (Terminal Assistant)', websiteUrl: 'https://github.com/opencode-ai/opencode' },
      ],
    };
  }

  // 5. Perplexity Alternatives
  if (
    q.includes('perplexity') ||
    q.includes('perplexica') ||
    q.includes('khoj') ||
    q.includes('searxng') ||
    q.includes('ai search')
  ) {
    return {
      id: `bot-${now}`,
      sender: 'assistant',
      timestamp: now,
      text: `**Top Open-Source Alternatives to Perplexity AI:**\n\n` +
        `If you love Perplexity's conversational web-grounded answer format but want self-hostable, privacy-first software with your own local LLMs, here are the top open-source replacements:\n\n` +
        `• [Perplexica](/tools/perplexica) — Direct open-source replica of Perplexity. Uses SearXNG for web scraping and connects to local Ollama models or cloud APIs.\n` +
        `• [Khoj](/tools/khoj) — Open-source AI second brain that searches both the public web and your personal notes/PDFs with local LLM support.\n` +
        `• [SearXNG](/tools/searxng) — Privacy-respecting metasearch engine aggregating 70+ search engines with zero logging or profile tracking.\n\n` +
        `👉 Explore the detailed comparison on [Perplexity Alternatives](/alternatives/perplexity).`,
      suggestions: [
        'How to install Perplexica with Docker',
        'Khoj self-hosting guide',
        'Perplexity Education Pro discount',
      ],
      groundedTools: [
        { name: 'Perplexica', slug: 'perplexica', type: 'open-source', pricingSummary: 'MIT (Self-Hostable AI Search)', websiteUrl: 'https://github.com/ItzCrazyBlaze/Perplexica' },
        { name: 'Khoj', slug: 'khoj', type: 'open-source', pricingSummary: 'GPL-3.0 (Personal AI & Search)', websiteUrl: 'https://khoj.dev' },
        { name: 'SearXNG', slug: 'searxng', type: 'open-source', pricingSummary: 'AGPL-3.0 (Metasearch Engine)', websiteUrl: 'https://searx.space' },
      ],
    };
  }

  // 6. Pika Specific Query (Pricing & Recurring Free Check)
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

  // 7. Frontier Models: GPT-6 Astra, Claude Fable 5.1 & OmniRush / KIE AI
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
        `• **OmniRush:** [OmniRush](/ai-tools/omnirush) is classified as **100% Free** (not freemium). It is a desktop/CLI developer workspace offering direct free community model routing without upfront credit cards, plus optional BYOK (Bring Your Own Key) for developers connecting private keys.\n\n` +
        `Would you like to compare Claude 3.5 Sonnet with DeepSeek-R1 or explore free frontier coding tools?`,
      suggestions: ['Claude 3.5 Sonnet vs DeepSeek-R1', 'Best free coding tools', 'Explore KIE AI'],
      groundedTools: [
        { name: 'KIE AI', slug: 'kie-ai', type: 'ai', pricingSummary: 'Model evaluation playground with starter trial credits', websiteUrl: 'https://kie.ai' },
        { name: 'OmniRush', slug: 'omnirush', type: 'ai', pricingSummary: '100% Free Desktop/CLI (Community + BYOK)', websiteUrl: 'https://omnirush.ai' },
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
