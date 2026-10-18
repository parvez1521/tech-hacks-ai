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
              const { message } = JSON.parse(body || '{}');
              const groqKey = process.env.GROQ_API_KEY;
              const geminiKey = process.env.GEMINI_API_KEY;

              if (groqKey && message) {
                try {
                  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
                            'You are the Tech Hacks AI Assistant for techhacksai.com. Ground your answers in real software tools. Never invent pricing. Differentiate open-source, recurring free plans, starter trial credits, and paid-only tools. Support English and Hindi queries.',
                        },
                        { role: 'user', content: message },
                      ],
                      max_tokens: 600,
                    }),
                  });

                  if (groqRes.ok) {
                    const groqData = await groqRes.json();
                    const text = groqData.choices?.[0]?.message?.content;
                    if (text) {
                      res.setHeader('Content-Type', 'application/json');
                      res.statusCode = 200;
                      res.end(JSON.stringify({ text }));
                      return;
                    }
                  }
                } catch {
                  // Fall back gracefully
                }
              }

              // Return fallback signal so client uses grounded catalog retrieval
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  status: 'grounded_local_mode',
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

import submissionsHandler from './api/submissions.js';
import discoveriesHandler from './api/discoveries.js';

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
            } catch {
              req.body = {};
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
            } catch {
              req.body = {};
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

export default defineConfig({
  plugins: [react(), chatApiPlugin(), submissionsApiPlugin(), discoveriesApiPlugin()],
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
          if (id.includes('src/pages/')) {
            return 'app-pages';
          }
        },
      },
    },
  },

});
