import { aiToolsData } from '../data/aiToolsData.ts';
import { toolsData } from '../data/seedData.ts';
import { getActiveOffers } from '../data/offersData.ts';
import { proprietaryTools } from '../data/alternatives.ts';
import type { AiTool, Tool } from '../types/index.ts';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  suggestions?: string[];
  groundedTools?: { name: string; slug: string; type: 'ai' | 'open-source'; pricingSummary: string; websiteUrl: string }[];
}

const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim();
const isHindi = (q: string) => /\b(kya|kaise|chahiye|batao|koi|hai|mujhe|ke liye|dikhao)\b/.test(q);
const containsAny = (value: string, words: string[]) => words.some((word) => value.includes(word));

type Candidate = { item: AiTool | Tool; type: 'ai' | 'open-source'; searchable: string; score: number };

/** Returns only catalogue entries eligible for the requested category and constraints. */
export function getEligibleChatTools(userQuery: string, limit = 5) {
  const q = normalize(userQuery);
  const video = containsAny(q, ['video', 'text to video', 'text-to-video', 'वीडियो']);
  const image = containsAny(q, ['image', 'images', 'picture', 'चित्र']);
  const voice = containsAny(q, ['voice', 'audio', 'speech', 'cloning', 'clone', 'आवाज']);
  const coding = containsAny(q, ['coding', 'code', 'developer', 'programming', 'claude code', 'coding assistant']);
  const automation = containsAny(q, ['automation', 'workflow', 'workflows', 'agent']);
  const free = containsAny(q, ['free', 'without paying', 'no cost', 'gratis', 'muft']);
  const openSource = containsAny(q, ['open source', 'open-source', 'self hosted', 'self-hosted']);
  const aiRequested = containsAny(q, ['ai', 'artificial intelligence', 'machine learning', 'generative']);
  const editing = containsAny(q, ['editing', 'edit', 'repurpose', 'clip', 'clipping']);
  const textToVideo = containsAny(q, ['text to video', 'text-to-video', 'generate videos from text', 'videos from text']);
  const voiceClone = containsAny(q, ['voice cloning', 'voice clone', 'clone voice', 'cloning']);
  const requestedAlternative = proprietaryTools.find((target) => q.includes(normalize(target.name)) || q.includes(normalize(target.slug)));

  const all: Candidate[] = [
    ...aiToolsData.map((item) => ({ item, type: 'ai' as const, searchable: normalize(`${item.name} ${item.slug} ${item.tagline} ${item.description} ${item.longDescription || ''} ${item.category} ${item.tags.join(' ')} ${item.features.join(' ')} ${(item.generationTasks || []).join(' ')} ${(item.useCases || []).join(' ')} ${(item.supportedModels || []).join(' ')}`), score: 0 })),
    ...toolsData.map((item) => ({ item, type: 'open-source' as const, searchable: normalize(`${item.name} ${item.slug} ${item.tagline} ${item.description} ${item.categories.join(' ')} ${item.tags.join(' ')} ${item.techStack.join(' ')}`), score: 0 })),
  ];

  const tokens = q.split(' ').filter((word) => word.length > 2 && !['the','and','for','with','show','find','best','tool','tools','please','suggest','which','can','me','from'].includes(word));
  const filtered = all.filter(({ item, type, searchable }) => {
    if (aiRequested && type === 'open-source' && !openSource && !(item as Tool).isAiNative) return false;
    if (video && (type !== 'ai' || (item as AiTool).category !== 'video')) return false;
    if (image && !video && (type !== 'ai' || (item as AiTool).category !== 'image')) return false;
    if (voice && !video && !image && (type !== 'ai' || (item as AiTool).category !== 'voice')) return false;
    if (coding && !video && !image && !voice && !automation) {
      const ai = item as AiTool;
      const hasCodingCapability = ai.generationTasks?.includes('coding-assistant') || ai.outputModalities?.includes('code') || containsAny(searchable, ['coding', 'code editor', 'code assistant', 'programming', 'developer tool', 'ide', 'terminal agent', 'autocomplete', 'pair programming']);
      if (type !== 'ai' && !requestedAlternative) return false;
      if (type === 'ai' && !hasCodingCapability) return false;
    }
    if (automation && !video && !image && !voice && !coding && (type !== 'ai' || (item as AiTool).category !== 'automation')) return false;

    if (textToVideo && !(item as AiTool).generationTasks?.includes('text-to-video')) return false;
    if (editing && video && !containsAny(searchable, ['edit', 'editing', 'repurpose', 'clip', 'clipping', 'video-to-video'])) return false;
    if (voiceClone && !containsAny(searchable, ['voice cloning', 'voice clone', 'clone voice', 'voice-cloning', 'speech cloning'])) return false;
    if (requestedAlternative && containsAny(q, ['alternative', 'replace', 'replacement']) && !(item as AiTool | Tool).alternativesTo?.includes(requestedAlternative.slug)) return false;
    if (free) {
      if (type === 'ai' && !['free', 'freemium', 'free-credits'].includes((item as AiTool).pricingType)) return false;
      if (type === 'open-source' && (item as Tool).license.toLowerCase() === 'proprietary') return false;
    }
    if (openSource) {
      if (type === 'ai') {
        const ai = item as AiTool;
        if (!ai.openSourceRepoUrl || !ai.isSelfHostable || !ai.licenseSummary) return false;
      } else if (!(item as Tool).repositoryUrl || !(item as Tool).isVerified) return false;
    }
    return tokens.length === 0 || tokens.some((token) => searchable.includes(token)) || video || image || voice || coding || automation || openSource || free || Boolean(requestedAlternative);
  });

  for (const candidate of filtered) {
    const { item, searchable } = candidate;
    candidate.score = tokens.reduce((score, token) => score + (searchable.includes(token) ? (normalize(item.name).includes(token) ? 4 : 1) : 0), 0);
    if (video && (item as AiTool).category === 'video') candidate.score += 20;
    if (image && (item as AiTool).category === 'image') candidate.score += 20;
    if (coding && ((item as AiTool).category === 'coding' || (item as AiTool).generationTasks?.includes('coding-assistant'))) candidate.score += 20;
    if (textToVideo && (item as AiTool).generationTasks?.includes('text-to-video')) candidate.score += 30;
    if (free && candidate.type === 'ai' && (item as AiTool).freeAccessType === 'recurring-free') candidate.score += 15;
    if (video && candidate.type === 'ai') {
      const ai = item as AiTool;
      if (ai.generationTasks?.some((task) => task === 'text-to-video' || task === 'image-to-video')) candidate.score += 5;
      if (typeof ai.rating === 'number') candidate.score += ai.rating * 3;
    }
  }
  return filtered.sort((a, b) => b.score - a.score || a.item.slug.localeCompare(b.item.slug)).slice(0, limit).map(({ item, type }) => ({ item, type }));
}

