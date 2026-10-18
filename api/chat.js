// Production serverless handler for /api/chat
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (groqKey && message) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'You are the Tech Hacks AI Assistant for techhacksai.com. Ground answers in verified software tools. Differentiate open-source, recurring free plans, starter trial credits, and paid-only tools. Support English and Hindi queries.',
            },
            { role: 'user', content: message },
          ],
          max_tokens: 600,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return res.status(200).json({ text });
        }
      }
    } catch {
      // Fall through to local fallback
    }
  }

  // Graceful fallback to client catalog engine
  return res.status(200).json({
    status: 'grounded_local_mode',
    text: null,
  });
}
