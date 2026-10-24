import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function chatApiPlugin() {
  return {
    name: 'chat-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/chat' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const message = typeof parsed?.message === 'string' ? parsed.message.trim() : '';
              const groqKey = process.env.GROQ_API_KEY;

              if (!message) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Enter a message to continue.' }));
                return;
              }
              if (message.length > 8000) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 413;
                res.end(JSON.stringify({ error: 'Message is too long. Keep it under 8,000 characters.' }));
                return;
              }

              if (groqKey && message) {
                let timeout;
                try {
                  const controller = new AbortController();
                  timeout = setTimeout(() => controller.abort(), 20000);
                  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
                          content:
                            'You are the Tech Hacks AI Assistant for techhacksai.com. Ground your answers in real software tools. Never invent pricing. Differentiate open-source, recurring free plans, starter trial credits, and paid-only tools. Support English and Hindi queries.',
                        },
                        ...normalizeChatHistory(parsed?.conversationHistory),
                        { role: 'user', content: message },
                      ],
                      max_completion_tokens: 600,
                    }),
                  });
                  clearTimeout(timeout);

                  if (groqRes.ok) {
                    const groqData = await groqRes.json();
                    const text = groqData?.choices?.[0]?.message?.content;
                    if (typeof text === 'string' && text.trim()) {
                      res.setHeader('Content-Type', 'application/json');
                      res.statusCode = 200;
                      res.end(JSON.stringify({ text: text.trim(), mode: 'live' }));
                      return;
                    }
                  }
                } catch {
                  clearTimeout(timeout);
                  // Fall back gracefully
                }
              }

              // Return fallback signal so client uses grounded catalog retrieval
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  status: 'grounded_local_mode',
                  message: groqKey
                    ? 'Live AI is temporarily unavailable. Showing matches from the published catalogue.'
                    : 'Live AI is not configured. Showing matches from the published catalogue.',
                  text: null,
                })
              );
            } catch (err) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ status: 'fallback_error', text: null }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

function normalizeChatHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.slice(-8).flatMap((item) => {
    if (!item || !['user', 'assistant'].includes(item.sender) || typeof item.text !== 'string') return [];
    const content = item.text.trim().slice(0, 1200);
    return content ? [{ role: item.sender, content }] : [];
  });
}

import submissionsHandler from './api/submissions.js';
import discoveriesHandler from './api/discoveries.js';
import transcribeHandler from './api/transcribe.js';

function submissionsApiPlugin() {
  return {
    name: 'submissions-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/submissions')) {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              req.body = body ? JSON.parse(body) : {};
              req.bodyParseError = false;
            } catch {
              req.body = null;
              req.bodyParseError = true;
            }
            res.status = (code) => {
              res.statusCode = code;
              return {
                json: (payload) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(payload));
                },
              };
            };
            res.json = (payload) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(payload));
            };

            await submissionsHandler(req, res);
          });
          return;
        }
        next();
      });
    },
  };
}

function discoveriesApiPlugin() {
  return {
    name: 'discoveries-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/discoveries')) {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              req.body = body ? JSON.parse(body) : {};
              req.bodyParseError = false;
            } catch {
              req.body = null;
              req.bodyParseError = true;
            }
            res.status = (code) => {
              res.statusCode = code;
              return {
                json: (payload) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(payload));
                },
              };
            };
            res.json = (payload) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(payload));
            };

            await discoveriesHandler(req, res);
          });
          return;
        }
        next();
      });
    },
  };
}

function transcribeApiPlugin() {
  return {
    name: 'transcribe-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/transcribe')) {
          res.status = (code) => {
            res.statusCode = code;
            return {
              json: (payload) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(payload));
              },
            };
          };
          res.json = (payload) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
          };
          await transcribeHandler(req, res);
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), chatApiPlugin(), submissionsApiPlugin(), discoveriesApiPlugin(), transcribeApiPlugin()],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('src/data/')) {
            return 'catalog-data';
          }
        },
      },
    },
  },

});