/** Reject live prose that names a catalogue tool outside the same eligible set as its cards. */
export function validateGroundedText(text: string, userQuery: string, allowedSlugs = getEligibleChatTools(userQuery).map(({ item }) => item.slug)): boolean {
  const eligible = new Set(allowedSlugs);
  const normalizedText = normalize(text);
  const allTools = [...aiToolsData, ...toolsData, ...proprietaryTools];
  const mentioned = allTools.filter((item) => normalizedText.includes(normalize(item.name)) || normalizedText.includes(normalize(item.slug)));
  return mentioned.length > 0 && mentioned.every((item) => eligible.has(item.slug));
}

/** Catalogue-only fallback. It never invents current pricing or claims to browse the web. */
export function generateGroundedResponse(userQuery: string): ChatMessage {
  const q = normalize(userQuery);
  const now = Date.now();
  const message = (text: string, groundedTools: ChatMessage['groundedTools'] = [], suggestions = ['Find free AI tools', 'Find open-source tools', 'Browse current offers']): ChatMessage => ({ id: `catalog-${now}`, sender: 'assistant', timestamp: now, text, groundedTools, suggestions });
  if (!q) return message('Please enter a question about AI tools, open-source software, or current offers.');

  if (containsAny(q, ['compare', 'versus', ' vs ']) && containsAny(q, ['two', 'tools', 'them'])) {
    return message('Choose two catalogue entries in the [side-by-side comparison tool](/compare). I can also find candidates by task or name before you compare them.', [], ['Find coding tools', 'Find writing tools']);
  }
  if (containsAny(q, ['help me choose', 'help me pick', 'recommend', 'choose']) && containsAny(q, ['tool', 'coding', 'video', 'image', 'writing'])) {
    return message('I can find matching tools from the published catalogue. For a guided recommendation, use [Help Me Pick](/pick).', [], ['Find coding tools', 'Find free tools']);
  }

  if (containsAny(q, ['offer', 'offers', 'deal', 'deals', 'student', 'college', 'university', 'credit', 'discount', 'coupon', 'promo', 'voucher'])) {
    const words = q.split(' ').filter((word) => word.length > 3);
    const offers = getActiveOffers().map((offer) => ({ offer, score: words.reduce((score, word) => score + (normalize(`${offer.title} ${offer.provider} ${offer.tags.join(' ')} ${offer.eligibility} ${offer.benefitSummary}`).includes(word) ? 1 : 0), 0) })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 10).map(({ offer }) => offer);
    const matched = offers.length ? offers : getActiveOffers().slice(0, 4);
    const couponNote = containsAny(q, ['coupon', 'promo code', 'voucher']) ? '\n\nNo fake codes: I only show a coupon code when it is explicitly recorded in an offer’s details.' : '';
    return message(`Published offers in the catalogue:\n\n${matched.map((offer) => `• [${offer.title}](/offers/${offer.slug}) — ${offer.benefitSummary} (${offer.offerType === 'free-subscription' ? 'free plan' : offer.offerType.replaceAll('-', ' ')}). Eligibility: ${offer.eligibility}`).join('\n')}\n\nBrowse the full [offers directory](/offers). These are catalogue records, not live-checked terms.${couponNote}`, [], ['Show student offers', 'Find offers in India', 'Browse all offers']);
  }

  const requestedModels = aiToolsData.flatMap((tool) => (tool.supportedModels || []).map((model) => ({ tool, model: model.replace(/\s*\([^)]*\)/g, '') }))).filter(({ model }) => q.includes(normalize(model)));
  if (requestedModels.length) {
    const { tool } = requestedModels[0];
    const record = { name: tool.name, slug: tool.slug, type: 'ai' as const, pricingSummary: tool.pricingType, websiteUrl: tool.websiteUrl };
    const modelNames = requestedModels.map(({ model }) => model).join(' and ');
    const status = tool.longDescription || `${modelNames} are listed as evaluation/preview models, not released public access.`;
    return message(`${modelNames} are listed on [${tool.name}](/ai-tools/${tool.slug}). Evaluation and preview status: ${status} I searched the published catalogue only.`, [record]);
  }

  const requestedAiTool = aiToolsData.find((tool) => q.includes(normalize(tool.name)) || q.includes(normalize(tool.slug)));
  if (requestedAiTool && (containsAny(q, ['pricing', 'price', 'free', 'freemium', 'plan', 'cost', 'recurring']) || requestedAiTool.slug === 'omnirush')) {
    const record = { name: requestedAiTool.name, slug: requestedAiTool.slug, type: 'ai' as const, pricingSummary: requestedAiTool.pricingType, websiteUrl: requestedAiTool.websiteUrl };
    const extra = requestedAiTool.slug === 'pika'
      ? ` Pika does not have a recurring monthly free plan; the catalogue lists starter trial credits. Free recurring video alternatives include ${aiToolsData.filter((tool) => tool.category === 'video' && tool.freeAccessType === 'recurring-free').slice(0, 4).map((tool) => tool.name).join(', ')}.`
      : requestedAiTool.slug === 'omnirush'
        ? ' OmniRush is 100% Free as a desktop and CLI platform with community model routing.'
        : '';
    const records = [record];
    if (requestedAiTool.slug === 'pika') {
      records.push(...aiToolsData.filter((tool) => tool.category === 'video' && tool.freeAccessType === 'recurring-free').slice(0, 4).map((tool) => ({ name: tool.name, slug: tool.slug, type: 'ai' as const, pricingSummary: tool.pricingType, websiteUrl: tool.websiteUrl })));
    }
    return message(`[${requestedAiTool.name}](/ai-tools/${requestedAiTool.slug}): ${requestedAiTool.freeTierSummary} ${requestedAiTool.freeTierLimits}.${extra} I searched the published catalogue only.`, records);
  }

  const alternativeTarget = proprietaryTools.find((target) => q.includes(normalize(target.name)) || q.includes(normalize(target.slug)));
  if (alternativeTarget && containsAny(q, ['alternative', 'replace', 'replacement', 'open source', 'open-source'])) {
    const alternatives = toolsData.filter((tool) => tool.alternativesTo.includes(alternativeTarget.slug)).slice(0, 5);
    const records = alternatives.map((tool) => ({ name: tool.name, slug: tool.slug, type: 'open-source' as const, pricingSummary: `${tool.license} · open source`, websiteUrl: tool.websiteUrl }));
    if (records.length) return message(`Open-source catalogue alternatives to ${alternativeTarget.name}:\n\n${records.map((tool) => `• [${tool.name}](/tools/${tool.slug}) — ${tool.pricingSummary}`).join('\n')}\n\nSee the [${alternativeTarget.name} alternatives page](/alternatives/${alternativeTarget.slug}).`, records, ['Compare these alternatives', 'Search open-source tools']);
  }

  const results = getEligibleChatTools(userQuery);
  const records = results.map(({ item, type }) => ({ name: item.name, slug: item.slug, type, pricingSummary: type === 'ai' ? ((item as AiTool).pricingType || 'See tool details for pricing') : `${(item as Tool).license} · open source`, websiteUrl: item.websiteUrl }));
  if (!records.length) return message(`I couldn’t find a verified match for “${userQuery}” in the published catalogue. Try a broader task or category.`);
  const lines = results.map(({ item, type }) => {
    const path = type === 'open-source' ? `/tools/${item.slug}` : `/ai-tools/${item.slug}`;
    const summary = type === 'ai' ? `${(item as AiTool).freeTierSummary} ${(item as AiTool).freeTierLimits || ''}` : `${(item as Tool).license} · ${item.tagline}`;
    return `• [${item.name}](${path}) — ${summary}`;
  });
  return message(`${isHindi(q) ? 'Catalogue mein mile relevant matches:' : 'Relevant published catalogue matches:'}\n\n${lines.join('\n')}\n\nI searched the published catalogue only. Check each provider’s site for current pricing and availability.`, records, ['Open side-by-side comparison', 'Find free alternatives', 'Browse the catalogue']);
}
