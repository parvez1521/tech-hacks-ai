import { aiToolsData } from '../data/aiToolsData.ts';
import { toolsData } from '../data/seedData.ts';
import { getActiveOffers } from '../data/offersData.ts';
import { proprietaryTools } from '../data/alternatives.ts';
import { getAllCommunityTools } from './aiCatalogService.ts';
import type { AiTool, Tool } from '../types/index.ts';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  suggestions?: string[];
  groundedTools?: { name: string; slug: string; type: 'ai' | 'open-source' | 'community'; pricingSummary: string; websiteUrl: string }[];
}

const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim();
const isHindi = (q: string) => /\b(kya|kaise|chahiye|batao|koi|hai|mujhe|ke liye|dikhao)\b/.test(q);

/** Catalogue-only fallback. It never invents current pricing or claims to browse the web. */
export function generateGroundedResponse(userQuery: string): ChatMessage {
  const q = normalize(userQuery);
  const now = Date.now();
  const message = (text: string, groundedTools: ChatMessage['groundedTools'] = [], suggestions = ['Find free AI tools', 'Show community tools', 'Browse current offers']): ChatMessage => ({
    id: `catalog-${now}`, sender: 'assistant', timestamp: now, text, groundedTools, suggestions,
  });
  if (!q) return message('Please enter a question about tools, community submissions, or offers.');

  if (/\b(compare|versus|\bvs\b)\b/.test(q) && /\b(two|tools|them)\b/.test(q)) {
    return message('Choose two catalogue entries in the [side-by-side comparison tool](/compare). I can also find candidates by task or name before you compare them.', [], ['Find coding tools', 'Find writing tools']);
  }
  if (/\b(help me choose|help me pick|recommend|choose)\b/.test(q) && /\b(tool|coding|video|image|writing)\b/.test(q)) {
    return message('I can find matching tools from the published catalogue. For a guided recommendation, use [Help Me Pick](/pick).', [], ['Find coding tools', 'Find free tools']);
  }

  if (/\b(offer|offers|deal|deals|student|students|college|university|credit|credits|discount|coupon|promo|voucher)\b/.test(q) || /\bछात्र\b/.test(q)) {
    const words = q.split(' ').filter((word) => word.length > 3);
    const offers = getActiveOffers().map((offer) => {
      const searchable = normalize(`${offer.title} ${offer.provider} ${offer.tags.join(' ')} ${offer.eligibility} ${offer.benefitSummary}`);
      return { offer, score: words.reduce((score, word) => score + (searchable.includes(word) ? 1 : 0), 0) };
    }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 10).map(({ offer }) => offer);
    const matched = offers.length ? offers : getActiveOffers().slice(0, 4);
    const lines = matched.map((offer) => `• [${offer.title}](/offers/${offer.slug}) — ${offer.benefitSummary} (${offer.offerType === 'free-subscription' ? 'free plan' : offer.offerType.replaceAll('-', ' ')}). Eligibility: ${offer.eligibility}`);
    const couponNote = /coupon|promo code|voucher/.test(q) ? '\n\nNo fake codes: I only show a coupon code when it is explicitly recorded in an offer’s details.' : '';
    return message(`Published offers in the catalogue:\n\n${lines.join('\n')}\n\nBrowse the full [offers directory](/offers). These are catalogue records, not live-checked terms. Open the provider terms on each offer page before claiming.${couponNote}`, [], ['Show student offers', 'Find offers in India', 'Browse all offers']);
  }
  if (/\bcommunity\b|\bsubmitted\b/.test(q)) {
    const community = getAllCommunityTools().filter((tool) => normalize(`${tool.name} ${tool.tagline} ${tool.description} ${tool.tags.join(' ')}`).split(' ').some((word) => word.length > 3 && q.includes(word))).slice(0, 5);
    if (!community.length) return message('There are no published community tools in the catalogue right now. Submissions require editorial review before they appear.', [], ['Submit a community tool', 'Find AI tools']);
    return message('Published community catalogue matches:', community.map((t) => ({ name: t.name, slug: t.slug, type: 'community', pricingSummary: t.pricingType, websiteUrl: t.websiteUrl })), ['Browse community tools']);
  }

  const alternativeTarget = proprietaryTools.find((target) => q.includes(normalize(target.name)) || q.includes(normalize(target.slug)));
  if (alternativeTarget && (/alternative|replace|replacement|open source|open-source|vs|versus/.test(q))) {
    const alternatives = toolsData.filter((tool) => tool.alternativesTo.includes(alternativeTarget.slug)).slice(0, 5);
    if (alternatives.length) {
      const records = alternatives.map((tool) => ({ name: tool.name, slug: tool.slug, type: 'open-source' as const, pricingSummary: `${tool.license} · open source`, websiteUrl: tool.websiteUrl }));
      return message(`Open-source catalogue alternatives to ${alternativeTarget.name}:\n\n${records.map((tool) => `• [${tool.name}](/tools/${tool.slug}) — ${tool.pricingSummary}`).join('\n')}\n\nSee the [${alternativeTarget.name} alternatives page](/alternatives/${alternativeTarget.slug}) or compare tools side by side with the [comparison tool](/compare).`, records, ['Compare these alternatives', 'Search open-source tools']);
    }
  }

  const all: Array<{ item: AiTool | Tool; type: 'ai' | 'open-source'; text: string }> = [
    ...aiToolsData.map((item) => ({ item, type: 'ai' as const, text: normalize(`${item.name} ${item.tagline} ${item.description} ${item.category} ${item.tags.join(' ')} ${item.features.join(' ')}`) })),
    ...toolsData.map((item) => ({ item, type: 'open-source' as const, text: normalize(`${item.name} ${item.tagline} ${item.description} ${item.categories.join(' ')} ${item.tags.join(' ')} ${item.techStack.join(' ')}`) })),
  ];
  const tokens = q.split(' ').filter((word) => word.length > 2 && !['the','and','for','with','show','find','best','tool','tools','please','kya','kaise','mujhe','chahiye','hai'].includes(word));
  if (/\b(video|pika|वीडियो)\b/.test(q) && /\b(free|recurring|plan|credits|generator)\b/.test(q)) {
    const videoMatches = aiToolsData.filter((item) => item.category === 'video' && (item.freeAccessType === 'recurring-free' || item.freeAccessType === 'open-source-local' || normalize(item.name).includes('pika'))).slice(0, 5);
    if (videoMatches.length) {
      const records = videoMatches.map((item) => ({ name: item.name, slug: item.slug, type: 'ai' as const, pricingSummary: item.pricingType, websiteUrl: item.websiteUrl }));
      return message(`Video tool records from the published catalogue:\n\n${videoMatches.map((item) => `• [${item.name}](/ai-tools/${item.slug}) — ${item.freeTierSummary} ${item.freeTierLimits}`.trim()).join('\n')}\n\nThese catalogue notes are not live checked. Confirm current access and pricing with each provider.`, records, ['Find video tools with recurring free access', 'Browse AI tools']);
    }
  }
  const ranked = all.map((record) => ({ ...record, score: tokens.reduce((sum, token) => sum + (record.text.includes(token) ? (normalize(record.item.name).includes(token) ? 3 : 1) : 0), 0) })).filter((x) => x.score > 0).sort((a,b) => b.score - a.score).slice(0, 5);
  if (!ranked.length) {
    if (/^(hi|hello|hey|namaste|नमस्ते)$/.test(q)) return message('Namaste! Ask me to find a tool by task, category, or name. I can search the published catalogue in English or Hindi/Hinglish.', [], ['Find a coding tool', 'Show free tools', 'Browse offers']);
    return message(`I couldn’t find a relevant record for “${userQuery}” in the published catalogue. I don’t have live web search in this fallback, so I can’t verify current pricing or availability. Try a tool name or task such as coding, video, image, or writing.`);
  }
  const records = ranked.map(({ item, type }) => ({ name: item.name, slug: item.slug, type, pricingSummary: type === 'ai' ? ((item as AiTool).pricingType || 'See tool details for pricing') : `${(item as Tool).license} · open source`, websiteUrl: item.websiteUrl }));
  const compare = /\b(compare|versus|\bvs\b|difference|better)\b/.test(q);
  const detailBySlug = new Map(ranked.map(({ item, type }) => {
    if (type !== 'ai') return [item.slug, item.tagline];
    const aiTool = item as AiTool;
    const matchedModel = aiTool.supportedModels?.some((model) => tokens.some((token) => normalize(model).includes(token)));
    const modelNote = matchedModel ? ` ${aiTool.longDescription || ''}` : '';
    return [item.slug, `${aiTool.freeTierSummary} ${aiTool.freeTierLimits || ''} ${(aiTool.supportedModels || []).join(', ')} ${item.description}${modelNote}`.trim()];
  }));
  return message(`${isHindi(q) ? 'Catalogue mein mile relevant matches:' : compare ? 'Catalogue comparison candidates:' : 'Relevant published catalogue matches:'}\n\n${records.map((item) => `• [${item.name}](${item.type === 'open-source' ? `/tools/${item.slug}` : `/ai-tools/${item.slug}`}) — ${item.pricingSummary}. ${detailBySlug.get(item.slug) || ''}`).join('\n')}\n\nI searched the published catalogue only. Check each provider’s site for current pricing and availability.${compare ? '\n\nUse the [side-by-side comparison tool](/compare) for a direct feature comparison.' : ''}`, records, ['Open side-by-side comparison', 'Find free alternatives', 'Browse the catalogue']);
}
