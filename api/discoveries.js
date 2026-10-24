import {
  getDiscoveriesListAsync,
  getDiscoveryByIdAsync,
  createDiscoveryAsync,
  updateDiscoveryAsync,
  deleteDiscoveryAsync,
  isAuthorized,
} from '../server/discoveriesStore.js';
import { getSafeApiFailure, logSanitizedApiError } from '../server/apiErrorHandling.js';

function readJsonBody(req) {
  if (req.bodyParseError) return null;
  try {
    const rawBody = req.body;
    if (rawBody === undefined || rawBody === null || rawBody === '') return {};
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
    return body;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const method = req.method;
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const id = url.searchParams.get('id');

  // Set standard JSON headers and security headers
  res.setHeader('Content-Type', 'application/json');

  try {
    // 1. GET /api/discoveries
    if (method === 'GET') {
      const authorized = isAuthorized(req.headers);
      const allParam = url.searchParams.get('all') === 'true';
      const statusParam = url.searchParams.get('status') || (allParam ? 'all' : 'published');
      const searchQuery = url.searchParams.get('q') || '';
      const featuredParam = url.searchParams.get('featured') === 'true';
      const categoryParam = url.searchParams.get('category') || '';

      // If single ID requested
      if (id) {
        const item = await getDiscoveryByIdAsync(id, { isAdmin: authorized });
        if (!item) {
          return res.status(404).json({ error: 'Discovery not found.' });
        }
        return res.status(200).json({ discovery: item });
      }

      const discoveries = await getDiscoveriesListAsync({
        isAdmin: authorized,
        status: authorized ? statusParam : 'published',
        searchQuery,
        featuredOnly: featuredParam,
        category: categoryParam,
      });

      return res.status(200).json({
        discoveries,
        total: discoveries.length,
        isAdmin: authorized,
      });
    }

    // 2. POST /api/discoveries -> Create discovery (Admin only)
    if (method === 'POST') {
      if (!isAuthorized(req.headers)) {
        return res.status(401).json({ error: 'Unauthorized. Moderator access token required.' });
      }

      const body = readJsonBody(req);
      if (!body) return res.status(400).json({ error: 'InvalidRequest', message: 'Request body must be a valid JSON object.' });
      const result = await createDiscoveryAsync(body, req.headers);
      return res.status(result.status).json(result);
    }

    // 3. PATCH /api/discoveries?id=... -> Update discovery (Admin only)
    if (method === 'PATCH') {
      if (!isAuthorized(req.headers)) {
        return res.status(401).json({ error: 'Unauthorized. Moderator access token required.' });
      }
      if (!id) {
        return res.status(400).json({ error: 'Discovery ID parameter is required.' });
      }

      const body = readJsonBody(req);
      if (!body) return res.status(400).json({ error: 'InvalidRequest', message: 'Request body must be a valid JSON object.' });
      const result = await updateDiscoveryAsync(id, body, req.headers);
      return res.status(result.status).json(result);
    }

    // 4. DELETE /api/discoveries?id=... -> Delete discovery (Admin only)
    if (method === 'DELETE') {
      if (!isAuthorized(req.headers)) {
        return res.status(401).json({ error: 'Unauthorized. Moderator access token required.' });
      }
      if (!id) {
        return res.status(400).json({ error: 'Discovery ID parameter is required.' });
      }

      const result = await deleteDiscoveryAsync(id, req.headers);
      return res.status(result.status).json(result);
    }

    // Unsupported method
    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err) {
    logSanitizedApiError('/api/discoveries', err, req);
    const failure = getSafeApiFailure(err);
    return res.status(failure.status).json(failure.body);
  }
}
