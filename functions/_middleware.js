// Staging-only crawler guard for public preview deployments.
// The production Vercel site and the direct-upload Pages fallback do not set
// SWITCHROUTE_STAGING, so their robots behavior remains unchanged.
export async function onRequest(context) {
  const response = await context.next();
  if (context.env?.SWITCHROUTE_STAGING !== 'true') return response;

  const url = new URL(context.request.url);
  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');

  if (url.pathname === '/robots.txt') {
    headers.set('Content-Type', 'text/plain; charset=utf-8');
    headers.set('Cache-Control', 'no-store');
    return new Response('User-agent: *\\nDisallow: /\\n', {
      status: 200,
      headers,
    });
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
