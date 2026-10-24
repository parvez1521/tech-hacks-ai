// Production serverless handler for /api/chat
import { checkRateLimit } from '../server/submissionsStore.js';
import { generateGroundedResponse, validateGroundedText } from '../src/services/chatRetrievalService.ts';

function clientIp(req) {
  const forwarded = req?.headers?.['x-vercel-forwarded-for'] || req?.headers?.['x-forwarded-for'] || req?.socket?.remoteAddress || 'unknown';
  return String(forwarded).split(',')[0].trim().slice(0, 128) || 'unknown';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // The chat endpoint can proxy paid provider requests. Apply the same
  // per-instance abuse limit used by public submissions before calling it.
  if (!checkRateLimit(`chat:${clientIp(req)}`)) {
    res.setHeader('Retry-After', '600');
    return res.status(429).json({ error: 'Too many chat requests. Please try again in 10 minutes.' });
  }

  const body = typeof req.body === 'string' ? safeJsonParse(req.body) : req.body;
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!message) return res.status(400).json({ error: 'Enter a message to continue.' });
  if (message.length > 8000) return res.status(413).json({ error: 'Message is too long. Keep it under 8,000 characters.' });
  const groqKey = process.env.GROQ_API_KEY;
  const grounded = generateGroundedResponse(message);
  const candidates = grounded.groundedTools || [];

  if (groqKey) {
    let timeout;
    try {
      const controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), 20000);
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [
            {
              role: 'system',
              content: `You are the SwitchRoute catalogue assistant. Recommend only entries from this eligible catalogue list. Do not invent features, pricing, access, licenses, or integrations. If the list is empty, say no verified catalogue match was found. Support English and Hindi. Eligible catalogue entries: ${JSON.stringify(candidates)}`,
            },
            ...normalizeHistory(body?.conversationHistory),
            { role: 'user', content: message },
          ],
          max_completion_tokens: 600,
        }),
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        if (typeof text === 'string' && text.trim()) {
          if (candidates.length && validateGroundedText(text, message, candidates.map((candidate) => candidate.slug))) {
            return res.status(200).json({ text: text.trim(), mode: 'live', groundedTools: grounded.groundedTools, suggestions: grounded.suggestions });
          }
        }
      }
    } catch {
      clearTimeout(timeout);
      // The browser can still use the published catalog when the provider is down.
    }
  }

  // Graceful fallback to client catalog engine
  return res.status(200).json({
    status: 'grounded_local_mode',
    message: groqKey
      ? 'Live AI is temporarily unavailable. Showing matches from the published catalogue.'
      : 'Live AI is not configured. Showing matches from the published catalogue.',
    text: grounded.text,
    groundedTools: grounded.groundedTools,
    suggestions: grounded.suggestions,
  });
}

function safeJsonParse(value) {
  try { return JSON.parse(value); } catch { return null; }
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.slice(-8).flatMap((item) => {
    if (!item || !['user', 'assistant'].includes(item.sender) || typeof item.text !== 'string') return [];
    const content = item.text.trim().slice(0, 1200);
    return content ? [{ role: item.sender, content }] : [];
  });
}
